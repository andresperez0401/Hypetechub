'use client';

import Link from 'next/link';
import type { VideoItem } from '@/lib/types/videos';
import { formatHypeScore, formatNumber } from '@/lib/utils/video';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuthContext } from '@/features/auth/context/AuthContext';

interface CrownVideoCardProps { video: VideoItem; }

export function CrownVideoCard({ video }: CrownVideoCardProps): JSX.Element {
  const { isAuthenticated } = useAuthContext();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(video.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    await toggleFavorite(video.id);
  };

  return (
    <Link href={`/videos/${video.id}`} className="group block animate-in">
      <div className="relative overflow-hidden rounded-2xl border bg-white border-slate-200 p-1 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-200">
        <div className="relative flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="relative w-full overflow-hidden rounded-xl bg-slate-100 sm:w-64 sm:shrink-0">
            <img src={video.thumbnailUrl} alt={video.title} className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-indigo-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Joya de la Corona
            </div>
            
            {isAuthenticated && (
              <button 
                onClick={handleFavoriteClick}
                className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${isFav ? 'bg-indigo-600 text-white' : 'bg-white/80 text-slate-500 hover:bg-white hover:text-indigo-600'} shadow-sm`}
                aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                <svg className="h-4 w-4" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isFav ? 0 : 2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {video.isTutorial && <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Tutorial</span>}
            </div>
            <h2 className="text-lg font-medium text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors sm:text-xl">{video.title}</h2>
            <p className="text-sm text-slate-500">{video.channelName} · {video.relativePublishedAt}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Score</span>
                <span className="font-mono text-base font-bold text-indigo-600">{formatHypeScore(video.hypeScore)}</span>
              </span>
              <span className="h-6 w-px bg-slate-200" />
              <div className="flex gap-4 text-xs text-slate-500">
                <span className="flex flex-col"><span className="text-[10px] uppercase text-slate-400">Vistas</span><span className="font-medium text-slate-700">{formatNumber(video.views)}</span></span>
                <span className="flex flex-col"><span className="text-[10px] uppercase text-slate-400">Likes</span><span className="font-medium text-slate-700">{formatNumber(video.likes)}</span></span>
                <span className="flex flex-col"><span className="text-[10px] uppercase text-slate-400">Comentarios</span><span className="font-medium text-slate-700">{video.commentsDisabled ? 'N/D' : formatNumber(video.comments)}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
