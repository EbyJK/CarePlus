import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserAccountAdminService } from '../services/user-account-admin.service';

@Injectable()
export class UserManagementJwtStrategy extends PassportStrategy(Strategy, 'user-management-jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly adminService: UserAccountAdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'user_management_secret_key',
    });
  }

  async validate(payload: { sub: number; email: string }) {
    try {
      const user = await this.adminService.findOne(payload.sub);
      if (!user || !user.isActive || user.isDeleted) {
        throw new UnauthorizedException('User is inactive or no longer exists');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('User is inactive or no longer exists');
    }
  }
}
