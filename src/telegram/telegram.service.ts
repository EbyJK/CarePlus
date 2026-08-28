import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as https from 'https';
import * as FormData from 'form-data';
import { SendChannelMessageDto } from './dto/send-channel-message.dto';
import { SendChannelPhotoDto } from './dto/send-channel-photo.dto';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly httpsAgent = new https.Agent({ family: 4 });

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private getApiUrl(): string {
    const token = (this.configService.get<string>('TELEGRAM_BOT_TOKEN') || process.env.TELEGRAM_BOT_TOKEN)?.trim();
    console.log(`[DEBUG TELEGRAM BOT TOKEN]: '${token}'`);
    return `https://api.telegram.org/bot${token}`;
  }

  private getDefaultChannelId(): string {
    return this.configService.get<string>('TELEGRAM_DEFAULT_CHANNEL_ID')?.trim();
  }

  async sendMessageToChannel(dto: SendChannelMessageDto): Promise<any> {
    const chatId = dto.channelId || this.getDefaultChannelId();
    const parseMode = dto.parseMode || this.configService.get<string>('TELEGRAM_PARSE_MODE', 'HTML');

    try {
      const url = `${this.getApiUrl()}/sendMessage`;
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {
            chat_id: chatId,
            text: dto.message,
            parse_mode: parseMode,
            disable_notification: dto.disableNotification || false,
          },
          {
            httpsAgent: this.httpsAgent,
          },
        ),
      );

      this.logger.log(`Telegram message sent successfully to channel: ${chatId}`);
      return response.data;
    } catch (error) {
      const errorDetail = error.response?.data || error.message;
      this.logger.error(`Failed to send Telegram message: ${JSON.stringify(errorDetail)}`, error.stack);
      throw new BadRequestException(`Telegram API Error: ${JSON.stringify(errorDetail)}`);
    }
  }

  async sendPhotoToChannel(dto: SendChannelPhotoDto): Promise<any> {
    const chatId = dto.channelId || this.getDefaultChannelId();
    const url = `${this.getApiUrl()}/sendPhoto`;

    try {
      if (dto.photoUrl && dto.photoUrl.startsWith('data:image')) {
        const base64Data = dto.photoUrl.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const form = new FormData();
        form.append('chat_id', chatId);
        form.append('caption', dto.caption || '');
        form.append('parse_mode', 'HTML');
        form.append('photo', buffer, { filename: 'clinical_photo.png' });

        const response = await firstValueFrom(
          this.httpService.post(url, form, {
            headers: form.getHeaders(),
            httpsAgent: this.httpsAgent,
          }),
        );
        this.logger.log(`Telegram Base64 photo uploaded successfully to channel: ${chatId}`);
        return response.data;
      }

      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {
            chat_id: chatId,
            photo: dto.photoUrl,
            caption: dto.caption,
            parse_mode: 'HTML',
          },
          {
            httpsAgent: this.httpsAgent,
          },
        ),
      );
      this.logger.log(`Telegram photo URL sent successfully to channel: ${chatId}`);
      return response.data;
    } catch (error) {
      const errorDetail = error.response?.data || error.message;
      this.logger.error(`Failed to send Telegram photo: ${JSON.stringify(errorDetail)}`, error.stack);
      throw new BadRequestException(`Telegram Photo Error: ${JSON.stringify(errorDetail)}`);
    }
  }
}
