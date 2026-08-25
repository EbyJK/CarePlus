import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiBody } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from './telegram.service';
import { SendChannelMessageDto } from './dto/send-channel-message.dto';
import { SendChannelPhotoDto } from './dto/send-channel-photo.dto';

@ApiTags('4. Telegram Module')
@Controller('telegram')
export class TelegramController {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Broadcast text message to Telegram channel' })
  @Post('broadcast')
  broadcastMessage(@Body() dto: SendChannelMessageDto) {
    return this.telegramService.sendMessageToChannel(dto);
  }

  @ApiOperation({ summary: 'Send photo to Telegram channel' })
  @Post('send-photo')
  sendPhoto(@Body() dto: SendChannelPhotoDto) {
    return this.telegramService.sendPhotoToChannel(dto);
  }

  @ApiOperation({ summary: 'Receive Telegram webhook updates' })
  @ApiHeader({
    name: 'x-telegram-bot-api-secret-token',
    required: false,
    description: 'Optional Telegram webhook secret token',
    example: 'myscrt_token_998',
  })
  @ApiBody({
    description: 'Telegram update payload',
    schema: {
      type: 'object',
      example: {
        update_id: 123456,
        channel_post: {
          message_id: 1,
          text: 'Hello from Telegram webhook!',
        },
      },
    },
  })
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() update: any,
    @Headers('x-telegram-bot-api-secret-token') secretHeader?: string,
  ) {
    const expectedSecret = this.configService.get<string>('TELEGRAM_WEBHOOK_SECRET');
    if (expectedSecret && secretHeader && secretHeader !== expectedSecret) {
      throw new UnauthorizedException('Invalid Telegram secret token');
    }

    if (update?.channel_post) {
      console.log('Received Telegram Channel Post:', update.channel_post.text);
    }

    return { ok: true, received: update };
  }
}
