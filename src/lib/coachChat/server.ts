import type { SupabaseClient } from '@supabase/supabase-js'
import { isSchemaMismatchError } from '@/lib/supabase/schemaCompat'
import type { CoachChatMessage, CoachConversation } from './types'

function titleFromMessage(content: string): string {
  const trimmed = content.trim()
  if (trimmed.length <= 48) return trimmed
  return `${trimmed.slice(0, 45)}…`
}

type DbConversation = {
  id: string
  user_id: string
  team_id: string
  title: string
  created_at: string
  updated_at: string
}

type DbMessage = {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  reasoning?: string | null
  created_at: string
}

function mapMessage(row: DbMessage): CoachChatMessage {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    reasoning: row.reasoning ?? null,
  }
}

async function fetchCoachMessages(
  supabase: SupabaseClient,
  conversationIds: string[]
): Promise<DbMessage[]> {
  if (conversationIds.length === 0) return []

  const withReasoning = await supabase
    .from('coach_messages')
    .select('id, conversation_id, role, content, reasoning, created_at')
    .in('conversation_id', conversationIds)
    .order('created_at', { ascending: true })

  if (!withReasoning.error) {
    return (withReasoning.data ?? []) as DbMessage[]
  }

  if (!isSchemaMismatchError(withReasoning.error)) {
    throw withReasoning.error
  }

  const basic = await supabase
    .from('coach_messages')
    .select('id, conversation_id, role, content, created_at')
    .in('conversation_id', conversationIds)
    .order('created_at', { ascending: true })

  if (basic.error) throw basic.error

  return ((basic.data ?? []) as Omit<DbMessage, 'reasoning'>[]).map((row) => ({
    ...row,
    reasoning: null,
  }))
}

async function insertCoachMessages(
  supabase: SupabaseClient,
  conversationId: string,
  messages: CoachChatMessage[]
): Promise<void> {
  if (messages.length === 0) return

  const withReasoning = messages.map((m) => ({
    conversation_id: conversationId,
    role: m.role,
    content: m.content,
    ...(m.reasoning ? { reasoning: m.reasoning } : {}),
  }))

  const { error } = await supabase.from('coach_messages').insert(withReasoning)
  if (!error) return

  if (!isSchemaMismatchError(error)) {
    throw error
  }

  const basic = messages.map((m) => ({
    conversation_id: conversationId,
    role: m.role,
    content: m.content,
  }))

  const { error: basicError } = await supabase.from('coach_messages').insert(basic)
  if (basicError) throw basicError
}

function mapConversation(row: DbConversation, messages: CoachChatMessage[]): CoachConversation {
  return {
    id: row.id,
    userId: row.user_id,
    teamId: row.team_id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messages,
  }
}

export async function listCoachConversationsFromDb(
  supabase: SupabaseClient,
  userId: string,
  teamId: string
): Promise<CoachConversation[]> {
  const { data: rows, error } = await supabase
    .from('coach_conversations')
    .select('id, user_id, team_id, title, created_at, updated_at')
    .eq('user_id', userId)
    .eq('team_id', teamId)
    .order('updated_at', { ascending: false })
    .limit(10)

  if (error) throw error

  const conversations = (rows ?? []) as DbConversation[]
  if (conversations.length === 0) return []

  const ids = conversations.map((c) => c.id)
  const messageRows = await fetchCoachMessages(supabase, ids)

  const byConversation = new Map<string, CoachChatMessage[]>()
  for (const row of messageRows) {
    const list = byConversation.get(row.conversation_id) ?? []
    list.push(mapMessage(row))
    byConversation.set(row.conversation_id, list)
  }

  return conversations.map((row) => mapConversation(row, byConversation.get(row.id) ?? []))
}

