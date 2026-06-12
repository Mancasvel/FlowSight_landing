'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Paperclip, SendHorizonal, Sparkles } from 'lucide-react'
import { Avatar } from '@/components/ui'
import { useCoachChat } from '@/components/dashboard/CoachChatProvider'
import type { ProactiveInsight } from '@/lib/buildProactiveInsights'
import type { CoachChatMessage } from '@/lib/coachChat/types'

const MAX_CHARS = 500

type PromptUsage = {
  used: number
  limit: number
  remaining: number
  planId: string
}

type Props = {
  displayName: string
  teamId: string
  insights: ProactiveInsight[]
}

function fallbackReply(prompt: string, insights: ProactiveInsight[]): string {
  const lower = prompt.toLowerCase()
  if (lower.includes('meeting') || lower.includes('calendar')) {
    const m = insights.find((i) => i.kind === 'meeting')
    return m ? `${m.title} — ${m.body}` : 'Meeting load looks normal this week.'
  }
  if (lower.includes('focus') || lower.includes('flow') || lower.includes('deep')) {
    const f = insights.find((i) => i.kind === 'focus')
    return f ? `${f.title}. ${f.body}` : 'Team flow data is still syncing for today.'
  }
  const pick = insights[0]
  return pick
    ? `${pick.title}. ${pick.body}`
    : 'Connect a Pro plan to unlock the full AI coach, or try again when the service is available.'
}

export default function DashboardChat({ displayName, teamId, insights }: Props) {
  const { activeMessages, saveMessages } = useCoachChat()
  const messages = activeMessages
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [usage, setUsage] = useState<PromptUsage | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const quickPrompts = useMemo(
    () => [
      "What's next for my team?",
      "Who's in deep work right now?",
      'How are meetings affecting focus?',
    ],
    []
  )

  const loadUsage = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?teamId=${encodeURIComponent(teamId)}`)
      if (res.ok) {
        const data = await res.json()
        setUsage(data.usage)
      }
    } catch {
      /* non-blocking */
    }
  }, [teamId])

  useEffect(() => {
    loadUsage()
  }, [loadUsage])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    })
  }, [])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || sending) return

      setSending(true)
      setInput('')
      const userMsg: CoachChatMessage = { id: `u-${Date.now()}`, role: 'user', content: trimmed }
      const withUser = [...messages, userMsg]
      const conversationId = saveMessages(withUser)
      scrollToBottom()

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, teamId }),
        })

        const data = await res.json()

        if (!res.ok) {
          const errText =
            data.error ??
            (res.status === 429
              ? 'Monthly coach limit reached. Resets on the 1st.'
              : 'Could not reach the AI coach.')
          saveMessages(
            [...withUser, { id: `a-${Date.now()}`, role: 'assistant', content: errText }],
            conversationId
          )
          if (data.usage) setUsage(data.usage)
          return
        }

        saveMessages(
          [...withUser, { id: `a-${Date.now()}`, role: 'assistant', content: data.reply }],
          conversationId
        )
        if (data.usage) setUsage(data.usage)
      } catch {
        saveMessages(
          [
            ...withUser,
            {
              id: `a-${Date.now()}`,
              role: 'assistant',
              content: fallbackReply(trimmed, insights),
            },
          ],
          conversationId
        )
      } finally {
        setSending(false)
        scrollToBottom()
      }
    },
    [insights, messages, saveMessages, scrollToBottom, sending, teamId]
  )

  const hasConversation = messages.length > 0
  const usageWarning =
    usage && usage.limit > 0 && usage.remaining <= Math.ceil(usage.limit * 0.2)

  return (
    <div className="flex w-full flex-col font-sans">
      {usage && usage.limit > 0 && (
        <p
          className={`mb-3 text-center text-[11px] tabular-nums ${
            usageWarning ? 'text-amber-600' : 'text-zinc-400'
          }`}
        >
          Coach: {usage.used}/{usage.limit} prompts this month
          {usage.remaining > 0 ? ` · ${usage.remaining} left` : ' · limit reached'}
        </p>
      )}

      {hasConversation && (
        <div ref={scrollRef} className="mb-6 max-h-[55vh] space-y-5 overflow-y-auto dark-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'assistant' ? (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white">
                  <Image src="/flowsight_sinfondo.png" alt="FlowSight" width={16} height={16} />
                </div>
              ) : (
                <Avatar name={displayName} size="sm" className="shrink-0" />
              )}
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                  msg.role === 'user' ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-700'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white">
                <Image
                  src="/flowsight_sinfondo.png"
                  alt="FlowSight"
                  width={16}
                  height={16}
                  className="animate-pulse"
                />
              </div>
              <div className="rounded-xl bg-zinc-50 px-4 py-2.5 text-[13.5px] text-zinc-400">
                Thinking…
              </div>
            </div>
          )}
        </div>
      )}

      {!hasConversation && (
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/flowsight_sinfondo.png"
            alt="FlowSight"
            width={200}
            height={200}
            className="mb-8"
          />
          <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900">
            What&apos;s next for your team?
          </h1>
          <p className="mt-1.5 max-w-sm text-[13px] text-zinc-400">
            Cognitive health and focus signals, summarized for you.
          </p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage(input)
        }}
        className="relative rounded-2xl border border-zinc-200 bg-white shadow-sm transition-colors focus-within:border-zinc-300"
      >
        <label htmlFor="dashboard-chat-input" className="sr-only">
          Message FlowSight AI
        </label>
        <textarea
          id="dashboard-chat-input"
          rows={2}
          value={input}
          maxLength={MAX_CHARS}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about focus, activity, meetings or planning…"
          className="w-full resize-none bg-transparent px-5 pt-4 pb-14 text-[14px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage(input)
            }
          }}
        />
        <span className="pointer-events-none absolute left-5 bottom-[3.5rem] text-[11px] tabular-nums text-zinc-300">
          {input.length}/{MAX_CHARS}
        </span>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
              aria-label="AI suggestions"
            >
              <Sparkles className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
              aria-label="Add attachment"
            >
              <Paperclip className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:text-zinc-300 disabled:hover:bg-transparent"
            aria-label="Send message"
          >
            <SendHorizonal className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </form>

      {!hasConversation && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {quickPrompts.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => sendMessage(q)}
              className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
