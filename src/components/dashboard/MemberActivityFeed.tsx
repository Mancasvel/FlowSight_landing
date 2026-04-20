'use client'

import { useState } from 'react'
import { Avatar, Chip } from '@/components/ui'
import { ChevronDown, ChevronRight, Circle } from 'lucide-react'
import { getMetaCategory, META_CATEGORY_CONFIG } from '@/lib/categories'
import type { MemberWorkflow } from '@/lib/types/dashboard'

type Props = {
  member: MemberWorkflow
  /** Hide the member avatar + name header (useful when the parent page already shows it). */
  hideHeader?: boolean
  /** Start with the feed open. Defaults to true. */
  defaultExpanded?: boolean
  /** Max height (CSS) for the inner scroll container. Defaults to 280px. */
  maxScrollHeight?: string
  /** Optional label override for the empty state. */
  emptyLabel?: string
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

function CategoryBadge({ category }: { category: string }) {
  const meta = getMetaCategory(category)
  const config = META_CATEGORY_CONFIG[meta]
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium shrink-0"
      style={{ backgroundColor: config.bgLight, color: config.color }}
    >
      {meta}
    </span>
  )
}

export default function MemberActivityFeed({
  member,
  hideHeader = false,
  defaultExpanded = true,
  maxScrollHeight = '280px',
  emptyLabel = 'No activity recorded today',
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [openEntries, setOpenEntries] = useState<Set<string>>(new Set())
  const { currentActivity, entries } = member
  const meta = currentActivity ? getMetaCategory(currentActivity.category) : null
  const metaConfig = meta ? META_CATEGORY_CONFIG[meta] : null

  const toggleEntry = (key: string) => {
    setOpenEntries((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const showList = hideHeader ? true : expanded

  return (
    <div className="border border-zinc-100 rounded-xl overflow-hidden">
      {!hideHeader && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-zinc-50 transition-colors text-left"
        >
          <Avatar src={member.avatarUrl} name={member.displayName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-800 truncate">{member.displayName}</p>
            {currentActivity ? (
              <p className="text-xs text-zinc-500 truncate mt-0.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 relative -top-px"
                  style={{ backgroundColor: metaConfig?.color ?? '#94a3b8' }}
                />
                {currentActivity.description}
                {currentActivity.jiraTicketId && (
                  <span className="text-zinc-400 ml-1.5">{currentActivity.jiraTicketId}</span>
                )}
              </p>
            ) : (
              <p className="text-xs text-zinc-400 mt-0.5">{emptyLabel}</p>
            )}
          </div>
          {currentActivity && <CategoryBadge category={currentActivity.category} />}
          <div className="text-zinc-400 shrink-0">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        </button>
      )}

      {showList && entries.length > 0 && (
        <div
          className={`${hideHeader ? '' : 'border-t border-zinc-100'} bg-zinc-50/50 overflow-y-auto`}
          style={{ maxHeight: maxScrollHeight }}
        >
          <div className="px-4 py-2 space-y-0.5">
            {entries.map((entry, i) => {
              const entryMeta = getMetaCategory(entry.category)
              const entryConfig = META_CATEGORY_CONFIG[entryMeta]
              const isFirst = i === 0
              const entryKey = `${entry.capturedAt}-${i}`
              const isOpen = openEntries.has(entryKey)
              const description = entry.description?.trim() ?? ''
              const hasDescription = description.length > 0
              return (
                <div
                  key={entryKey}
                  className={`flex items-start gap-3 py-2 ${
                    isFirst ? 'bg-white -mx-2 px-2 rounded-lg border border-zinc-100' : ''
                  }`}
                >
                  <div className="flex flex-col items-center pt-1 shrink-0">
                    <Circle
                      size={8}
                      fill={entryConfig.color}
                      stroke={entryConfig.color}
                    />
                    {i < entries.length - 1 && (
                      <div className="w-px h-full min-h-[16px] bg-zinc-200 mt-1" />
                    )}
                  </div>

                  <div
                    role={hasDescription ? 'button' : undefined}
                    tabIndex={hasDescription ? 0 : undefined}
                    aria-expanded={hasDescription ? isOpen : undefined}
                    onClick={(e) => {
                      if (!hasDescription) return
                      e.stopPropagation()
                      toggleEntry(entryKey)
                    }}
                    onKeyDown={(e) => {
                      if (!hasDescription) return
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleEntry(entryKey)
                      }
                    }}
                    className={`flex-1 min-w-0 rounded-md -mx-1 px-1 py-0.5 transition-colors ${
                      hasDescription ? 'cursor-pointer hover:bg-zinc-100/70 focus:bg-zinc-100 focus:outline-none' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono text-zinc-400 tabular-nums shrink-0">
                        {formatTime(entry.capturedAt)}
                      </span>
                      <CategoryBadge category={entry.category} />
                      {entry.jiraTicketId && (
                        <Chip color="default" className="!text-[10px] !px-1.5 !py-0">
                          {entry.jiraTicketId}
                        </Chip>
                      )}
                    </div>
                    <p
                      className={`text-xs text-zinc-600 mt-0.5 leading-relaxed ${
                        isOpen ? 'whitespace-pre-line break-words' : 'truncate'
                      }`}
                    >
                      {description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {isFirst && (
                        <span className="inline-block text-[10px] font-medium text-emerald-600">
                          Current
                        </span>
                      )}
                      {hasDescription && (
                        <span className="text-[10px] font-medium text-indigo-500 hover:text-indigo-600 ml-auto">
                          {isOpen ? 'Show less' : 'Show full report'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showList && entries.length === 0 && (
        <div
          className={`${hideHeader ? '' : 'border-t border-zinc-100'} bg-zinc-50/50 px-4 py-4`}
        >
          <p className="text-xs text-zinc-400 text-center">{emptyLabel}</p>
        </div>
      )}
    </div>
  )
}
