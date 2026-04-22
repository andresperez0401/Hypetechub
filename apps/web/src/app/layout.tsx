import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hype Tech Hub — Descubre lo que es tendencia en tech',
  description: 'Explora videos de tecnología clasificados por engagement real. Descubre tutoriales, reviews y contenido trending impulsado por métricas en tiempo real.',
  keywords: ['tech videos', 'trending', 'hype score', 'tutoriales', 'tecnología'],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
