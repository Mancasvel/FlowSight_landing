import type { CoachChatMessage, CoachConversation } from './types'

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: string }
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? 'Request failed')
  }
  return data
}

const fetchOpts: RequestInit = { cache: 'no-store' }

export async function fetchCoachConversations(teamId: string): Promise<CoachConversation[]> {
  const res = await fetch(
    `/api/chat/conversations?teamId=${encodeURIComponent(teamId)}`,
    fetchOpts
  )
  const data = await parseJson<{ conversations: CoachConversation[] }>(res)
  return data.conversations
}

export async function createCoachConversationApi(teamId: string): Promise<CoachConversation> {
  const res = await fetch('/api/chat/conversations', {
    ...fetchOpts,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamId }),
  })
  const data = await parseJson<{ conversation: CoachConversation }>(res)
  return data.conversation
}

export async function fetchCoachConversation(
  conversationId: string,
  teamId: string
): Promise<CoachConversation> {
  const res = await fetch(
    `/api/chat/conversations/${conversationId}?teamId=${encodeURIComponent(teamId)}`,
    fetchOpts
  )
  const data = await parseJson<{ conversation: CoachConversation }>(res)
  return data.conversation
}

export async function syncCoachConversationMessages(
  conversationId: string,
  teamId: string,
  messages: CoachChatMessage[]
): Promise<CoachConversation> {
  const res = await fetch(`/api/chat/conversations/${conversationId}`, {
    ...fetchOpts,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamId, messages }),
  })
  const data = await parseJson<{ conversation: CoachConversation }>(res)
  return data.conversation
}

export async function renameCoachConversation(
  conversationId: string,
  teamId: string,
  title: string
): Promise<CoachConversation> {
  const res = await fetch(`/api/chat/conversations/${conversationId}`, {
    ...fetchOpts,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamId, title }),
  })
  const data = await parseJson<{ conversation: CoachConversation }>(res)
  return data.conversation
}

export async function deleteCoachConversation(
  conversationId: string,
  teamId: string
): Promise<void> {
  const res = await fetch(
    `/api/chat/conversations/${conversationId}?teamId=${encodeURIComponent(teamId)}`,
    { ...fetchOpts, method: 'DELETE' }
  )
  await parseJson<{ ok: boolean }>(res)
}
