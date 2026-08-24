import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class SendChannelPhotoDto {
  @IsNotEmpty()
  @IsUrl()
  photoUrl: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  channelId?: string;
}
