import Link from 'next/link';

export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Hype Tech Hub Logo" className="h-7 w-7 object-contain opacity-80 transition-opacity group-hover:opacity-100" />
            <span className="text-sm font-bold text-slate-800">Hype Tech Hub</span>
          </div>
          <nav className="flex gap-4 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition-colors">Inicio</Link>
            <Link href="/videos" className="hover:text-slate-800 transition-colors">Videos</Link>
            <Link href="/hype-ai" className="hover:text-slate-800 transition-colors">Hype AI</Link>
          </nav>
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} Hype Tech Hub</p>
        </div>
      </div>
    </footer>
  );
}
