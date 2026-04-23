'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAuthContext } from '@/features/auth/context/AuthContext';

interface FavoritesContextValue {
  favoriteIds: Set<string>;
  isLoading: boolean;
  toggleFavorite: (videoId: string) => Promise<void>;
  isFavorite: (videoId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: PropsWithChildren): JSX.Element {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const prevAuth = useRef<boolean | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const wasAuth = prevAuth.current;
    prevAuth.current = isAuthenticated;

    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      return;
    }

    // Only fetch when auth flips to true (login or first mount with session)
    if (wasAuth === true) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get<{ videoId: string }[]>('/favorites');
        setFavoriteIds(new Set(res.data.map((f) => f.videoId)));
      } catch {
        setFavoriteIds(new Set());
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [isAuthenticated, authLoading]);

  const toggleFavorite = useCallback(async (videoId: string) => {
    if (!isAuthenticated) return;
    const isFav = favoriteIds.has(videoId);

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(videoId) : next.add(videoId);
      return next;
    });

    try {
      if (isFav) {
        await apiClient.delete(`/favorites/${videoId}`);
      } else {
        await apiClient.post('/favorites', { videoId });
      }
    } catch {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        isFav ? next.add(videoId) : next.delete(videoId);
        return next;
      });
    }
  }, [isAuthenticated, favoriteIds]);

  const isFavorite = useCallback((videoId: string) => favoriteIds.has(videoId), [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isLoading, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavoritesContext must be used within FavoritesProvider');
  return ctx;
}
