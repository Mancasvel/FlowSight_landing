import type { RagMatch } from './server'
import type { CoachChatMessage } from './types'

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
