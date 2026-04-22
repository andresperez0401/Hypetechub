import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/** HTTP request DTO — validation lives in infrastructure, not application. */
export class AddFavoriteRequestDto {
  @ApiProperty({ example: 'yt-3', description: 'YouTube video ID to favorite' })
  @IsString()
  videoId!: string;
}
