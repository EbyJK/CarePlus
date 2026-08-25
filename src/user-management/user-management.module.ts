import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserAccount } from './entities/user-account.entity';
import { UserAuditAction } from './entities/user-audit-action.entity';
import { UserOtp } from './entities/user-otp.entity';

import { UserAccountAdminService } from './services/user-account-admin.service';
import { UserAccountAuthService } from './services/user-account-auth.service';
import { UserAccountAuditService } from './services/user-account-audit.service';
import { UserManagementJwtStrategy } from './strategies/user-management-jwt.strategy';

import { UserAccountAdminController } from './controllers/user-account-admin.controller';
import { UserAccountAuthController } from './controllers/user-account-auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccount, UserAuditAction, UserOtp]),
    PassportModule.register({ defaultStrategy: 'user-management-jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'user_management_secret_key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h',
        },
      }),
    }),
  ],
  controllers: [UserAccountAdminController, UserAccountAuthController],
  providers: [
    UserAccountAdminService,
    UserAccountAuthService,
    UserAccountAuditService,
    UserManagementJwtStrategy,
  ],
  exports: [
    UserAccountAdminService,
    UserAccountAuthService,
    UserAccountAuditService,
  ],
})
export class UserManagementModule {}
