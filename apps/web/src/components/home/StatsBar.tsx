import type { VideoItem } from '@/lib/types/videos';

interface StatsBarProps { items: VideoItem[]; featured: VideoItem | null; }

export function StatsBar({ items, featured }: StatsBarProps): JSX.Element {
  const total = items.length + (featured ? 1 : 0);
  const topHype = featured?.hypeScore ?? 0;
  const avgHype = total > 0
    ? (items.reduce((s, v) => s + v.hypeScore, 0) + (featured?.hypeScore ?? 0)) / total
    : 0;

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4 sm:px-6 lg:px-8">
        <Stat value={total.toString()} label="Videos totales" icon="🎬" />
        <Stat value={topHype.toFixed(4)} label="Mayor hype" icon="🏆" />
        <Stat value={avgHype.toFixed(4)} label="Hype promedio" icon="📊" />
        <Stat value={featured ? featured.title.slice(0, 20) + '...' : '—'} label="Joya de la Corona" icon="👑" small />
      </div>
    </section>
  );
}

function Stat({ value, label, icon, small }: { value: string; label: string; icon: string; small?: boolean }): JSX.Element {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
      <span className="text-xl">{icon}</span>
      <div className="min-w-0">
        <p className={`font-bold text-slate-800 truncate ${small ? 'text-xs' : 'text-lg'}`}>{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}
