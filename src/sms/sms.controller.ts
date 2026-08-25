import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/send-sms.dto';

@ApiTags('3. SMS Module')
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @ApiOperation({ summary: 'Send SMS to mobile number' })
  @Post('send')
  sendSms(@Body() dto: SendSmsDto) {
    return this.smsService.sendSms(dto);
  }

  @ApiOperation({ summary: 'Get list of all SMS logs' })
  @Get('logs')
  getLogs() {
    return this.smsService.findAllLogs();
  }

  @ApiOperation({ summary: 'Get single SMS log details' })
  @Get('logs/:id')
  getLogById(@Param('id') id: string) {
    return this.smsService.findLogById(id);
  }
}
