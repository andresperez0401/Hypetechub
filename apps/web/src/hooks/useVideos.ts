'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchVideos } from '@/lib/api/videos.api';
import type { VideoItem, VideosResponse } from '@/lib/types/videos';
import { getApiErrorMessage } from '@/lib/utils/api-error';

interface UseVideosResult {
  data: VideosResponse | null;
  items: VideoItem[];
  featured: VideoItem | null;
  isLoading: boolean;
  error: string | null;
}

export function useVideos(): UseVideosResult {
  const [data, setData] = useState<VideosResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadVideos = async (): Promise<void> => {
      try {
        const response = await fetchVideos();
        if (active) {
          setData(response);
        }
      } catch (err: unknown) {
        if (active) {
          setError(getApiErrorMessage(err, 'No se pudieron cargar los videos.'));
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadVideos();

    return () => {
      active = false;
    };
  }, []);

  const featured = useMemo(() => data?.featured ?? null, [data]);

  const items = useMemo(() => {
    if (!data) return [];
    return data.items.filter((video) => video.id !== data.featured.id);
  }, [data]);

  return { data, featured, items, isLoading, error };
}
