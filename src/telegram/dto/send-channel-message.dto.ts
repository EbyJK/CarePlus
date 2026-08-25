import { IsNotEmpty, IsOptional, IsString, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendChannelMessageDto {
  @ApiProperty({ example: '🔥 Important Announcement: System upgrade completed!', description: 'Telegram message text' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(4096, { message: 'Telegram text message cannot exceed 4096 characters' })
  message: string;

  @ApiPropertyOptional({ example: '@my_channel_id', description: 'Optional channel ID' })
  @IsOptional()
  @IsString()
  channelId?: string;

  @ApiPropertyOptional({ example: 'HTML', description: 'Parse mode (HTML or Markdown)' })
  @IsOptional()
  @IsString()
  parseMode?: string;

  @ApiPropertyOptional({ example: false, description: 'Disable notification alert' })
  @IsOptional()
  @IsBoolean()
  disableNotification?: boolean;
}
