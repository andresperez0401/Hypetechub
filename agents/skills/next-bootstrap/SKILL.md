# Skill: Next.js Bootstrap

## Purpose
Set up a production-ready Next.js application with App Router, TypeScript, Tailwind CSS, and the project's folder conventions.

## When to apply
- Initializing the frontend for the first time
- Auditing an existing setup against these standards

## Step-by-step

### 1. Project creation
```bash
# Inside monorepo root
pnpx create-next-app@latest apps/frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --skip-install
```

### 2. Required dependencies
```bash
npm install axios react-hook-form zod @hookform/resolvers zustand
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

### 3. Folder structure
```
apps/frontend/src/
├── app/
│   ├── layout.tsx          ← root layout, providers here
│   ├── page.tsx            ← home page
│   ├── globals.css
│   └── (auth)/             ← route group for auth pages
│       ├── login/page.tsx
│       └── register/page.tsx
├── components/
│   ├── ui/                 ← Button, Input, Badge, Card, Spinner
│   └── layout/             ← Navbar, Footer, Shell
├── features/               ← feature-scoped components + hooks
│   └── auth/
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   └── RegisterForm.tsx
│       └── hooks/
│           └── useAuth.ts
├── lib/
│   ├── api/                ← typed API client functions
│   │   └── auth.api.ts
│   └── utils.ts
└── types/
    └── index.ts
```

### 4. API client baseline
```typescript
// src/lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // send httpOnly cookies
});
```

### 5. Root layout with providers
```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'App',
  description: 'App description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### 6. Required env vars
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
```

## Validation checklist
- [ ] App Router used (not Pages Router)
- [ ] `src/` directory enabled
- [ ] `@/*` import alias configured
- [ ] `withCredentials: true` in API client
- [ ] Tailwind configured and working
- [ ] `.env.example` updated with new vars
- [ ] No `pages/` directory exists
