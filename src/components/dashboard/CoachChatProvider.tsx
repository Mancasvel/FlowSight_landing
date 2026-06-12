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
  deleteCoachConversation,
  fetchCoachConversation,
  fetchCoachConversations,
  renameCoachConversation,
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
  renameConversation: (id: string, title: string) => Promise<void>
  deleteConversation: (id: string) => Promise<boolean>
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

  const renameConversation = useCallback(
    async (id: string, title: string) => {
      if (!teamId) return
      const trimmed = title.trim()
      if (!trimmed) return
      try {
        await renameCoachConversation(id, teamId, trimmed)
        await refreshConversations()
      } catch (err) {
        console.error('Failed to rename conversation:', err)
      }
    },
    [refreshConversations, teamId]
  )

  const deleteConversation = useCallback(
    async (id: string) => {
      if (!teamId) return false
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (activeConversationId === id) {
        setActiveConversationId(null)
        setActiveMessagesState([])
      }
      try {
        await deleteCoachConversation(id, teamId)
        await refreshConversations()
        return true
      } catch (err) {
        console.error('Failed to delete conversation:', err)
        await refreshConversations()
        return false
      }
    },
    [activeConversationId, refreshConversations, teamId]
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
      renameConversation,
      deleteConversation,
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
      renameConversation,
      deleteConversation,
    ]
  )

  return <CoachChatContext.Provider value={value}>{children}</CoachChatContext.Provider>
}
