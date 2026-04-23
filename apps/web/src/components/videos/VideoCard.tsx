'use client';

import Link from 'next/link';
import type { VideoItem } from '@/lib/types/videos';
import { formatHypeScore, formatNumber } from '@/lib/utils/video';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuthContext } from '@/features/auth/context/AuthContext';

interface VideoCardProps { video: VideoItem; index: number; }

export function VideoCard({ video, index }: VideoCardProps): JSX.Element {
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
    <Link href={`/videos/${video.id}`}
      className="card card-hover group block animate-in"
      style={{ animationDelay: `${index * 60}ms` }}>
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400?text=Hype+Tech'; }}
        />
        
        {/* Favorite Button Overlay */}
        {isAuthenticated && (
          <button 
            onClick={handleFavoriteClick}
            className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all ${isFav ? 'bg-indigo-600 text-white' : 'bg-white/90 text-slate-400 hover:bg-white hover:text-indigo-600'} shadow-sm`}
            aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <svg className="h-4 w-4" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isFav ? 0 : 2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/10">
          <span className="scale-0 rounded-full bg-white/90 p-3 shadow-lg transition-transform duration-300 group-hover:scale-100">▶️</span>
        </div>
        
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-xs font-bold shadow-sm backdrop-blur-sm text-slate-800">
          Score: {formatHypeScore(video.hypeScore)}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        {video.isTutorial && <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Tutorial</div>}
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-slate-800 group-hover:text-indigo-600 transition-colors">{video.title}</h3>
        <p className="text-xs text-slate-500">{video.channelName} · {video.relativePublishedAt}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
          <span className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Vistas</span>
            <span className="font-medium text-slate-700">{formatNumber(video.views)}</span>
          </span>
          <span className="h-5 w-px bg-slate-200" />
          <span className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Likes</span>
            <span className="font-medium text-slate-700">{formatNumber(video.likes)}</span>
          </span>
          <span className="h-5 w-px bg-slate-200" />
          <span className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Comentarios</span>
            <span className="font-medium text-slate-700">{video.commentsDisabled ? 'N/D' : formatNumber(video.comments)}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
