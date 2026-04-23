import type { VideosResponse } from '@/lib/types/videos';
import { apiClient } from './client';

let _cache: Promise<VideosResponse> | null = null;

export function fetchVideos(): Promise<VideosResponse> {
  if (!_cache) {
    _cache = apiClient
      .get<VideosResponse>('/videos')
      .then((r) => r.data)
      .catch((err) => {
        _cache = null;
        throw new Error('No se pudieron obtener los videos desde el backend.');
      });
  }
  return _cache;
}
