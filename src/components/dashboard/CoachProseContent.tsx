'use client'

import type { ReactNode } from 'react'
import CoachCitation from '@/components/dashboard/CoachCitation'
import type { CoachCitationIndex } from '@/lib/coachChat/citations'

type Props = {
  content: string
  citations?: CoachCitationIndex
}

type InlineToken =
  | { kind: 'cite'; index: number; length: number; key: string; display: string }
  | { kind: 'bold'; index: number; length: number; inner: string }
  | { kind: 'italic'; index: number; length: number; inner: string }

function findEarliestInlineToken(text: string): InlineToken | null {
  const candidates: InlineToken[] = []

  const cite = /\[\[cite:([a-z0-9_]+)\|([^\]]+)\]\]/i.exec(text)
  if (cite?.index !== undefined) {
    candidates.push({
      kind: 'cite',
      index: cite.index,
      length: cite[0].length,
      key: cite[1],
      display: cite[2],
    })
  }

  const bold = /\*\*(.+?)\*\*|__(.+?)__/.exec(text)
  if (bold?.index !== undefined) {
    candidates.push({
      kind: 'bold',
      index: bold.index,
      length: bold[0].length,
      inner: bold[1] ?? bold[2],
    })
  }

  const italic = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|_(.+?)_/.exec(text)
  if (italic?.index !== undefined) {
    candidates.push({
      kind: 'italic',
      index: italic.index,
      length: italic[0].length,
      inner: italic[1] ?? italic[2],
    })
  }

  if (candidates.length === 0) return null
  return candidates.sort((a, b) => a.index - b.index)[0]
}

function parseInline(
  text: string,
  keyPrefix: string,
  citations?: CoachCitationIndex
): ReactNode[] {
  if (!text) return []

  const token = findEarliestInlineToken(text)
  if (!token) return [text]

  const nodes: ReactNode[] = []
  if (token.index > 0) {
    nodes.push(...parseInline(text.slice(0, token.index), `${keyPrefix}-pre`, citations))
  }

  const rest = text.slice(token.index + token.length)

  if (token.kind === 'cite') {
    nodes.push(
      <CoachCitation
        key={`${keyPrefix}-cite`}
        citeKey={token.key}
        display={token.display}
        citations={citations}
      />
    )
  } else if (token.kind === 'bold') {
    nodes.push(
      <strong key={`${keyPrefix}-bold`} className="font-semibold text-zinc-900">
        {parseInline(token.inner, `${keyPrefix}-bold-in`, citations)}
      </strong>
    )
  } else {
    nodes.push(
      <em key={`${keyPrefix}-italic`} className="italic text-zinc-700">
        {parseInline(token.inner, `${keyPrefix}-italic-in`, citations)}
      </em>
    )
  }

  if (rest) {
    nodes.push(...parseInline(rest, `${keyPrefix}-post`, citations))
  }

  return nodes
}

type OlItem = { title: string; subItems?: string[] }

type Block =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'hr' }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: OlItem[] }
  | { type: 'p'; text: string; lead?: boolean }

const BOLD_SECTION_RE = /^\*\*([^*]+)\*\*\s*([\s\S]*)$/

function splitBoldSectionLead(trimmed: string): { title: string; body: string } | null {
  const match = trimmed.match(BOLD_SECTION_RE)
  if (!match) return null

  const title = match[1].trim()
  const body = match[2].trim()
  if (!title || title.length > 120) return null
  if (!body) return { title, body: '' }

  const looksLikeSection =
    title.endsWith('–') ||
    title.endsWith('—') ||
    title.endsWith(':') ||
    title.length <= 48

  return looksLikeSection ? { title: title.replace(/[–—:]\s*$/, '').trim(), body } : null
}

function parseNumberedBlock(lines: string[]): OlItem[] | null {
  const items: OlItem[] = []
  let current: OlItem | null = null
  let hasNumbered = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const numMatch = trimmed.match(/^\d+\.\s+(.+)$/)
    const bulletMatch = trimmed.match(/^[-•*]\s+(.+)$/)

    if (numMatch) {
      hasNumbered = true
      current = { title: numMatch[1] }
      items.push(current)
      continue
    }

    if (bulletMatch && current) {
      if (!current.subItems) current.subItems = []
      current.subItems.push(bulletMatch[1])
      continue
    }

    return null
  }

  return hasNumbered && items.length > 0 ? items : null
}

