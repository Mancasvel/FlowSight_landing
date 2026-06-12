import type { RagMatch } from './server'
import type { CoachChatMessage } from './types'

import type { ContextChunkMatch } from './contextVectorServer'

export function buildVectorContextBlock(matches: ContextChunkMatch[]): string {
  if (matches.length === 0) return ''

  const lines = matches.map(
    (m, i) =>
      `${i + 1}. [${m.sourceName}] ${m.excerpt.replace(/\s+/g, ' ').trim()}`
  )

  return `Relevant excerpts from uploaded documents (vector retrieval, not full files):\n${lines.join('\n')}`
}

/** Session-only fallback when vector index is unavailable for this upload. */
export function buildSessionDocumentsBlock(
  docs: { fileName: string; text: string }[]
): string {
  if (docs.length === 0) return ''

  const sections = docs.map(
    (d) => `### ${d.fileName}\n${d.text.replace(/\s+/g, ' ').trim().slice(0, 4000)}`
  )

  return `Session document excerpts (not persisted):\n\n${sections.join('\n\n')}`
}

export function buildRagContextBlock(matches: RagMatch[]): string {
  if (matches.length === 0) return ''

  const lines = matches.map(
    (m, i) => `${i + 1}. [${m.role}] ${m.content.replace(/\s+/g, ' ').trim()}`
  )

  return `Relevant notes from your past coach chats:\n${lines.join('\n')}`
}

export function buildConversationHistoryBlock(messages: CoachChatMessage[], maxTurns = 8): string {
  if (messages.length === 0) return ''

  const recent = messages.slice(-maxTurns)
  const lines = recent.map((m) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`)
  return `Current conversation so far:\n${lines.join('\n')}`
}
