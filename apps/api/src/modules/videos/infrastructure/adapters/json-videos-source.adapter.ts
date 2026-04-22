import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { VideoEntity } from '../../domain/entities/video.entity';
import { VideosSourcePort } from '../../domain/ports/videos-source.port';
import { PexelsService } from '../services/pexels.service';

interface RawYouTubeItem {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      high: { url: string };
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount?: string;
  };
}

interface RawYouTubeResponse {
  kind: string;
  items: RawYouTubeItem[];
}

@Injectable()
export class JsonVideosSourceAdapter implements VideosSourcePort {
  private cachedVideos: VideoEntity[] | null = null;

  constructor(private readonly pexelsService: PexelsService) {}

  async getVideos(): Promise<VideoEntity[]> {
    if (this.cachedVideos) return this.cachedVideos;

    const filePath = join(process.cwd(), 'mock-youtube-api.json');
    const raw = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw) as RawYouTubeResponse;

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
