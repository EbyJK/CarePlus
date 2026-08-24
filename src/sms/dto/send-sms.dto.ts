import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class SendSmsDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  to: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1600)
  message: string;

  @IsOptional()
  @IsString()
  senderId?: string;
}
