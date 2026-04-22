'use client';
import Link from 'next/link';

const links = [
  { href: '/', label: 'Inicio', icon: '🏠' },
  { href: '/videos', label: 'Videos', icon: '🎬' },
  { href: '/favorites', label: 'Favoritos', icon: '❤️' },
  { href: '/hype-ai', label: 'Hype AI', icon: '🤖' },
  { href: '/login', label: 'Iniciar sesión', icon: '🔑' },
];

export function MobileMenu({ isOpen, pathname, onClose }: { isOpen: boolean; pathname: string; onClose: () => void }): JSX.Element {
  if (!isOpen) return <></>;
  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} role="presentation" style={{ animation: 'fadeIn 0.2s ease' }} />
      <nav className="absolute right-0 top-[57px] w-full border-b border-slate-200 bg-white shadow-lg" style={{ animation: 'fadeInUp 0.3s ease' }}>
        <div className="flex flex-col gap-1 p-3">
          {links.map(link => (
            <Link key={link.href} href={link.href} onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${pathname === link.href ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span>{link.icon}</span>{link.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
