import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestOtpDto {
  @ApiProperty({ example: 'admin@example.com', description: 'User email for OTP password reset' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
