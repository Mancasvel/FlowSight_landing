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
      <strong key={`${keyPrefix}-bold`} className="font-medium text-zinc-800">
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

function expandInlineNumbers(text: string): string {
  return text.replace(/([^\n\d])\s+(?=\d+\.\s)/g, '$1\n')
}

function stripDenseBold(text: string): string {
  const boldMatches = text.match(/\*\*[^*]+\*\*/g) ?? []
  const boldLen = boldMatches.reduce((sum, match) => sum + match.length, 0)
  if (boldLen > text.length * 0.3) {
    return text.replace(/\*\*([^*]+)\*\*/g, '$1')
  }
  return text
}

function splitNumberedStepLine(line: string): OlItem {
  const raw = line.replace(/^\d+\.\s+/, '').trim()
  const subParts = raw
    .split(/\s+--\s+|\s+-\s+(?=[A-ZÁÉÍÓÚ¿>])/)
    .map((s) => s.trim())
    .filter(Boolean)
  return {
    title: subParts[0] ?? raw,
    subItems: subParts.length > 1 ? subParts.slice(1) : undefined,
  }
}

function isStructuralLine(line: string): boolean {
  return (
    /^#{1,3}\s/.test(line) ||
    /^\d+\.\s/.test(line) ||
    /^[-•*]\s/.test(line) ||
    /^---+$/.test(line)
  )
}

function splitHeadingInlineSteps(line: string): { heading: Block; rest: string[] } | null {
  const levels: { prefix: string; type: 'h1' | 'h2' | 'h3' }[] = [
    { prefix: '### ', type: 'h3' },
    { prefix: '## ', type: 'h2' },
    { prefix: '# ', type: 'h1' },
  ]

  for (const { prefix, type } of levels) {
    if (!line.startsWith(prefix)) continue
    const body = line.slice(prefix.length)
    const splitAt = body.search(/\s+\d+\.\s/)
    if (splitAt <= 0) {
      return { heading: { type, text: body.trim() }, rest: [] }
    }
    const title = body.slice(0, splitAt).trim()
    const steps = expandInlineNumbers(body.slice(splitAt).trim())
    return {
      heading: { type, text: title },
      rest: steps.split('\n').map((l) => l.trim()).filter(Boolean),
    }
  }

  return null
}

/** Normalize model output before block parsing. */
export function normalizeCoachMarkdown(content: string): string {
  let text = content.replace(/\r\n/g, '\n').trim()

  text = text.replace(/^\*\*(\d+\.\s+[^*]+)\*\*\s*/gm, '$1 ')
  text = text.replace(/^\*\*(\d+\.\s+[^*]+)\*\*$/gm, '$1')

  text = text.replace(/^\*\*([^*\n]{2,90})\*\*\s*$/gm, (match, title: string) => {
    if (/^\d+\./.test(title.trim())) return match
    return `## ${title}`
  })
  text = text.replace(/^\*\*([^*\n]{2,90})\*\*\s*\n/gm, (match, title: string) => {
    if (/^\d+\./.test(title.trim())) return match
    return `## ${title}\n\n`
  })

  text = text
    .split(/\n{2,}/)
    .map((paragraph) => {
      const trimmed = paragraph.trim()
      const wholeBold = trimmed.match(/^\*\*([\s\S]+)\*\*$/)
      if (wholeBold && !wholeBold[1].includes('**') && wholeBold[1].length > 90) {
        return stripDenseBold(wholeBold[1].trim())
      }
      return stripDenseBold(paragraph)
    })
    .join('\n\n')

  text = text.replace(/^(#{1,3}\s+[^\n]+?)\s+(?=\d+\.\s)/gm, '$1\n')
  text = text.replace(/^\*\*([^*\n]{2,90})\*\*\s+(?=\d+\.\s)/gm, '## $1\n')
  text = expandInlineNumbers(text)

  // Expand dash sub-bullets only on non-numbered lines
  text = text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || /^\d+\.\s/.test(trimmed)) return line

      if ((trimmed.match(/\s--\s/g) ?? []).length >= 1) {
        const parts = trimmed.split(/\s+--\s+/).map((p) => p.trim()).filter(Boolean)
        if (parts.length >= 2) {
          const [head, ...tail] = parts
          return [head, ...tail.map((item) => `- ${item}`)].join('\n')
        }
      }

      if ((trimmed.match(/\s-\s/g) ?? []).length < 2) return line

      const parts = trimmed.split(/\s+-\s+/).map((p) => p.trim()).filter(Boolean)
      if (parts.length < 2) return line

      const [first, ...rest] = parts
      const firstIsIntro =
        !first.startsWith('-') &&
        !/^\d+\./.test(first) &&
        first.length > 60 &&
        rest.length >= 2

      if (firstIsIntro) {
        return [first, ...rest.map((item) => `- ${item.replace(/^[-•*]\s*/, '')}`)].join('\n')
      }

      return parts.map((item) => `- ${item.replace(/^[-•*]\s*/, '')}`).join('\n')
    })
    .join('\n')

  return text.trim()
}

function flattenToLines(content: string): string[] {
  const lines: string[] = []
  for (const paragraph of normalizeCoachMarkdown(content).split(/\n{2,}/)) {
    const trimmed = paragraph.trim()
    if (!trimmed) continue

    const expanded = expandInlineNumbers(trimmed)
    for (const line of expanded.split('\n')) {
      const t = line.trim()
      if (t) lines.push(t)
    }
  }
  return lines
}

