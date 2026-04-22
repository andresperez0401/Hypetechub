'use client';

import { useVideos } from '@/hooks/useVideos';
import { CrownVideoCard } from './CrownVideoCard';
import { VideoCard } from './VideoCard';
import { VideoSkeleton } from './VideoSkeleton';

export function VideosSection(): JSX.Element {
  const { items, featured, isLoading, error } = useVideos();

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
    <div className="space-y-8">
      {featured && <CrownVideoCard video={featured} />}
      {items.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((video, i) => <VideoCard key={video.id} video={video} index={i} />)}
        </div>
      )}
    </div>
  );
}
