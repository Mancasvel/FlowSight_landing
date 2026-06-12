import type { CoachCitationIndex } from '@/lib/coachChat/citations'

export type CoachChatAttachment = {
  id: string
  fileName: string
  charCount: number
}

export type CoachChatMessage = {
  id: string
  role: 'assistant' | 'user'
  content: string
  reasoning?: string | null
  attachments?: CoachChatAttachment[]
  citations?: CoachCitationIndex
}

export type CoachConversation = {
  id: string
  teamId: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
  messages: CoachChatMessage[]
}

export type CoachContextSource = {
  id: string
  conversationId: string
  fileName: string
  chunkCount: number
  createdAt: string
}
