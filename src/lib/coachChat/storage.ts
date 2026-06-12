import type { CoachChatMessage, CoachConversation } from './types'

const STORAGE_PREFIX = 'flowsight_coach_chats'

function storageKey(userId: string, teamId: string): string {
  return `${STORAGE_PREFIX}:${userId}:${teamId}`
}

function readAll(userId: string, teamId: string): CoachConversation[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(storageKey(userId, teamId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as CoachConversation[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(userId: string, teamId: string, conversations: CoachConversation[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(storageKey(userId, teamId), JSON.stringify(conversations))
}

export function listCoachConversations(userId: string, teamId: string): CoachConversation[] {
  return readAll(userId, teamId).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function getCoachConversation(
  userId: string,
  teamId: string,
  conversationId: string
): CoachConversation | null {
  return readAll(userId, teamId).find((c) => c.id === conversationId) ?? null
}

function titleFromMessage(content: string): string {
  const trimmed = content.trim()
  if (trimmed.length <= 48) return trimmed
  return `${trimmed.slice(0, 45)}…`
}

export function createCoachConversation(userId: string, teamId: string): CoachConversation {
  const now = new Date().toISOString()
  return {
    id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId,
    teamId,
    title: 'New chat',
    createdAt: now,
    updatedAt: now,
    messages: [],
  }
}

export function upsertCoachConversation(
  userId: string,
  teamId: string,
  conversation: CoachConversation
): void {
  const all = readAll(userId, teamId)
  const idx = all.findIndex((c) => c.id === conversation.id)
  if (idx >= 0) all[idx] = conversation
  else all.unshift(conversation)
  writeAll(userId, teamId, all)
}

export function updateCoachConversationMessages(
  userId: string,
  teamId: string,
  conversationId: string,
  messages: CoachChatMessage[]
): CoachConversation | null {
  const all = readAll(userId, teamId)
  const idx = all.findIndex((c) => c.id === conversationId)
  if (idx < 0) return null

  const firstUser = messages.find((m) => m.role === 'user')
  const updated: CoachConversation = {
    ...all[idx],
    messages,
    updatedAt: new Date().toISOString(),
    title: firstUser ? titleFromMessage(firstUser.content) : all[idx].title,
  }
  all[idx] = updated
  writeAll(userId, teamId, all)
  return updated
}
