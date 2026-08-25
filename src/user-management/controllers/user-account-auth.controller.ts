import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserAccountAuthService } from '../services/user-account-auth.service';
import { UserAccountAdminService } from '../services/user-account-admin.service';
import { CreateUserAccountDto } from '../dto/create-user-account.dto';
import { UserLoginDto } from '../dto/user-login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { RequestOtpDto } from '../dto/request-otp.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UserJwtAuthGuard } from '../guards/user-jwt-auth.guard';
import { CurrentAccount } from '../decorators/current-account.decorator';

@ApiTags('1. User Management - Auth')
@Controller('user-management/auth')
export class UserAccountAuthController {
  constructor(
    private readonly authService: UserAccountAuthService,
    private readonly adminService: UserAccountAdminService,
  ) {}

  @ApiOperation({ summary: 'Register a new user account (Public)' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateUserAccountDto) {
    const user = await this.adminService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
      data: user,
    };
  }

  @ApiOperation({ summary: 'Login user and receive JWT access token' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: UserLoginDto, @Req() req: any) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    const result = await this.authService.login(dto, ipAddress);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: result,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user and invalidate token session' })
  @Post('logout')
  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentAccount('id') userId: number, @Req() req: any) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    await this.authService.logout(userId, ipAddress);

    return {
      statusCode: HttpStatus.OK,
      message: 'Logout successful',
      data: null,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password for logged in user' })
  @Post('change-password')
  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentAccount('id') userId: number,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(userId, dto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Password changed successfully',
      data: null,
    };
  }

  @ApiOperation({ summary: 'Request OTP code for password reset' })
  @Post('forgot-password/otp')
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() dto: RequestOtpDto) {
    const result = await this.authService.requestPasswordResetOtp(dto);

    return {
      statusCode: HttpStatus.OK,
      message: result.message,
      data: result.otpCode ? { otpCode: result.otpCode } : null,
    };
  }

  @ApiOperation({ summary: 'Reset password using OTP code' })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPasswordWithOtp(dto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Password reset successfully',
      data: null,
    };
  }
}
