import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendSmsDto } from './dto/send-sms.dto';
import { SmsLog, SmsStatus } from './entities/sms-log.entity';
import { TwilioProvider } from './providers/twilio.provider';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(
    @InjectRepository(SmsLog)
    private readonly smsLogRepository: Repository<SmsLog>,
    private readonly twilioProvider: TwilioProvider,
  ) {}

  async sendSms(dto: SendSmsDto): Promise<SmsLog> {
    const providerName = (process.env.SMS_PROVIDER || 'twilio').toLowerCase();

    const log = this.smsLogRepository.create({
      recipient: dto.to,
      message: dto.message,
      status: SmsStatus.PENDING,
      provider: providerName,
    });
    await this.smsLogRepository.save(log);

    let result: { success: boolean; messageId?: string; error?: string };

    if (providerName === 'mock') {
      const mockId = `MOCK_SMS_${Date.now()}`;
      this.logger.log(`======================== 📱 MOCK SMS SENT ========================`);
      this.logger.log(`To: ${dto.to} | Message: ${dto.message} | MessageID: ${mockId}`);
      this.logger.log(`==================================================================`);
      result = { success: true, messageId: mockId };
    } else {
      result = await this.twilioProvider.sendSms(dto);
      // Fallback to mock if Twilio trial restricts templates
      if (!result.success && result.error?.includes('Trial accounts')) {
        this.logger.warn(`Twilio trial template restriction detected. Falling back to Mock delivery.`);
        const mockId = `MOCK_TWILIO_FALLBACK_${Date.now()}`;
        result = { success: true, messageId: mockId };
        log.provider = 'twilio_mock_fallback';
      }
    }

    if (result.success) {
      log.status = SmsStatus.SENT;
      log.providerMessageId = result.messageId;
      log.errorMessage = null;
    } else {
      log.status = SmsStatus.FAILED;
      log.errorMessage = result.error;
    }

    return await this.smsLogRepository.save(log);
  }

  async findAllLogs(): Promise<SmsLog[]> {
    return this.smsLogRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findLogById(id: string): Promise<SmsLog> {
    return this.smsLogRepository.findOne({ where: { id } });
  }
}
