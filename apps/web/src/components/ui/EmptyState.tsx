interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export function EmptyState({ title, description, icon = '📭' }: EmptyStateProps): JSX.Element {
  return (
    <section className="glass-card mx-auto max-w-md p-10 text-center">
      <span className="mb-4 block text-4xl">{icon}</span>
      <h2 className="font-display text-xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-surface-400">{description}</p>
    </section>
  );
}
