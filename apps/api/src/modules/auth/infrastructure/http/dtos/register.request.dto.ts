import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import type { RegisterInput } from '../../../application/types';

export class RegisterRequestDto implements RegisterInput {
  @ApiProperty({ example: 'new-user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'secure-password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ description: 'Cloudflare Turnstile token from the frontend widget' })
  @IsString()
  turnstileToken!: string;
}
