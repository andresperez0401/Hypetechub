'use client';

import Link from 'next/link';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import { useVideos } from '@/hooks/useVideos';
import { useFavorites } from '@/hooks/useFavorites';
import { VideoCard } from '@/components/videos/VideoCard';
import { VideoSkeleton } from '@/components/videos/VideoSkeleton';

export default function FavoritesPage(): JSX.Element {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const { data, isLoading: videosLoading } = useVideos();
  const { favoriteIds, isLoading: favLoading } = useFavorites();

  if (authLoading || videosLoading || favLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <VideoSkeleton count={3} showCrown={false} />
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center space-y-5">
          <span className="text-5xl">🔒</span>
          <h1 className="text-2xl font-bold text-slate-800">Inicia sesión para ver tus favoritos</h1>
          <p className="text-sm text-slate-400">Crea una cuenta o inicia sesión para guardar y gestionar tus videos favoritos.</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/login" className="btn-primary px-6 py-2.5">Iniciar sesión</Link>
            <Link href="/register" className="btn-secondary px-6 py-2.5">Crear cuenta</Link>
          </div>
        </div>
      </section>
    );
  }

  const all = [...(data?.items ?? [])];
  if (data?.featured) all.unshift(data.featured);
  const favoriteVideos = all.filter(v => favoriteIds.has(v.id));

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Mis favoritos</h1>
        <p className="text-sm text-slate-400">{favoriteVideos.length} video{favoriteVideos.length !== 1 ? 's' : ''} guardado{favoriteVideos.length !== 1 ? 's' : ''}</p>
      </header>

      {favoriteVideos.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <span className="text-4xl">💝</span>
          <h3 className="mt-3 font-semibold text-slate-700">Aún no tienes favoritos</h3>
          <p className="mt-1 text-sm text-slate-400">Explora videos y toca el corazón para guardarlos aquí.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteVideos.map((video, i) => <VideoCard key={video.id} video={video} index={i} />)}
        </div>
      )}
    </section>
  );
}
