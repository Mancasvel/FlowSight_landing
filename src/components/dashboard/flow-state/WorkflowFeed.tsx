'use client'

import { useState } from 'react'
import { Card, CardHeader, CardBody, Avatar, Chip } from '@/components/ui'
import { ChevronDown, ChevronRight, Circle } from 'lucide-react'
import { getMetaCategory, META_CATEGORY_CONFIG } from '@/lib/categories'
import type { MemberWorkflow } from '@/lib/types/dashboard'

type Props = {
  members: MemberWorkflow[]
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
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

function MemberFeed({ member }: { member: MemberWorkflow }) {
  const [expanded, setExpanded] = useState(true)
  const { currentActivity, entries } = member
  const meta = currentActivity ? getMetaCategory(currentActivity.category) : null
  const metaConfig = meta ? META_CATEGORY_CONFIG[meta] : null

  return (
    <div className="border border-zinc-100 rounded-xl overflow-hidden">
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
            <p className="text-xs text-zinc-400 mt-0.5">No activity recorded today</p>
          )}
        </div>
        {currentActivity && <CategoryBadge category={currentActivity.category} />}
        <div className="text-zinc-400 shrink-0">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </button>

      {expanded && entries.length > 0 && (
        <div className="border-t border-zinc-100 bg-zinc-50/50 max-h-[280px] overflow-y-auto">
          <div className="px-4 py-2 space-y-0.5">
            {entries.map((entry, i) => {
              const entryMeta = getMetaCategory(entry.category)
              const entryConfig = META_CATEGORY_CONFIG[entryMeta]
              const isFirst = i === 0
              return (
                <div
                  key={`${entry.capturedAt}-${i}`}
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

                  <div className="flex-1 min-w-0">
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
                      <span className="text-[11px] text-zinc-400 ml-auto shrink-0 tabular-nums">
                        {formatDuration(entry.durationSeconds)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed truncate">
                      {entry.description}
                    </p>
                    {isFirst && (
                      <span className="inline-block text-[10px] font-medium text-emerald-600 mt-1">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {expanded && entries.length === 0 && (
        <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-4">
          <p className="text-xs text-zinc-400 text-center">No activity recorded today</p>
        </div>
      )}
    </div>
  )
}

export default function WorkflowFeed({ members }: Props) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-medium text-zinc-800">Team Activity · Today</h3>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Chronological view of what each member has been working on
        </p>
      </CardHeader>
      <CardBody className="space-y-3">
        {members.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">No team members found.</p>
        ) : (
          members.map((m) => <MemberFeed key={m.userId} member={m} />)
        )}
      </CardBody>
    </Card>
  )
}
