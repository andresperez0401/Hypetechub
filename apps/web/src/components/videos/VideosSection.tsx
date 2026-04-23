'use client';

import { useMemo, useState } from 'react';
import { useVideos } from '@/hooks/useVideos';
import { CrownVideoCard } from './CrownVideoCard';
import { VideoCard } from './VideoCard';
import { VideoSkeleton } from './VideoSkeleton';
import type { VideoItem } from '@/lib/types/videos';

type SortKey = 'hypeScore' | 'views' | 'likes' | 'comments';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'hypeScore', label: 'Puntuación' },
  { key: 'views', label: 'Vistas' },
  { key: 'likes', label: 'Likes' },
  { key: 'comments', label: 'Comentarios' },
];

function sortVideos(videos: VideoItem[], key: SortKey): VideoItem[] {
  return [...videos].sort((a, b) => b[key] - a[key]);
}

function filterVideos(videos: VideoItem[], query: string): VideoItem[] {
  if (!query.trim()) return videos;
  const q = query.toLowerCase();
  return videos.filter(
    v => v.title.toLowerCase().includes(q) || v.channelName.toLowerCase().includes(q),
  );
}

export function VideosSection(): JSX.Element {
  const { items, featured, isLoading, error } = useVideos();
  const [sortKey, setSortKey] = useState<SortKey>('hypeScore');
  const [query, setQuery] = useState('');

  const processedItems = useMemo(
    () => sortVideos(filterVideos(items, query), sortKey),
    [items, query, sortKey],
  );

  if (isLoading) return <VideoSkeleton />;

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <span className="text-3xl">⚠️</span>
        <h3 className="mt-2 font-semibold text-red-700">Error al cargar videos</h3>
        <p className="mt-1 text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!featured && items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <span className="text-4xl">📭</span>
        <h3 className="mt-3 font-semibold text-slate-700">No hay videos disponibles</h3>
        <p className="mt-1 text-sm text-slate-400">Vuelve más tarde para descubrir contenido nuevo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {featured && <CrownVideoCard video={featured} />}

      {/* Filters bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por título o canal..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Ordenar:</span>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSortKey(opt.key)}
              className={`min-h-[36px] min-w-[44px] rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors touch-manipulation select-none ${
                sortKey === opt.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 active:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {processedItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <span className="text-4xl">🔍</span>
          <h3 className="mt-3 font-semibold text-slate-700">Sin resultados para &ldquo;{query}&rdquo;</h3>
          <p className="mt-1 text-sm text-slate-400">Prueba con otro título o nombre de canal.</p>
          <button type="button" onClick={() => setQuery('')} className="btn-secondary mt-4 text-sm">Limpiar búsqueda</button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {processedItems.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
