interface ErrorStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({ message, actionLabel, onAction }: ErrorStateProps): JSX.Element {
  return (
    <section className="mx-auto max-w-md rounded-2xl border border-accent-500/20 bg-accent-500/5 p-8 text-center">
      <span className="mb-4 block text-4xl">⚠️</span>
      <h2 className="font-display text-lg font-bold text-white">Something went wrong</h2>
      <p className="mt-2 text-sm text-surface-400">{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="btn-accent mt-6 text-sm"
        >
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
