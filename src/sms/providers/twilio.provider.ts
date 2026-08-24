import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISmsProvider, SmsSendOptions, SmsSendResponse } from '../interfaces/sms-provider.interface';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioProvider implements ISmsProvider {
  private readonly logger = new Logger(TwilioProvider.name);

  constructor(private readonly configService: ConfigService) {}

  private getTwilioClient(): any {
    const accountSid = (this.configService.get<string>('TWILIO_ACCOUNT_SID') || process.env.TWILIO_ACCOUNT_SID)?.trim();
    const authToken = (this.configService.get<string>('TWILIO_AUTH_TOKEN') || process.env.TWILIO_AUTH_TOKEN)?.trim();
    this.logger.log(`[DEBUG TWILIO SID]: '${accountSid}'`);
    if (accountSid && authToken && !accountSid.includes('XXXXX')) {
      const clientFactory = typeof Twilio === 'function' ? Twilio : (Twilio as any).default || Twilio;
      return clientFactory(accountSid, authToken);
    }
    return null;
  }

  async sendSms(options: SmsSendOptions): Promise<SmsSendResponse> {
    try {
      const client = this.getTwilioClient();
      if (!client) {
        this.logger.warn(`Twilio client is uninitialized or using default placeholder credentials`);
        return {
          success: false,
          error: 'Twilio credentials not configured properly in .env',
        };
      }

      const fromNumber = this.configService.get<string>('TWILIO_FROM_NUMBER');
      const response = await client.messages.create({
        body: options.message,
        from: options.senderId || fromNumber,
        to: options.to,
      });

      return {
        success: true,
        messageId: response.sid,
        rawResponse: response,
      };
    } catch (error) {
      this.logger.error(`Twilio SMS send failed: ${error.message}`, error.stack);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
