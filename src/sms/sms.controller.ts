import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/send-sms.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sms')
@UseGuards(JwtAuthGuard)
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  sendSms(@Body() dto: SendSmsDto) {
    return this.smsService.sendSms(dto);
  }

  @Get('logs')
  getLogs() {
    return this.smsService.findAllLogs();
  }

  @Get('logs/:id')
  getLogById(@Param('id') id: string) {
    return this.smsService.findLogById(id);
  }
}
