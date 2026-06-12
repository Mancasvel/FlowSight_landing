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
  createCoachConversationApi,
  fetchCoachConversation,
  fetchCoachConversations,
} from '@/lib/coachChat/apiClient'
import { migrateLocalCoachChatsToServer } from '@/lib/coachChat/migrateLocalStorage'
import type { CoachChatMessage, CoachConversation } from '@/lib/coachChat/types'

type CoachChatContextValue = {
  conversations: CoachConversation[]
  activeConversationId: string | null
  activeMessages: CoachChatMessage[]
  loading: boolean
  selectConversation: (id: string) => Promise<void>
  startNewConversation: () => Promise<void>
  setActiveConversationId: (id: string | null) => void
  setActiveMessages: (messages: CoachChatMessage[]) => void
  applyServerConversation: (conversationId: string, messages: CoachChatMessage[]) => void
  refreshConversations: () => Promise<void>
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
  const [loading, setLoading] = useState(false)

  const refreshConversations = useCallback(async () => {
    if (!teamId) {
      setConversations([])
      return
    }
    try {
      const list = await fetchCoachConversations(teamId)
      setConversations(list)
    } catch (err) {
      console.error('Failed to load coach conversations:', err)
      setConversations([])
    }
  }, [teamId])

  useEffect(() => {
    if (!teamId) return

    let cancelled = false

    async function bootstrap() {
      setLoading(true)
      try {
        await migrateLocalCoachChatsToServer(userId, teamId!)
        if (!cancelled) await refreshConversations()
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    setActiveConversationId(null)
    setActiveMessagesState([])
    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [teamId, userId, refreshConversations])

  const selectConversation = useCallback(
    async (id: string) => {
      if (!teamId) return
      setLoading(true)
      try {
        const conv = await fetchCoachConversation(id, teamId)
        setActiveConversationId(conv.id)
        setActiveMessagesState(conv.messages)
      } catch (err) {
        console.error('Failed to load conversation:', err)
      } finally {
        setLoading(false)
      }
    },
    [teamId]
  )

  const startNewConversation = useCallback(async () => {
    if (!teamId) return
    setLoading(true)
    try {
      const conv = await createCoachConversationApi(teamId)
      setActiveConversationId(conv.id)
      setActiveMessagesState([])
      await refreshConversations()
    } catch (err) {
      console.error('Failed to create conversation:', err)
    } finally {
      setLoading(false)
    }
  }, [refreshConversations, teamId])

  const setActiveMessages = useCallback((messages: CoachChatMessage[]) => {
    setActiveMessagesState(messages)
  }, [])

  const applyServerConversation = useCallback(
    (conversationId: string, messages: CoachChatMessage[]) => {
      setActiveConversationId(conversationId)
      setActiveMessagesState(messages)
      void refreshConversations()
    },
    [refreshConversations]
  )

  const value = useMemo(
    () => ({
      conversations,
      activeConversationId,
      activeMessages,
      loading,
      selectConversation,
      startNewConversation,
      setActiveConversationId,
      setActiveMessages,
      applyServerConversation,
      refreshConversations,
    }),
    [
      conversations,
      activeConversationId,
      activeMessages,
      loading,
      selectConversation,
      startNewConversation,
      setActiveConversationId,
      setActiveMessages,
      applyServerConversation,
      refreshConversations,
    ]
  )

  return <CoachChatContext.Provider value={value}>{children}</CoachChatContext.Provider>
}
