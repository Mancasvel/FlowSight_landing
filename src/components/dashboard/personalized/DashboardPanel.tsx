'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import type { PanelSize } from '@/lib/onboarding/dashboardLayout'

type Props = {
  title: string
  description?: string
  size: PanelSize
  gridClass: string
  onSizeChange: (size: PanelSize) => void
  children: React.ReactNode
}

export default function DashboardPanel({
  title,
  description,
  size,
  gridClass,
  onSizeChange,
  children,
}: Props) {
  const collapsed = size === 'collapsed'

  return (
    <article
      className={`${gridClass} flex min-h-0 flex-col overflow-hidden rounded-lg border border-zinc-200/90 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md`}
    >
      <header className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-100 px-4 py-3">
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-medium text-zinc-900">{title}</h3>
          {description && (
            <p className={`mt-0.5 text-[12px] text-zinc-400 ${collapsed ? 'line-clamp-1' : ''}`}>
              {description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {collapsed ? (
            <PanelButton
              label="Expand panel"
              onClick={() => onSizeChange('default')}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </PanelButton>
          ) : (
            <PanelButton label="Collapse panel" onClick={() => onSizeChange('collapsed')}>
              <ChevronUp className="h-3.5 w-3.5" />
            </PanelButton>
          )}
        </div>
      </header>

      {!collapsed && (
        <div className="dashboard-panel-content min-h-0 flex-1 overflow-auto [&>div]:!rounded-none [&>div]:!border-0 [&>div]:!bg-transparent [&>div]:!p-4 [&>div]:!shadow-none [&>div>div.mb-4:first-child]:hidden">
          {children}
        </div>
      )}
    </article>
  )
}

function PanelButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
    >
      {children}
    </button>
  )
}
