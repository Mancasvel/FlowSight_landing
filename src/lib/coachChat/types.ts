export type CoachChatMessage = {
  id: string
  role: 'assistant' | 'user'
  content: string
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
