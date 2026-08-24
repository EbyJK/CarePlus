import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from './telegram.service';
import { SendChannelMessageDto } from './dto/send-channel-message.dto';
import { SendChannelPhotoDto } from './dto/send-channel-photo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('telegram')
export class TelegramController {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('broadcast')
  broadcastMessage(@Body() dto: SendChannelMessageDto) {
    return this.telegramService.sendMessageToChannel(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-photo')
  sendPhoto(@Body() dto: SendChannelPhotoDto) {
    return this.telegramService.sendPhotoToChannel(dto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() update: any,
    @Headers('x-telegram-bot-api-secret-token') secretHeader: string,
  ) {
    const expectedSecret = this.configService.get<string>('TELEGRAM_WEBHOOK_SECRET');
    if (expectedSecret && secretHeader !== expectedSecret) {
      throw new UnauthorizedException('Invalid Telegram secret token');
    }

    if (update.channel_post) {
      console.log('Received Telegram Channel Post:', update.channel_post.text);
    }

    return { ok: true };
  }
}
