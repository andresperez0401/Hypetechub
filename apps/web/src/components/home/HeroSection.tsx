import Link from 'next/link';

export function HeroSection(): JSX.Element {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
            <span>🔥</span>
            <span className="font-medium">Impulsado por métricas de engagement real</span>
          </div>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Descubre lo que es <span className="text-amber-300">tendencia</span> en tech
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-indigo-100 sm:text-lg">
            Videos de tecnología clasificados por hype score. Encuentra tu próximo tutorial, descubre contenido viral y sigue las tendencias.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/videos" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-lg shadow-indigo-900/20 transition hover:bg-indigo-50 active:scale-[0.98]">
              Explorar videos
            </Link>
            <Link href="/hype-ai" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-[0.98]">
              Pregunta a Hype AI
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
