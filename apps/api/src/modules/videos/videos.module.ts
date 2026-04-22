import { Module } from '@nestjs/common';
import { GetVideosUseCase } from './application/use-cases/get-videos.use-case';
import { VIDEOS_SOURCE_PORT, type VideosSourcePort } from './domain/ports/videos-source.port';
import { JsonVideosSourceAdapter } from './infrastructure/adapters/json-videos-source.adapter';
import { VideosController } from './http/videos.controller';
import { PexelsService } from './infrastructure/services/pexels.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [VideosController],
  providers: [
    {
      provide: VIDEOS_SOURCE_PORT,
      useClass: JsonVideosSourceAdapter,
    },
    PexelsService,
    {
      provide: GetVideosUseCase,
      useFactory: (source: VideosSourcePort) => new GetVideosUseCase(source),
      inject: [VIDEOS_SOURCE_PORT],
    },
  ],
  exports: [GetVideosUseCase],
})
export class VideosModule {}
