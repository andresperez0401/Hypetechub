import { ApiProperty } from '@nestjs/swagger';
import type { VideoItemOutput, VideosOutput } from '../../../application/types';

export class VideoItemResponseDto implements VideoItemOutput {
  @ApiProperty({ example: 'vid_001' })
  id!: string;

  @ApiProperty({ example: 'TypeScript en 10 minutos - Tutorial' })
  title!: string;

  @ApiProperty({ example: 'FaztClone' })
  channelName!: string;

  @ApiProperty({ example: 'https://via.placeholder.com/300x200/282c34/61dafb?text=TypeScript' })
  thumbnailUrl!: string;

  @ApiProperty({ example: 495933 })
  views!: number;

  @ApiProperty({ example: 44633 })
  likes!: number;

  @ApiProperty({ example: 1785 })
  comments!: number;

  @ApiProperty({ example: 0.1872, description: 'Hype score = (likes + comments) / views. x2 si es tutorial.' })
  hypeScore!: number;

  @ApiProperty({ example: 'Hace 10 meses' })
  relativePublishedAt!: string;

  @ApiProperty({ example: true })
  isTutorial!: boolean;

  @ApiProperty({ example: false })
  commentsDisabled!: boolean;
}

export class VideosResponseDto implements VideosOutput {
  @ApiProperty({ type: [VideoItemResponseDto] })
  items!: VideoItemResponseDto[];

  @ApiProperty({ type: VideoItemResponseDto, description: 'Joya de la Corona — video con mayor hype' })
  featured!: VideoItemResponseDto;
}
