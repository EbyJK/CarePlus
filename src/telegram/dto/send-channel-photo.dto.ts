import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendChannelPhotoDto {
  @ApiProperty({ example: 'https://picsum.photos/600/400', description: 'Public URL or Base64 data of the photo' })
  @IsNotEmpty()
  @IsString({ message: 'Photo URL must be a valid HTTP/HTTPS URL or Base64 image string' })
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
