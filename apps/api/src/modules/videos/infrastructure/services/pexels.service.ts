import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface PexelsResponse {
  photos: { src: { medium: string; original: string; landscape: string } }[];
}

@Injectable()
export class PexelsService {
  private readonly apiKey: string;
  private readonly defaultPlaceholder: string;
  private imageCache: Map<string, string> = new Map();

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('PEXELS_API_KEY') ?? '';
    this.defaultPlaceholder =
      this.configService.get<string>('DEFAULT_VIDEO_PLACEHOLDER_URL') ??
      'https://placehold.co/600x400?text=Hype+Tech';
  }

  async getImageUrlForTitle(title: string): Promise<string> {
    if (!this.apiKey) return this.defaultPlaceholder;

    // Clean title to get better results
    const query = this.cleanQuery(title);
    if (!query) return this.defaultPlaceholder;

    if (this.imageCache.has(query)) {
      return this.imageCache.get(query)!;
    }

    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
        headers: {
          Authorization: this.apiKey,
        },
      });

      if (!response.ok) {
        return this.defaultPlaceholder;
      }

      const data = (await response.json()) as PexelsResponse;
      if (data.photos && data.photos.length > 0) {
        const url = data.photos[0].src.landscape;
        this.imageCache.set(query, url);
        return url;
      }

      this.imageCache.set(query, this.defaultPlaceholder);
      return this.defaultPlaceholder;
    } catch (error) {
      return this.defaultPlaceholder;
    }
  }

  private cleanQuery(title: string): string {
    return title.replace(/tutorial|explicado fácil|tips|desde cero|polémica|curso completo|en 10 minutos|\(.*\)/gi, '').trim() || 'technology';
  }
}
