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
    const log = this.smsLogRepository.create({
      recipient: dto.to,
      message: dto.message,
      status: SmsStatus.PENDING,
      provider: 'twilio',
    });
    await this.smsLogRepository.save(log);

    const result = await this.twilioProvider.sendSms(dto);

    if (result.success) {
      log.status = SmsStatus.SENT;
      log.providerMessageId = result.messageId;
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
