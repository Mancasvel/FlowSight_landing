import type { SupabaseClient } from '@supabase/supabase-js'
import { chunkText } from '@/lib/coachChat/chunkText'
import { embedTexts, embeddingToPgVector } from '@/lib/kimi/embeddings'
import type { CoachContextSource } from './types'

const MAX_SOURCES_PER_CONVERSATION = 5
const MAX_CHUNKS_PER_SOURCE = 48
const EXCERPT_MAX = 900

export type ContextChunkMatch = {
  sourceName: string
  excerpt: string
  similarity: number
}

type DbChunk = {
  source_id: string
  source_name: string
  chunk_index: number
  created_at: string
}

function toExcerpt(chunk: string): string {
  const trimmed = chunk.trim()
  if (trimmed.length <= EXCERPT_MAX) return trimmed
  return `${trimmed.slice(0, EXCERPT_MAX - 1)}…`
}

export async function countCoachContextSources(
  supabase: SupabaseClient,
  conversationId: string
): Promise<number> {
  const { data, error } = await supabase
    .from('coach_context_chunks')
    .select('source_id')
    .eq('conversation_id', conversationId)

  if (error) throw error
  return new Set((data ?? []).map((row) => row.source_id as string)).size
}

export async function listCoachContextSources(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  conversationId: string
): Promise<CoachContextSource[]> {
  const { data, error } = await supabase
    .from('coach_context_chunks')
    .select('source_id, source_name, chunk_index, created_at')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .eq('team_id', teamId)
    .order('created_at', { ascending: true })

  if (error) throw error

  const bySource = new Map<string, CoachContextSource>()
  for (const row of (data ?? []) as DbChunk[]) {
    const existing = bySource.get(row.source_id)
    if (!existing) {
      bySource.set(row.source_id, {
        id: row.source_id,
        conversationId,
        fileName: row.source_name,
        chunkCount: 1,
        createdAt: row.created_at,
      })
      continue
    }
    existing.chunkCount += 1
  }

  return Array.from(bySource.values())
}

export async function indexCoachDocumentVectors(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  conversationId: string,
  fileName: string,
  text: string
): Promise<CoachContextSource> {
  const sourceCount = await countCoachContextSources(supabase, conversationId)
  if (sourceCount >= MAX_SOURCES_PER_CONVERSATION) {
    throw new Error(`Maximum ${MAX_SOURCES_PER_CONVERSATION} documents per chat.`)
  }

  const chunks = chunkText(text).slice(0, MAX_CHUNKS_PER_SOURCE)
  if (chunks.length === 0) {
    throw new Error('Document appears empty or unreadable.')
  }

  const embeddings = await embedTexts(chunks)
  const sourceId = crypto.randomUUID()

  const rows = chunks.map((chunk, index) => ({
    source_id: sourceId,
    conversation_id: conversationId,
    user_id: userId,
    team_id: teamId,
    source_name: fileName,
    chunk_index: index,
    excerpt: toExcerpt(chunk),
    embedding: embeddingToPgVector(embeddings[index]),
  }))

  const { error } = await supabase.from('coach_context_chunks').insert(rows)
  if (error) throw error

  return {
    id: sourceId,
    conversationId,
    fileName,
    chunkCount: chunks.length,
    createdAt: new Date().toISOString(),
  }
}

export async function deleteCoachContextSource(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  sourceId: string
): Promise<void> {
  const { error } = await supabase
    .from('coach_context_chunks')
    .delete()
    .eq('source_id', sourceId)
    .eq('user_id', userId)
    .eq('team_id', teamId)

  if (error) throw error
}

export async function searchCoachContextVectors(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  conversationId: string,
  query: string,
  limit = 6
): Promise<ContextChunkMatch[]> {
  const [embedding] = await embedTexts([query])

  const { data, error } = await supabase.rpc('match_coach_context_chunks', {
    query_embedding: embeddingToPgVector(embedding),
    match_user_id: userId,
    match_team_id: teamId,
    match_conversation_id: conversationId,
    match_count: limit,
    match_threshold: 0.32,
  })

  if (error) {
    console.error('Coach vector search error:', error.message)
    return []
  }

  return ((data ?? []) as { source_name: string; excerpt: string; similarity: number }[])
    .filter((row) => row.similarity > 0)
    .map((row) => ({
      sourceName: row.source_name,
      excerpt: row.excerpt,
      similarity: row.similarity,
    }))
}
