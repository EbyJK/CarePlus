import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendChannelPhotoDto {
  @ApiProperty({ example: 'https://picsum.photos/600/400', description: 'Public URL of the photo' })
  @IsNotEmpty()
  @IsUrl({}, { message: 'Photo URL must be a valid HTTP/HTTPS URL' })
  photoUrl: string;

  @ApiPropertyOptional({ example: 'Sample Photo Caption', description: 'Optional photo caption' })
  @IsOptional()
  @IsString()
  @MaxLength(1024, { message: 'Caption cannot exceed 1024 characters' })
  caption?: string;

  @ApiPropertyOptional({ example: '@my_channel_id', description: 'Optional channel ID' })
  @IsOptional()
  @IsString()
  channelId?: string;
}
