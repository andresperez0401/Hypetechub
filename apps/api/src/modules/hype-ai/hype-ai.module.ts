import { Module } from '@nestjs/common';
import { ChatWithAiUseCase } from './application/use-cases/chat-with-ai.use-case';
import { DeepSeekService } from './infrastructure/services/deepseek.service';
import { VideoContextService } from './infrastructure/services/video-context.service';
import { HypeAiController } from './http/hype-ai.controller';
import { VideosModule } from '../videos/videos.module';

@Module({
  imports: [VideosModule],
  controllers: [HypeAiController],
  providers: [
    DeepSeekService,
    VideoContextService,
    {
      provide: ChatWithAiUseCase,
      useFactory: (deepSeek: DeepSeekService, videoContext: VideoContextService) =>
        new ChatWithAiUseCase({
          getVideoContext: () => videoContext.buildContext(),
          callDeepSeek: (_systemPrompt, messages) => deepSeek.chat(messages),
        }),
      inject: [DeepSeekService, VideoContextService],
    },
  ],
})
export class HypeAiModule {}
