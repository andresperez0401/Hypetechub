import type { VideosResponse } from '@/lib/types/videos';
import { apiClient } from './client';

export async function fetchVideos(): Promise<VideosResponse> {
  try {
    const response = await apiClient.get<VideosResponse>('/videos');
    return response.data;
  } catch {
    throw new Error('No se pudieron obtener los videos desde el backend.');
  }
}
