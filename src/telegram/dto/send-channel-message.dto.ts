import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ParseMode {
  HTML = 'HTML',
  MARKDOWN_V2 = 'MarkdownV2',
}

export class SendChannelMessageDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  channelId?: string;

  @IsOptional()
  @IsEnum(ParseMode)
  parseMode?: ParseMode;

  @IsOptional()
  @IsBoolean()
  disableNotification?: boolean;
}
