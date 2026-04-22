'use client';
import Link from 'next/link';
import { useAuthContext } from '@/features/auth/context/AuthContext';

const navLinks = [
  { href: '/', label: 'Inicio', icon: '🏠' },
  { href: '/videos', label: 'Videos', icon: '🎬' },
  { href: '/favorites', label: 'Favoritos', icon: '❤️' },
  { href: '/hype-ai', label: 'Hype AI', icon: '🤖' },
];

export function MobileMenu({ isOpen, pathname, onClose }: { isOpen: boolean; pathname: string; onClose: () => void }): JSX.Element {
  const { user, isAuthenticated, logout } = useAuthContext();

  if (!isOpen) return <></>;

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} role="presentation" style={{ animation: 'fadeIn 0.2s ease' }} />
      <nav className="absolute right-0 top-[57px] w-full border-b border-slate-200 bg-white shadow-lg" style={{ animation: 'fadeInUp 0.3s ease' }}>
        <div className="flex flex-col gap-1 p-3">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${pathname === link.href ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span>{link.icon}</span>{link.label}
            </Link>
          ))}

          <div className="my-1 h-px bg-slate-100" />

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                  {(user?.displayName ?? user?.email ?? 'U')[0].toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-800">{user?.displayName ?? user?.email}</span>
                  {user?.displayName && <span className="text-xs text-slate-400">{user.email}</span>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <span>🚪</span>Cerrar sesión
              </button>
            </>
          ) : (
            <Link href="/login" onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50">
              <span>🔑</span>Iniciar sesión
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