export async function getCoachConversationFromDb(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  conversationId: string
): Promise<CoachConversation | null> {
  const { data: row, error } = await supabase
    .from('coach_conversations')
    .select('id, user_id, team_id, title, created_at, updated_at')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .eq('team_id', teamId)
    .maybeSingle()

  if (error) throw error
  if (!row) return null

  const messageRows = await fetchCoachMessages(supabase, [conversationId])

  return mapConversation(row as DbConversation, messageRows.map(mapMessage))
}

export async function createCoachConversationInDb(
  supabase: SupabaseClient,
  userId: string,
  teamId: string
): Promise<CoachConversation> {
  const { data, error } = await supabase
    .from('coach_conversations')
    .insert({ user_id: userId, team_id: teamId, title: 'New chat' })
    .select('id, user_id, team_id, title, created_at, updated_at')
    .single()

  if (error) throw error
  return mapConversation(data as DbConversation, [])
}

export async function replaceCoachConversationMessages(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  conversationId: string,
  messages: CoachChatMessage[]
): Promise<CoachConversation | null> {
  const existing = await getCoachConversationFromDb(supabase, userId, teamId, conversationId)
  if (!existing) return null

  const { error: deleteError } = await supabase
    .from('coach_messages')
    .delete()
    .eq('conversation_id', conversationId)

  if (deleteError) throw deleteError

  if (messages.length > 0) {
    await insertCoachMessages(supabase, conversationId, messages)
  }

  const firstUser = messages.find((m) => m.role === 'user')
  const title = firstUser ? titleFromMessage(firstUser.content) : existing.title

  const { error: updateError } = await supabase
    .from('coach_conversations')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', conversationId)
    .eq('user_id', userId)

  if (updateError) throw updateError

  return getCoachConversationFromDb(supabase, userId, teamId, conversationId)
}

export type RagMatch = {
  content: string
  role: string
  rank: number
}

export async function searchCoachMessageRag(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  query: string,
  excludeConversationId?: string,
  limit = 5
): Promise<RagMatch[]> {
  const { data, error } = await supabase.rpc('match_coach_messages_fts', {
    search_query: query,
    match_user_id: userId,
    match_team_id: teamId,
    match_count: limit,
    exclude_conversation_id: excludeConversationId ?? null,
  })

  if (error) {
    console.error('Coach RAG search error:', error.message)
    return []
  }

  return ((data ?? []) as RagMatch[]).filter((row) => row.rank > 0)
}

export async function updateCoachConversationTitleInDb(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  conversationId: string,
  title: string
): Promise<CoachConversation | null> {
  const trimmed = title.trim().slice(0, 80)
  if (!trimmed) return null

  const { error } = await supabase
    .from('coach_conversations')
    .update({ title: trimmed, updated_at: new Date().toISOString() })
    .eq('id', conversationId)
    .eq('user_id', userId)
    .eq('team_id', teamId)

  if (error) throw error
  return getCoachConversationFromDb(supabase, userId, teamId, conversationId)
}

export async function deleteCoachConversationFromDb(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  conversationId: string
): Promise<boolean> {
  const existing = await getCoachConversationFromDb(supabase, userId, teamId, conversationId)
  if (!existing) return false

  const chunks = await supabase
    .from('coach_context_chunks')
    .delete()
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .eq('team_id', teamId)
  if (chunks.error && !isSchemaMismatchError(chunks.error)) {
    throw chunks.error
  }

  const { error: messagesError } = await supabase
    .from('coach_messages')
    .delete()
    .eq('conversation_id', conversationId)
  if (messagesError) throw messagesError

  const { error } = await supabase
    .from('coach_conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', userId)
    .eq('team_id', teamId)

  if (error) throw error
  return true
}

export async function appendCoachMessages(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  conversationId: string,
  newMessages: CoachChatMessage[]
): Promise<CoachConversation | null> {
  const existing = await getCoachConversationFromDb(supabase, userId, teamId, conversationId)
  if (!existing) return null
  return replaceCoachConversationMessages(supabase, userId, teamId, conversationId, [
    ...existing.messages,
    ...newMessages,
  ])
}
