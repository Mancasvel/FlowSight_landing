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

export type CoachDocument = {
  id: string
  conversationId: string
  fileName: string
  mimeType: string
  charCount: number
  truncated: boolean
  createdAt: string
}
