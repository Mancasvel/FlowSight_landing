import type { ReactNode } from 'react'

type Props = {
  content: string
  className?: string
}

function parseItalic(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const regex = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|_(.+?)_/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const inner = match[1] ?? match[2]
    nodes.push(
      <em key={`${keyPrefix}-i${i}`} className="italic">
        {inner}
      </em>
    )
    lastIndex = match.index + match[0].length
    i += 1
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const regex = /\*\*(.+?)\*\*|__(.+?)__/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(...parseItalic(text.slice(lastIndex, match.index), `${keyPrefix}-pre${i}`))
    }
    const inner = match[1] ?? match[2]
    nodes.push(
      <strong key={`${keyPrefix}-b${i}`} className="font-semibold">
        {parseItalic(inner, `${keyPrefix}-b${i}-inner`)}
      </strong>
    )
    lastIndex = match.index + match[0].length
    i += 1
  }

  if (lastIndex < text.length) {
    nodes.push(...parseItalic(text.slice(lastIndex), `${keyPrefix}-tail`))
  }

  return nodes.length > 0 ? nodes : [text]
}

export default function CoachMessageContent({ content, className }: Props) {
  const paragraphs = content.split(/\n{2,}/)

  return (
    <div className={className}>
      {paragraphs.map((paragraph, pIndex) => (
        <p key={pIndex} className={pIndex > 0 ? 'mt-3' : undefined}>
          {paragraph.split('\n').map((line, lIndex, lines) => (
            <span key={lIndex}>
              {parseInline(line, `p${pIndex}-l${lIndex}`)}
              {lIndex < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  )
}
