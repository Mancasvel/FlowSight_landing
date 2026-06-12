type Props = {
  minHeight?: number
  variant?: 'chart' | 'blocks'
}

export default function DashboardFeaturePlaceholder({
  minHeight = 220,
  variant = 'chart',
}: Props) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-md border border-zinc-200/60 bg-zinc-100"
      style={{ minHeight }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-50/90 via-zinc-100 to-zinc-200/70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-8px_24px_rgba(0,0,0,0.04)]"
        aria-hidden
      />

      {variant === 'chart' ? (
        <div className="pointer-events-none absolute inset-x-8 bottom-8 top-12 opacity-40" aria-hidden>
          <div className="flex h-full items-end justify-around gap-3">
            {[0.45, 0.7, 0.55, 0.85].map((h, i) => (
              <div
                key={i}
                className="w-full max-w-[48px] rounded-t-sm bg-zinc-300/80"
                style={{ height: `${h * 100}%` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-x-8 top-12 space-y-3 opacity-40" aria-hidden>
          {[0.9, 0.55, 0.7, 0.4].map((w, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full bg-zinc-300/80"
              style={{ width: `${w * 100}%` }}
            />
          ))}
        </div>
      )}

      <p className="relative z-10 rounded-full border border-zinc-200/80 bg-white/90 px-4 py-2 text-[13px] font-medium tracking-wide text-zinc-400 shadow-sm">
        Feature on the way
      </p>
    </div>
  )
}
