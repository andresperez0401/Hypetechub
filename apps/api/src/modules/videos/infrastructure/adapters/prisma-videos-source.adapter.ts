import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/prisma/prisma.service';
import { VideoEntity } from '../../domain/entities/video.entity';
import { VideosSourcePort } from '../../domain/ports/videos-source.port';
import { PexelsService } from '../services/pexels.service';

@Injectable()
export class PrismaVideosSourceAdapter implements VideosSourcePort {
  private cachedVideos: VideoEntity[] | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly pexelsService: PexelsService,
  ) {}

  async getVideos(): Promise<VideoEntity[]> {
    if (this.cachedVideos) return this.cachedVideos;

    const records = await this.prisma.video.findMany();

    const videoPromises = records.map(async (record) => {
      const thumbnailUrl = await this.pexelsService.getImageUrlForTitle(record.title);
      return new VideoEntity(
        record.id,
        record.title,
        record.channelTitle,
        record.publishedAt.toISOString(),
        thumbnailUrl,
        record.viewCount,
        record.likeCount,
        record.commentCount ?? -1,
      );
    });

    this.cachedVideos = await Promise.all(videoPromises);
    return this.cachedVideos;
  }
}
