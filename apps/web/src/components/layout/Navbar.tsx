'use client';

import Link from 'next/link';
import { useAuthContext } from '@/features/auth/context/AuthContext';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/videos', label: 'Videos' },
  { href: '/favorites', label: 'Favoritos' },
  { href: '/hype-ai', label: 'Hype AI', special: true },
];

interface NavbarProps { pathname: string; onMobileMenuToggle: () => void; isMobileMenuOpen: boolean; }

export function Navbar({ pathname, onMobileMenuToggle, isMobileMenuOpen }: NavbarProps): JSX.Element {
  const { user, isAuthenticated, logout } = useAuthContext();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/logo.png" alt="Hype Tech Hub Logo" className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110" />
          <span className="text-lg font-bold text-slate-900 leading-none">Hype Tech Hub</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(link => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'} ${link.special ? 'text-indigo-600 font-semibold' : ''}`}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop auth */}
          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                  {(user?.displayName ?? user?.email ?? 'U')[0].toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate text-xs font-medium text-slate-600">{user?.displayName ?? user?.email}</span>
              </div>
              <button type="button" onClick={() => void logout()} className="btn-ghost text-xs">Salir</button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary hidden text-xs md:inline-flex">Iniciar sesión</Link>
          )}

          {/* Mobile: user avatar badge (visible when logged in, before opening menu) */}
          {isAuthenticated && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 md:hidden">
              {(user?.displayName ?? user?.email ?? 'U')[0].toUpperCase()}
            </div>
          )}

          <button type="button" onClick={onMobileMenuToggle} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 md:hidden" aria-label="Menú">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
