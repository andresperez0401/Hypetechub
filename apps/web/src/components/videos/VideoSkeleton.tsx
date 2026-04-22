export function VideoSkeleton({ count = 6, showCrown = true }: { count?: number; showCrown?: boolean }): JSX.Element {
  return (
    <div className="space-y-6">
      {showCrown && (
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="aspect-video w-full flex items-center justify-center rounded-xl bg-slate-100 sm:w-64 sm:shrink-0">
              <img src="/logo.png" alt="" className="h-8 w-8 opacity-20 animate-pulse" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="h-4 w-32 rounded bg-slate-100" />
              <div className="h-6 w-3/4 rounded bg-slate-100" />
              <div className="h-3 w-48 rounded bg-slate-100" />
              <div className="h-8 w-24 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="aspect-video flex items-center justify-center bg-slate-100">
              <img src="/logo.png" alt="" className="h-6 w-6 opacity-20 animate-pulse" />
            </div>
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 rounded bg-slate-100" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
              <div className="h-3 w-1/3 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
