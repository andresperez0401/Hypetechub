import type { VideoEntity } from '../../domain/entities/video.entity';
import { HypeCalculatorService } from '../../domain/services/hype-calculator.service';
import type { VideosSourcePort } from '../../domain/ports/videos-source.port';
import { RelativeTimeService } from '../services/relative-time.service';
import type { VideoItemOutput, VideosOutput } from '../types';

/**
 * Pure application use case — no NestJS imports.
 * Wired via factory provider in VideosModule.
 */
export class GetVideosUseCase {
  private readonly hypeCalculator = new HypeCalculatorService();
  private readonly relativeTimeService = new RelativeTimeService();

  constructor(private readonly videosSource: VideosSourcePort) {}

  async execute(): Promise<VideosOutput> {
    const videos = await this.videosSource.getVideos();

    const items = videos
      .map((video) => this.toOutput(video))
      .sort((a, b) => b.hypeScore - a.hypeScore);

    const featured = items[0];

    return { items, featured };
  }

  private toOutput(video: VideoEntity): VideoItemOutput {
    return {
      id: video.id,
      title: video.title,
      channelName: video.channelName,
      thumbnailUrl: video.thumbnailUrl,
      views: video.views,
      likes: video.likes,
      comments: video.commentsDisabled ? 0 : video.comments,
      hypeScore: this.hypeCalculator.calculate(video),
      relativePublishedAt: this.relativeTimeService.fromNow(video.publishedAt),
      isTutorial: video.isTutorial,
      commentsDisabled: video.commentsDisabled,
    };
  }
}
