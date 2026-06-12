'use client'

import { Tooltip } from '@/components/ui'
import type { CoachCitationIndex } from '@/lib/coachChat/citations'
import { resolveCitation } from '@/lib/coachChat/citations'

type Props = {
  content: string
  citations?: CoachCitationIndex
}

function extractCiteKeys(content: string): string[] {
  const keys = new Set<string>()
  const regex = /\[\[cite:([a-z0-9_]+)\|[^\]]+\]\]/gi
  let match: RegExpExecArray | null
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1])
  }
  return Array.from(keys)
}

export default function CoachSourcesList({ content, citations }: Props) {
  const keys = extractCiteKeys(content)
  if (keys.length === 0) return null

  const seen = new Set<string>()
  const resolved = keys
    .map((key) => ({ key, citation: resolveCitation(key, citations) }))
    .filter((entry): entry is { key: string; citation: NonNullable<ReturnType<typeof resolveCitation>> } => {
      if (!entry.citation) return false
      if (seen.has(entry.citation.source)) return false
      seen.add(entry.citation.source)
      return true
    })

  if (resolved.length === 0) return null

  return (
    <div className="mt-6 border-t border-zinc-200 pt-4">
      <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-400">
        Sources
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {resolved.map(({ key, citation }) => (
          <li key={key}>
            <Tooltip
              wide
              content={
                <div className="space-y-1.5">
                  <div className="font-medium text-zinc-100">{citation.label}</div>
                  {citation.value && (
                    <div className="text-[12px] text-zinc-200">{citation.value}</div>
                  )}
                  <div className="text-[11px] leading-relaxed text-zinc-300">{citation.detail}</div>
                </div>
              }
            >
              <span className="inline-flex max-w-[280px] cursor-help truncate rounded-md bg-zinc-200/60 px-2 py-0.5 text-[11px] text-zinc-600 transition-colors hover:bg-zinc-200/90">
                {citation.source}
              </span>
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  )
}
