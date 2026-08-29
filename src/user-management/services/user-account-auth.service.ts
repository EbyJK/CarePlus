import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserAccount } from '../entities/user-account.entity';
import { UserOtp } from '../entities/user-otp.entity';
import { UserLoginDto } from '../dto/user-login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { RequestOtpDto } from '../dto/request-otp.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UserAccountAuditService } from './user-account-audit.service';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

@Injectable()
export class UserAccountAuthService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userRepository: Repository<UserAccount>,
    @InjectRepository(UserOtp)
    private readonly otpRepository: Repository<UserOtp>,
    private readonly jwtService: JwtService,
    private readonly auditService: UserAccountAuditService,
  ) {}

  async login(
    dto: UserLoginDto,
    ipAddress?: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const cleanEmail = (dto.email || '').trim().toLowerCase();
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('LOWER(user.email) = :email', { email: cleanEmail })
      .andWhere('user.isDeleted = false')
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new ForbiddenException(
        'Account is deactivated. Please contact support.',
      );
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 60000,
      );
      throw new ForbiddenException(
        `Account is locked due to multiple failed login attempts. Try again in ${minutesLeft} minutes.`,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60000);
      }
      await this.userRepository.save(user);

      await this.auditService.logAction({
        userAccountId: user.id,
        action: 'FAILED_LOGIN_ATTEMPT',
        description: `Failed login attempt (${user.failedLoginAttempts}/${MAX_FAILED_ATTEMPTS})`,
        ipAddress,
      });

      throw new UnauthorizedException('Invalid email or password');
    }

    user.failedLoginAttempts = 0;
    user.lockedUntil = null;

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.save(user);

    await this.auditService.logAction({
      userAccountId: user.id,
      action: 'USER_LOGIN_SUCCESS',
      description: `User logged in successfully`,
      ipAddress,
    });

    const userResponse = { ...user };
    delete (userResponse as any).passwordHash;
    delete (userResponse as any).refreshTokenHash;

    return {
      accessToken,
      refreshToken,
      user: userResponse,
    };
  }

  async logout(userId: number, ipAddress?: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.refreshTokenHash = null;
      await this.userRepository.save(user);

      await this.auditService.logAction({
        userAccountId: userId,
        action: 'USER_LOGOUT',
        description: `User logged out`,
        ipAddress,
      });
    }
    return true;
  }

  async changePassword(
    userId: number,
    dto: ChangePasswordDto,
  ): Promise<boolean> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new BadRequestException('Current password does not match');
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.save(user);

    await this.auditService.logAction({
      userAccountId: userId,
      action: 'PASSWORD_CHANGED',
      description: `User changed password successfully`,
    });

    return true;
  }

  async requestPasswordResetOtp(
    dto: RequestOtpDto,
  ): Promise<{ message: string; otpCode?: string }> {
    const cleanEmail = (dto.email || '').trim().toLowerCase();
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = :email', { email: cleanEmail })
      .andWhere('user.isDeleted = false')
      .getOne();

    if (!user) {
      return { message: 'If email exists, OTP code has been generated.' };
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60000);

    const otp = this.otpRepository.create({
      email: cleanEmail,
      otpCode,
      purpose: 'PASSWORD_RESET',
      expiresAt,
      isUsed: false,
    });

    await this.otpRepository.save(otp);

    await this.auditService.logAction({
      userAccountId: user.id,
      action: 'OTP_REQUESTED',
      description: `Requested password reset OTP`,
    });

    return {
      message: 'OTP sent successfully to your email.',
      otpCode,
    };
  }

  async resetPasswordWithOtp(dto: ResetPasswordDto): Promise<boolean> {
    const cleanEmail = (dto.email || '').trim().toLowerCase();
    const otp = await this.otpRepository.findOne({
      where: {
        email: cleanEmail,
        otpCode: dto.otpCode,
        isUsed: false,
        purpose: 'PASSWORD_RESET',
      },
      order: { createdAt: 'DESC' },
    });

    if (!otp || otp.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP code');
    }

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = :email', { email: cleanEmail })
      .andWhere('user.isDeleted = false')
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    user.lockedUntil = null;
    user.failedLoginAttempts = 0;
    await this.userRepository.save(user);

    otp.isUsed = true;
    await this.otpRepository.save(otp);

    await this.auditService.logAction({
      userAccountId: user.id,
      action: 'PASSWORD_RESET_SUCCESS',
      description: `Reset password successfully via OTP`,
    });

    return true;
  }
}
