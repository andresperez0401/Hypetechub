'use client';

import { type PropsWithChildren, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileMenu } from './MobileMenu';

export function AppShell({ children }: PropsWithChildren): JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        <Navbar
          pathname={pathname}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <MobileMenu isOpen={isMobileMenuOpen} pathname={pathname} onClose={() => setIsMobileMenuOpen(false)} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
