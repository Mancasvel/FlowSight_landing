'use client'

type ProgressColor = 'default' | 'success' | 'warning' | 'danger' | 'primary'

const barColorMap: Record<ProgressColor, string> = {
  default: 'bg-zinc-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  primary: 'bg-indigo-500',
}

type ProgressProps = {
  value: number
  maxValue?: number
  color?: ProgressColor
  label?: string
  className?: string
  showValueLabel?: boolean
  size?: 'sm' | 'md'
}

export function Progress({
  value,
  maxValue = 100,
  color = 'primary',
  label,
  className = '',
  showValueLabel,
  size = 'md',
}: ProgressProps) {
  const pct = Math.min((value / maxValue) * 100, 100)
  const h = size === 'sm' ? 'h-1.5' : 'h-2.5'

  return (
    <div className={`w-full ${className}`}>
      {(label || showValueLabel) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-xs text-zinc-500">{label}</span>}
          {showValueLabel && <span className="text-xs text-zinc-500">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={`w-full ${h} bg-zinc-100 rounded-full overflow-hidden`}>
        <div
          className={`${h} rounded-full transition-all duration-500 ${barColorMap[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
