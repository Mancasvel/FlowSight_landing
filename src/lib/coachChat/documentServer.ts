import type { SupabaseClient } from '@supabase/supabase-js'
import type { CoachDocument } from './types'

const MAX_DOCS_PER_CONVERSATION = 5

type DbDocument = {
  id: string
  conversation_id: string
  user_id: string
  team_id: string
  file_name: string
  mime_type: string
  content_text: string
  char_count: number
  truncated: boolean
  created_at: string
}

function mapDocument(row: DbDocument): CoachDocument {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    fileName: row.file_name,
    mimeType: row.mime_type,
    charCount: row.char_count,
    truncated: row.truncated,
    createdAt: row.created_at,
  }
}

export async function countCoachDocuments(
  supabase: SupabaseClient,
  conversationId: string
): Promise<number> {
  const { count, error } = await supabase
    .from('coach_documents')
    .select('id', { count: 'exact', head: true })
    .eq('conversation_id', conversationId)

  if (error) throw error
  return count ?? 0
}

export async function listCoachDocuments(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  conversationId: string
): Promise<CoachDocument[]> {
  const { data, error } = await supabase
    .from('coach_documents')
    .select('id, conversation_id, user_id, team_id, file_name, mime_type, char_count, truncated, created_at')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .eq('team_id', teamId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return ((data ?? []) as DbDocument[]).map(mapDocument)
}

export async function getCoachDocumentTexts(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  conversationId: string,
  documentIds?: string[]
): Promise<{ id: string; fileName: string; text: string }[]> {
  let query = supabase
    .from('coach_documents')
    .select('id, file_name, content_text')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .eq('team_id', teamId)

  if (documentIds && documentIds.length > 0) {
    query = query.in('id', documentIds)
  }

  const { data, error } = await query.order('created_at', { ascending: true })
  if (error) throw error

  return ((data ?? []) as { id: string; file_name: string; content_text: string }[]).map((row) => ({
    id: row.id,
    fileName: row.file_name,
    text: row.content_text,
  }))
}

export async function insertCoachDocument(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  conversationId: string,
  fileName: string,
  mimeType: string,
  text: string,
  truncated: boolean
): Promise<CoachDocument> {
  const existing = await countCoachDocuments(supabase, conversationId)
  if (existing >= MAX_DOCS_PER_CONVERSATION) {
    throw new Error(`Maximum ${MAX_DOCS_PER_CONVERSATION} documents per chat.`)
  }

  const { data, error } = await supabase
    .from('coach_documents')
    .insert({
      conversation_id: conversationId,
      user_id: userId,
      team_id: teamId,
      file_name: fileName,
      mime_type: mimeType,
      content_text: text,
      char_count: text.length,
      truncated,
    })
    .select('id, conversation_id, user_id, team_id, file_name, mime_type, char_count, truncated, created_at')
    .single()

  if (error) throw error
  return mapDocument(data as DbDocument)
}

export async function deleteCoachDocument(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  documentId: string
): Promise<void> {
  const { error } = await supabase
    .from('coach_documents')
    .delete()
    .eq('id', documentId)
    .eq('user_id', userId)
    .eq('team_id', teamId)

  if (error) throw error
}
