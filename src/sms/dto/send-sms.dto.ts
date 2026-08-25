import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendSmsDto {
  @ApiProperty({ example: '+14155552671', description: 'Recipient phone number in E.164 format' })
  @IsNotEmpty()
  @IsPhoneNumber(undefined, { message: 'Mobile number must be a valid international phone number (e.g. +1234567890)' })
  to: string;

  @ApiProperty({ example: 'Hello! Your verification code is 849201', description: 'SMS content' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1600, { message: 'SMS content cannot exceed 1600 characters' })
  message: string;

  @ApiPropertyOptional({ example: 'CAREMP', description: 'Optional Sender ID' })
  @IsOptional()
  @IsString()
  senderId?: string;
}
