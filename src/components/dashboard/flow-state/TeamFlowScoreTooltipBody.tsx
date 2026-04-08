'use client'

import type { TeamFlowScorePart } from '@/lib/types/dashboard'

function formatSec(sec: number): string {
  if (sec <= 0) return '0'
  if (sec < 60) return `${sec}s`
  const m = Math.floor(sec / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const mm = m % 60
  return mm > 0 ? `${h}h ${mm}m` : `${h}h`
}

type Props = { breakdown?: TeamFlowScorePart[] }

export function TeamFlowScoreTooltipBody({ breakdown }: Props) {
  return (
    <div className="space-y-2 text-left leading-snug">
      <p className="font-semibold text-white text-[11px] uppercase tracking-wide">How Team Flow Score is calculated</p>
      <p className="text-[11px] text-zinc-200">
        <span className="font-medium text-zinc-50">Per person (today):</span> From all{' '}
        <code className="rounded bg-zinc-700/80 px-1 text-indigo-200">work_sessions</code> with{' '}
        <code className="rounded bg-zinc-700/80 px-1 text-indigo-200">session_date</code> = today, we read{' '}
        <code className="rounded bg-zinc-700/80 px-1 text-indigo-200">category_breakdown</code> (seconds per
        category). Each raw category is mapped to a flow bucket (deep work, shallow, meeting, interrupted).{' '}
        <span className="text-emerald-300">Deep work seconds</span> ÷{' '}
        <span className="text-zinc-300">sum of all buckets</span> × 100 → that person&apos;s score (0 if no time).
      </p>
      <p className="text-[11px] text-zinc-200">
        <span className="font-medium text-zinc-50">Team score:</span> Simple average of every team member&apos;s
        score (including 0% if they had no tracked time today).
      </p>
      {breakdown && breakdown.length > 0 && (
        <div className="border-t border-zinc-600 pt-2 mt-1 space-y-1.5">
          <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">Today’s inputs</p>
          <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
            {breakdown.map((row) => (
              <div
                key={row.userId}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[10px] text-zinc-300 border-b border-zinc-700/50 pb-1 last:border-0"
              >
                <span className="font-medium text-zinc-100 shrink-0 min-w-[7rem] truncate" title={row.displayName}>
                  {row.displayName}
                </span>
                <span className="tabular-nums text-emerald-300">deep {formatSec(row.deepWorkSeconds)}</span>
                <span className="text-zinc-500">/</span>
                <span className="tabular-nums">total {formatSec(row.totalTrackedSeconds)}</span>
                <span className="tabular-nums text-indigo-200 ml-auto">→ {row.scorePercent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
