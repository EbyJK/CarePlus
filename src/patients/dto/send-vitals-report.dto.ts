import { IsNotEmpty, IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendVitalsReportDto {
  @ApiProperty({ example: 'dr.smith@cardiology.org', description: 'Attending Doctor Email Address' })
  @IsEmail()
  @IsNotEmpty()
  doctorEmail: string;

  @ApiProperty({ example: 'Dr. Sarah Jenkins', description: 'Sender Staff Physician Name' })
  @IsOptional()
  @IsString()
  senderName?: string;
}
