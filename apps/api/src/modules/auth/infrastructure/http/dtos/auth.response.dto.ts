import { ApiProperty } from '@nestjs/swagger';
import type { AuthOutput } from '../../../application/types';

export class AuthResponseDto implements AuthOutput {
  @ApiProperty({ example: 'scaffolded' })
  status!: string;

  @ApiProperty({ example: 'Auth flow prepared. Complete integration in next phase.' })
  message!: string;
}
