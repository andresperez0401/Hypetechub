import type { PropsWithChildren } from 'react';

interface AuthShellProps extends PropsWithChildren {
  title: string;
  description: string;
}

export function AuthShell({ title, description, children }: AuthShellProps): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-md space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-600">{description}</p>
      </header>
      {children}
    </section>
  );
}
