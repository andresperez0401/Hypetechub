import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetVideosUseCase } from '../application/use-cases/get-videos.use-case';
import { VideosResponseDto } from '../infrastructure/http/dtos/videos.response.dto';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly getVideosUseCase: GetVideosUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get all videos ranked by hype score' })
  @ApiResponse({
    status: 200,
    description: 'Videos loaded successfully',
    type: VideosResponseDto,
  })
  getVideos(): Promise<VideosResponseDto> {
    return this.getVideosUseCase.execute();
  }
}