function parseBlocks(content: string): Block[] {
  const blocks: Block[] = []
  const paragraphs = content.split(/\n{2,}/)
  let usedLead = false

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim()
    if (!trimmed) continue

    if (/^---+$/.test(trimmed)) {
      blocks.push({ type: 'hr' })
      continue
    }

    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4).trim() })
      continue
    }

    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.slice(3).trim() })
      continue
    }

    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'h1', text: trimmed.slice(2).trim() })
      continue
    }

    const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean)

    const numbered = parseNumberedBlock(lines)
    if (numbered) {
      blocks.push({ type: 'ol', items: numbered })
      continue
    }

    if (lines.every((line) => /^[-•*]\s+/.test(line))) {
      blocks.push({
        type: 'ul',
        items: lines.map((line) => line.replace(/^[-•*]\s+/, '')),
      })
      continue
    }

    const boldOnly = trimmed.match(/^\*\*([^*]+)\*\*$/)
    if (boldOnly) {
      blocks.push({ type: 'h2', text: boldOnly[1].trim() })
      continue
    }

    const sectionLead = splitBoldSectionLead(trimmed)
    if (sectionLead) {
      blocks.push({ type: 'h2', text: sectionLead.title })
      if (sectionLead.body) {
        blocks.push({ type: 'p', text: sectionLead.body })
      }
      continue
    }

    if (!usedLead && blocks.length === 0) {
      blocks.push({ type: 'p', text: trimmed, lead: true })
      usedLead = true
      continue
    }

    blocks.push({ type: 'p', text: trimmed })
  }

  return blocks
}

export default function CoachProseContent({ content, citations }: Props) {
  const blocks = parseBlocks(content)

  return (
    <div className="font-coach text-[15.5px] leading-[1.8] tracking-[0.005em] text-zinc-800">
      {blocks.map((block, index) => {
        if (block.type === 'hr') {
          return <hr key={index} className="my-7 border-0 border-t border-zinc-200" />
        }

        if (block.type === 'h1') {
          return (
            <h1
              key={index}
              className="font-sans text-[1.375rem] font-semibold leading-[1.3] tracking-[-0.01em] text-zinc-900"
            >
              {parseInline(block.text, `h1-${index}`, citations)}
            </h1>
          )
        }

        if (block.type === 'h2') {
          const prev = blocks[index - 1]
          const afterLead = prev?.type === 'p' && prev.lead
          const afterH1 = prev?.type === 'h1'
          const showDivider = index > 0 && !afterLead && !afterH1
          return (
            <h2
              key={index}
              className={`font-sans text-[1.0625rem] font-semibold leading-snug text-zinc-900 ${
                showDivider ? 'mt-7 border-t border-zinc-200 pt-6' : afterH1 ? 'mt-5' : 'mt-6'
              }`}
            >
              {parseInline(block.text, `h2-${index}`, citations)}
            </h2>
          )
        }

        if (block.type === 'h3') {
          return (
            <h3
              key={index}
              className="mt-4 font-sans text-[0.9375rem] font-semibold leading-snug text-zinc-900"
            >
              {parseInline(block.text, `h3-${index}`, citations)}
            </h3>
          )
        }

        if (block.type === 'ol') {
          return (
            <ol key={index} className="my-4 list-none space-y-4 pl-0">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-sans text-[13px] font-semibold tabular-nums text-zinc-400">
                    {itemIndex + 1}.
                  </span>
                  <div className="min-w-0 flex-1">
                    <div>{parseInline(item.title, `ol-${index}-${itemIndex}`, citations)}</div>
                    {item.subItems && item.subItems.length > 0 && (
                      <ul className="mt-2 list-none space-y-1.5 pl-0">
                        {item.subItems.map((sub, subIndex) => (
                          <li
                            key={subIndex}
                            className="flex gap-2 text-[15px] leading-[1.75] text-zinc-700"
                          >
                            <span className="shrink-0 text-zinc-400">–</span>
                            <span>{parseInline(sub, `ol-${index}-${itemIndex}-sub${subIndex}`, citations)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )
        }

        if (block.type === 'ul') {
          return (
            <ul key={index} className="my-3 list-none space-y-2 pl-0">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-2.5">
                  <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                  <span>{parseInline(item, `li-${index}-${itemIndex}`, citations)}</span>
                </li>
              ))}
            </ul>
          )
        }

        return (
          <div
            key={index}
            className={
              block.lead
                ? 'mt-3 text-[15.5px] leading-[1.8] text-zinc-800'
                : index > 0
                  ? 'mt-3.5'
                  : undefined
            }
          >
            {block.text.split('\n').map((line, lineIndex, lines) => (
              <span key={lineIndex}>
                {parseInline(line, `p-${index}-${lineIndex}`, citations)}
                {lineIndex < lines.length - 1 && <br />}
              </span>
            ))}
          </div>
        )
      })}
    </div>
  )
}
