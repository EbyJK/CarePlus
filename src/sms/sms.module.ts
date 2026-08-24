import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { SmsLog } from './entities/sms-log.entity';
import { TwilioProvider } from './providers/twilio.provider';

@Module({
  imports: [TypeOrmModule.forFeature([SmsLog]), ConfigModule],
  controllers: [SmsController],
  providers: [SmsService, TwilioProvider],
  exports: [SmsService],
})
export class SmsModule {}
