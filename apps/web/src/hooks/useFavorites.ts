'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAuthContext } from '@/features/auth/context/AuthContext';

interface UseFavoritesResult {
  favoriteIds: Set<string>;
  isLoading: boolean;
  toggleFavorite: (videoId: string) => Promise<void>;
  isFavorite: (videoId: string) => boolean;
}

export function useFavorites(): UseFavoritesResult {
  const { isAuthenticated } = useAuthContext();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      return;
    }

    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<{ videoId: string }[]>('/favorites');
        const ids = new Set(response.data.map((f) => f.videoId));
        setFavoriteIds(ids);
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };

    void loadFavorites();
  }, [isAuthenticated]);

  const toggleFavorite = useCallback(async (videoId: string) => {
    if (!isAuthenticated) return;

    const isFav = favoriteIds.has(videoId);

    // Optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFav) {
        next.delete(videoId);
      } else {
        next.add(videoId);
      }
      return next;
    });

    try {
      if (isFav) {
        await apiClient.delete(`/favorites/${videoId}`);
      } else {
        await apiClient.post('/favorites', { videoId });
      }
    } catch {
      // Revert
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFav) {
          next.add(videoId);
        } else {
          next.delete(videoId);
        }
        return next;
      });
    }
  }, [isAuthenticated, favoriteIds]);

  const isFavorite = useCallback((videoId: string) => favoriteIds.has(videoId), [favoriteIds]);

  return { favoriteIds, isLoading, toggleFavorite, isFavorite };
}
