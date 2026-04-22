'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useVideos } from '@/hooks/useVideos';
import { formatHypeScore, formatNumber } from '@/lib/utils/video';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuthContext } from '@/features/auth/context/AuthContext';

export default function VideoDetailPage(): JSX.Element {
  const { id } = useParams();
  const { data, isLoading } = useVideos();
  const { isAuthenticated } = useAuthContext();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6 animate-pulse">
        <div className="h-4 w-32 rounded bg-slate-100" />
        <div className="aspect-video rounded-2xl bg-slate-100" />
        <div className="h-8 w-3/4 rounded bg-slate-100" />
        <div className="h-4 w-1/2 rounded bg-slate-100" />
      </div>
    );
  }

  const video = data?.items.find((v) => v.id === id) ?? (data && data.featured.id === id ? data.featured : null);

  if (!video) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="mt-4 text-2xl font-medium text-slate-800">Video no encontrado</h1>
        <p className="mt-2 text-sm text-slate-500">El video que buscas no existe en el catálogo actual.</p>
        <Link href="/videos" className="btn-primary mt-6 inline-flex">← Volver a videos</Link>
      </div>
    );
  }

  const isCrown = data?.featured.id === video.id;
  const isFav = isFavorite(video.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/videos" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Volver a videos
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative">
          <img src={video.thumbnailUrl} alt={video.title} className="aspect-video w-full object-cover bg-slate-100" />
          
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {isCrown && (
              <div className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                Joya de la Corona
              </div>
            )}
            {video.isTutorial && (
              <div className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                Tutorial
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-medium text-slate-900 sm:text-3xl leading-snug">{video.title}</h1>
            
            {isAuthenticated && (
              <button 
                onClick={() => void toggleFavorite(video.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${isFav ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
              >
                <svg className="h-5 w-5" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isFav ? 0 : 2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden sm:inline">{isFav ? 'Guardado' : 'Guardar'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-500">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-medium">
              {video.channelName[0]}
            </div>
            <div>
              <p className="font-medium text-slate-900">{video.channelName}</p>
              <p>{video.relativePublishedAt}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4 pt-4 border-t border-slate-100">
            <MetricCard label="Hype Score" value={formatHypeScore(video.hypeScore)} accent />
            <MetricCard label="Vistas" value={formatNumber(video.views)} />
            <MetricCard label="Likes" value={formatNumber(video.likes)} />
            <MetricCard label="Comentarios" value={video.commentsDisabled ? 'Desactivados' : formatNumber(video.comments)} disabled={video.commentsDisabled} />
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm text-indigo-800">
            <strong>¿Cómo se calcula el Hype?</strong> El score es resultado del engagement puro: <span className="font-medium">(Likes + Comentarios) ÷ Vistas</span>. Además, ¡si el video es un tutorial, su impacto se multiplica por dos!
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, accent, disabled }: { label: string; value: string; accent?: boolean; disabled?: boolean }): JSX.Element {
  return (
    <div className={`rounded-xl p-4 flex flex-col justify-center border transition-colors ${accent ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50/50 border-slate-100'} ${disabled ? 'opacity-50' : ''}`}>
      <p className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${accent ? 'text-indigo-400' : 'text-slate-400'}`}>{label}</p>
      <p className={`text-xl font-semibold ${accent ? 'text-indigo-600' : 'text-slate-800'}`}>{value}</p>
    </div>
  );
}
