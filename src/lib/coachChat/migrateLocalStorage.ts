import {
  createCoachConversationApi,
  syncCoachConversationMessages,
} from './apiClient'
import { listCoachConversations } from './storage'
import type { CoachConversation } from './types'

const MIGRATED_KEY = 'flowsight_coach_chats_migrated'

function migrationFlagKey(userId: string, teamId: string): string {
  return `${MIGRATED_KEY}:${userId}:${teamId}`
}

export function hasMigratedCoachChats(userId: string, teamId: string): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(migrationFlagKey(userId, teamId)) === '1'
}

function markMigrated(userId: string, teamId: string): void {
  localStorage.setItem(migrationFlagKey(userId, teamId), '1')
}

export async function migrateLocalCoachChatsToServer(
  userId: string,
  teamId: string
): Promise<void> {
  if (typeof window === 'undefined' || hasMigratedCoachChats(userId, teamId)) return

  const local = listCoachConversations(userId, teamId).filter((c) => c.messages.length > 0)
  if (local.length === 0) {
    markMigrated(userId, teamId)
    return
  }

  for (const conv of local) {
    const created = await createCoachConversationApi(teamId)
    await syncCoachConversationMessages(created.id, teamId, conv.messages)
  }

  markMigrated(userId, teamId)
  localStorage.removeItem(`flowsight_coach_chats:${userId}:${teamId}`)
}

export type { CoachConversation }
