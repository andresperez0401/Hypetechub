import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import type { LoginInput } from '../../../application/types';

export class LoginRequestDto implements LoginInput {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'strong-password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ description: 'Cloudflare Turnstile token from the frontend widget' })
  @IsString()
  turnstileToken!: string;
}
