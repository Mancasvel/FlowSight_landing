'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createCoachConversation,
  listCoachConversations,
  updateCoachConversationMessages,
  upsertCoachConversation,
} from '@/lib/coachChat/storage'
import type { CoachChatMessage, CoachConversation } from '@/lib/coachChat/types'

type CoachChatContextValue = {
  conversations: CoachConversation[]
  activeConversationId: string | null
  activeMessages: CoachChatMessage[]
  selectConversation: (id: string) => void
  startNewConversation: () => void
  saveMessages: (messages: CoachChatMessage[], conversationId?: string) => string
  refreshConversations: () => void
}

const CoachChatContext = createContext<CoachChatContextValue | null>(null)

export function useCoachChat(): CoachChatContextValue {
  const ctx = useContext(CoachChatContext)
  if (!ctx) {
    throw new Error('useCoachChat must be used within CoachChatProvider')
  }
  return ctx
}

export function useCoachChatOptional(): CoachChatContextValue | null {
  return useContext(CoachChatContext)
}

type Props = {
  userId: string
  teamId: string | null
  children: ReactNode
}

export default function CoachChatProvider({ userId, teamId, children }: Props) {
  const [conversations, setConversations] = useState<CoachConversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [activeMessages, setActiveMessagesState] = useState<CoachChatMessage[]>([])

  const refreshConversations = useCallback(() => {
    if (!teamId) {
      setConversations([])
      return
    }
    setConversations(listCoachConversations(userId, teamId))
  }, [teamId, userId])

  useEffect(() => {
    refreshConversations()
    setActiveConversationId(null)
    setActiveMessagesState([])
  }, [teamId, userId, refreshConversations])

  const selectConversation = useCallback(
    (id: string) => {
      if (!teamId) return
      const conv = conversations.find((c) => c.id === id)
      if (!conv) return
      setActiveConversationId(id)
      setActiveMessagesState(conv.messages)
    },
    [conversations, teamId]
  )

  const startNewConversation = useCallback(() => {
    if (!teamId) return
    const existingEmpty = conversations.find((c) => c.messages.length === 0)
    if (existingEmpty) {
      setActiveConversationId(existingEmpty.id)
      setActiveMessagesState([])
      return
    }
    const conv = createCoachConversation(userId, teamId)
    upsertCoachConversation(userId, teamId, conv)
    setActiveConversationId(conv.id)
    setActiveMessagesState([])
    refreshConversations()
  }, [conversations, refreshConversations, teamId, userId])

  const saveMessages = useCallback(
    (messages: CoachChatMessage[], conversationId?: string): string => {
      if (!teamId) return ''

      let id = conversationId ?? activeConversationId
      if (!id) {
        const conv = createCoachConversation(userId, teamId)
        upsertCoachConversation(userId, teamId, conv)
        id = conv.id
      }

      setActiveConversationId(id)
      setActiveMessagesState(messages)
      updateCoachConversationMessages(userId, teamId, id, messages)
      refreshConversations()
      return id
    },
    [activeConversationId, refreshConversations, teamId, userId]
  )

  const value = useMemo(
    () => ({
      conversations,
      activeConversationId,
      activeMessages,
      selectConversation,
      startNewConversation,
      saveMessages,
      refreshConversations,
    }),
    [
      conversations,
      activeConversationId,
      activeMessages,
      selectConversation,
      startNewConversation,
      saveMessages,
      refreshConversations,
    ]
  )

  return <CoachChatContext.Provider value={value}>{children}</CoachChatContext.Provider>
}
