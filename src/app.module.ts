import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SmsModule } from './sms/sms.module';
import { TelegramModule } from './telegram/telegram.module';
import { UserManagementModule } from './user-management/user-management.module';
import { User } from './users/entities/user.entity';
import { SmsLog } from './sms/entities/sms-log.entity';
import { UserAccount } from './user-management/entities/user-account.entity';
import { UserAuditAction } from './user-management/entities/user-audit-action.entity';
import { UserOtp } from './user-management/entities/user-otp.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get<string>('DB_TYPE', 'postgres');
        if (dbType === 'sqlite') {
          return {
            type: 'sqlite',
            database: configService.get<string>('DB_NAME', 'database.sqlite'),
            entities: [User, SmsLog, UserAccount, UserAuditAction, UserOtp],
            synchronize: true,
          };
        }
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_NAME', 'nest_modules_db'),
          entities: [User, SmsLog, UserAccount, UserAuditAction, UserOtp],
          synchronize: true,
          logging: false,
        };
      },
    }),
    UsersModule,
    AuthModule,
    SmsModule,
    TelegramModule,
    UserManagementModule,
  ],
})
export class AppModule {}
