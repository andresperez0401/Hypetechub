'use client';

import { HeroSection } from '@/components/home/HeroSection';
import { StatsBar } from '@/components/home/StatsBar';
import { VideosSection } from '@/components/videos/VideosSection';
import { useVideos } from '@/hooks/useVideos';

export default function HomePage(): JSX.Element {
  const { items, featured, isLoading, error } = useVideos();

  return (
    <>
      <HeroSection />
      {!isLoading && !error && <StatsBar items={items} featured={featured} />}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Tendencias ahora</h2>
          <p className="mt-1 text-sm text-slate-500">
            Videos clasificados por engagement real. El video con mayor hype gana la insignia de Joya de la Corona.
          </p>
        </div>
        <VideosSection />
      </section>
    </>
  );
}
