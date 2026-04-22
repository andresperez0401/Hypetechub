import { ApiProperty } from '@nestjs/swagger';
import type { FavoriteOutput } from '../../../application/types';

/** HTTP response DTO — Swagger annotations live in infrastructure, not application. */
export class FavoriteResponseDto implements FavoriteOutput {
  @ApiProperty({ example: 'clx1abc123' })
  id!: string;

  @ApiProperty({ example: 'user-uuid' })
  userId!: string;

  @ApiProperty({ example: 'yt-3' })
  videoId!: string;

  @ApiProperty({ example: '2026-04-22T15:00:00.000Z' })
  createdAt!: string;
}
