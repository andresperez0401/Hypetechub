import { Injectable } from '@nestjs/common';
import { VideoEntity } from '../../domain/entities/video.entity';
import { VideosSourcePort } from '../../domain/ports/videos-source.port';
import { PexelsService } from '../services/pexels.service';
import { MOCK_YOUTUBE_DATA } from './mock-videos.data';

@Injectable()
export class JsonVideosSourceAdapter implements VideosSourcePort {
  private cachedVideos: VideoEntity[] | null = null;

  constructor(private readonly pexelsService: PexelsService) {}

  async getVideos(): Promise<VideoEntity[]> {
    if (this.cachedVideos) return this.cachedVideos;

    const data = MOCK_YOUTUBE_DATA;

    const videoPromises = data.items.map(async (item) => {
      const hasComments = item.statistics.commentCount !== undefined;
      const comments = hasComments ? parseInt(item.statistics.commentCount!, 10) : -1;

      const pexelsThumbnailUrl = await this.pexelsService.getImageUrlForTitle(item.snippet.title);

      return new VideoEntity(
        item.id,
        item.snippet.title,
        item.snippet.channelTitle,
        item.snippet.publishedAt,
        pexelsThumbnailUrl, // Enriched from Pexels API
        parseInt(item.statistics.viewCount, 10),
        parseInt(item.statistics.likeCount, 10),
        comments,
      );
    });

    this.cachedVideos = await Promise.all(videoPromises);
    return this.cachedVideos;
  }
}