function parseNumberedLines(lines: string[], start: number): { items: OlItem[]; next: number } | null {
  const items: OlItem[] = []
  let i = start

  if (!/^\d+\.\s/.test(lines[i] ?? '')) return null

  while (i < lines.length) {
    const line = lines[i]
    if (/^\d+\.\s/.test(line)) {
      items.push(splitNumberedStepLine(line))
      i++
      continue
    }
    if (/^[-•*]\s/.test(line) && items.length > 0) {
      const last = items[items.length - 1]
      if (!last.subItems) last.subItems = []
      last.subItems.push(line.replace(/^[-•*]\s+/, ''))
      i++
      continue
    }
    break
  }

  return items.length > 0 ? { items, next: i } : null
}

function parseBlocks(content: string): Block[] {
  const lines = flattenToLines(content)
  const blocks: Block[] = []
  let i = 0
  let usedLead = false

  while (i < lines.length) {
    const line = lines[i]

    if (/^---+$/.test(line)) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    const headingSplit = splitHeadingInlineSteps(line)
    if (headingSplit) {
      blocks.push(headingSplit.heading)
      i++
      if (headingSplit.rest.length > 0) {
        const numbered = parseNumberedLines(headingSplit.rest, 0)
        if (numbered) {
          blocks.push({ type: 'ol', items: numbered.items })
        } else if (headingSplit.rest.every((l) => /^[-•*]\s+/.test(l))) {
          blocks.push({
            type: 'ul',
            items: headingSplit.rest.map((l) => l.replace(/^[-•*]\s+/, '')),
          })
        } else {
          blocks.push({ type: 'p', text: headingSplit.rest.join('\n') })
        }
      }
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      const numbered = parseNumberedLines(lines, i)
      if (numbered) {
        blocks.push({ type: 'ol', items: numbered.items })
        i = numbered.next
        continue
      }
    }

    if (/^[-•*]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-•*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-•*]\s+/, ''))
        i++
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    const boldSection = line.match(/^\*\*([^*]+)\*\*\s+(.+)$/)
    if (boldSection && boldSection[1].length <= 80) {
      blocks.push({ type: 'h2', text: boldSection[1].trim() })
      const bodyLines = expandInlineNumbers(boldSection[2])
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
      const numbered = parseNumberedLines(bodyLines, 0)
      if (numbered) {
        blocks.push({ type: 'ol', items: numbered.items })
      } else {
        blocks.push({ type: 'p', text: bodyLines.join('\n') })
      }
      i++
      continue
    }

    const paraLines: string[] = []
    while (i < lines.length && !isStructuralLine(lines[i])) {
      paraLines.push(lines[i])
      i++
    }

    const text = paraLines.join('\n').trim()
    if (!text) continue

    const expandedLines = expandInlineNumbers(text)
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

    const numbered = parseNumberedLines(expandedLines, 0)
    if (numbered && numbered.items.length > 0) {
      blocks.push({ type: 'ol', items: numbered.items })
      continue
    }

    if (!usedLead && blocks.length === 0) {
      blocks.push({ type: 'p', text, lead: true })
      usedLead = true
      continue
    }

    blocks.push({ type: 'p', text })
  }

  return blocks
}

export default function CoachProseContent({ content, citations }: Props) {
  const blocks = parseBlocks(content)

  return (
    <div className="coach-prose text-[17px] font-normal leading-[1.75] tracking-[0.01em] text-zinc-700">
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
              className={`text-[1.0625rem] font-semibold leading-snug text-zinc-900 ${
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
              className="mt-4 text-[0.9375rem] font-semibold leading-snug text-zinc-900"
            >
              {parseInline(block.text, `h3-${index}`, citations)}
            </h3>
          )
        }

        if (block.type === 'ol') {
          return (
            <ol key={index} className="my-4 list-none space-y-5 pl-0">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-3">
                  <span className="mt-0.5 shrink-0 text-[17px] font-medium tabular-nums text-zinc-500">
                    {itemIndex + 1}.
                  </span>
                  <div className="min-w-0 flex-1">
                    <div>{parseInline(item.title, `ol-${index}-${itemIndex}`, citations)}</div>
                    {item.subItems && item.subItems.length > 0 && (
                      <ul className="mt-2.5 list-none space-y-2 pl-0">
                        {item.subItems.map((sub, subIndex) => (
                          <li
                            key={subIndex}
                            className="flex gap-2 leading-[1.75] text-zinc-600"
                          >
                            <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              {parseInline(
                                sub,
                                `ol-${index}-${itemIndex}-sub${subIndex}`,
                                citations
                              )}
                            </span>
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
            <ul key={index} className="my-3 list-none space-y-2.5 pl-0">
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
            className={block.lead ? 'mt-3' : index > 0 ? 'mt-4' : undefined}
          >
            {block.text.split('\n').map((line, lineIndex, lineArr) => (
              <span key={lineIndex}>
                {parseInline(line, `p-${index}-${lineIndex}`, citations)}
                {lineIndex < lineArr.length - 1 && <br />}
              </span>
            ))}
          </div>
        )
      })}
    </div>
  )
}
