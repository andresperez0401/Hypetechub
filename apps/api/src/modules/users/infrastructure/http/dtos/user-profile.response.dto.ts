import { ApiProperty } from '@nestjs/swagger';
import type { UserProfileOutput } from '../../../application/types';

/** HTTP response DTO — Swagger annotations live in infrastructure, not application. */
export class UserProfileResponseDto implements UserProfileOutput {
  @ApiProperty({ example: 'clx1abc123' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'LOCAL', enum: ['LOCAL', 'GOOGLE'] })
  provider!: string;

  @ApiProperty({ example: 'Ada Lovelace', nullable: true })
  displayName!: string | null;

  @ApiProperty({ example: 'https://cdn.example.com/avatar.png', nullable: true })
  avatarUrl!: string | null;
}
