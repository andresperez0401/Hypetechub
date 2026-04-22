'use client';

import { VideosSection } from '@/components/videos/VideosSection';

export default function VideosPage(): JSX.Element {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Todos los videos</h1>
        <p className="max-w-2xl text-sm text-slate-500">
          Explora el catálogo completo de videos de tecnología, clasificados por engagement y hype score.
        </p>
      </header>
      <VideosSection />
    </section>
  );
}
