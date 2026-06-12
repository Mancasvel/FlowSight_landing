'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { FileText, Paperclip, SendHorizonal, Sparkles, X } from 'lucide-react'
import { Avatar } from '@/components/ui'
import CoachMessageContent from '@/components/dashboard/CoachMessageContent'
import CoachThinkingBlock from '@/components/dashboard/CoachThinkingBlock'
import { useCoachChat } from '@/components/dashboard/CoachChatProvider'
import type { ProactiveInsight } from '@/lib/buildProactiveInsights'
import type { CoachChatMessage } from '@/lib/coachChat/types'

const MAX_CHARS = 500
const MAX_FILE_BYTES = 2 * 1024 * 1024

type PromptUsage = {
  used: number
  limit: number
  remaining: number
  planId: string
}

type PendingAttachment = {
  id: string
  fileName: string
  documentId?: string
  inlineText?: string
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

function isTextLikeFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return (
    file.type.startsWith('text/') ||
    name.endsWith('.md') ||
    name.endsWith('.txt') ||
    name.endsWith('.csv') ||
    name.endsWith('.json')
  )
}

export default function DashboardChat({ displayName, teamId, insights }: Props) {
  const {
    activeMessages,
    activeConversationId,
    setActiveConversationId,
    setActiveMessages,
    applyServerConversation,
  } = useCoachChat()
  const messages = activeMessages
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([])
  const [usage, setUsage] = useState<PromptUsage | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [])

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

  useEffect(() => {
    resizeTextarea()
  }, [input, resizeTextarea])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    })
  }, [])

  const removeAttachment = useCallback((id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const handleFilePick = useCallback(
    async (file: File) => {
      setUploadError(null)

      if (file.size > MAX_FILE_BYTES) {
        setUploadError('File must be 2 MB or smaller.')
        return
      }

      setUploading(true)
      try {
        const form = new FormData()
        form.append('file', file)
        form.append('teamId', teamId)
        if (activeConversationId) form.append('conversationId', activeConversationId)

        const res = await fetch('/api/chat/documents', { method: 'POST', body: form })
        const data = await res.json()

        if (res.ok && data.document) {
          if (data.conversationId && !activeConversationId) {
            setActiveConversationId(data.conversationId)
          }
          setPendingAttachments((prev) => [
            ...prev,
            {
              id: data.document.id,
              fileName: data.document.fileName,
              documentId: data.document.id,
            },
          ])
          return
        }

        if (res.status === 503 && isTextLikeFile(file)) {
          const text = (await file.text()).trim().slice(0, 24_000)
          if (!text) throw new Error('Document appears empty.')
          setPendingAttachments((prev) => [
            ...prev,
            {
              id: `inline-${Date.now()}`,
              fileName: file.name,
              inlineText: text,
            },
          ])
          return
        }

        setUploadError(data.error ?? 'Could not upload document.')
      } catch {
        setUploadError('Could not upload document.')
      } finally {
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    },
    [activeConversationId, setActiveConversationId, teamId]
  )

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if ((!trimmed && pendingAttachments.length === 0) || sending) return

      setSending(true)
      setInput('')
      setUploadError(null)

      const attachmentMeta = pendingAttachments.map((a) => ({
        id: a.id,
        fileName: a.fileName,
        charCount: a.inlineText?.length ?? 0,
      }))

      const displayContent =
        trimmed ||
        `Review the attached document${pendingAttachments.length > 1 ? 's' : ''} and summarize what matters for team focus.`

      const userMsg: CoachChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: displayContent,
        attachments: attachmentMeta.length > 0 ? attachmentMeta : undefined,
      }
      const withUser = [...messages, userMsg]
      setActiveMessages(withUser)
      scrollToBottom()

      const documentIds = pendingAttachments
        .map((a) => a.documentId)
        .filter((id): id is string => Boolean(id))
      const inlineDocuments = pendingAttachments
        .filter((a) => a.inlineText)
        .map((a) => ({ fileName: a.fileName, text: a.inlineText! }))

      setPendingAttachments([])

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: displayContent,
            teamId,
            conversationId: activeConversationId ?? undefined,
            documentIds: documentIds.length > 0 ? documentIds : undefined,
            inlineDocuments: inlineDocuments.length > 0 ? inlineDocuments : undefined,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          const errText =
            data.error ??
            (res.status === 429
              ? 'Monthly coach limit reached. Resets on the 1st.'
              : 'Could not reach the AI coach.')
          setActiveMessages([
            ...withUser,
            { id: `a-${Date.now()}`, role: 'assistant', content: errText },
          ])
          if (data.usage) setUsage(data.usage)
          return
        }

        if (data.conversationId && Array.isArray(data.messages)) {
          applyServerConversation(data.conversationId, data.messages)
        } else {
          setActiveMessages([
            ...withUser,
            {
              id: `a-${Date.now()}`,
              role: 'assistant',
              content: data.reply,
              reasoning: data.reasoning ?? null,
            },
          ])
        }
        if (data.usage) setUsage(data.usage)
      } catch {
        setActiveMessages([
          ...withUser,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: fallbackReply(displayContent, insights),
          },
        ])
      } finally {
        setSending(false)
        scrollToBottom()
      }
    },
    [
      activeConversationId,
      applyServerConversation,
      insights,
      messages,
      pendingAttachments,
      scrollToBottom,
      sending,
      setActiveMessages,
      teamId,
    ]
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
                {msg.role === 'assistant' && msg.reasoning && (
                  <CoachThinkingBlock reasoning={msg.reasoning} />
                )}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className={`mb-2 flex flex-wrap gap-1.5 ${msg.role === 'user' ? '' : ''}`}>
                    {msg.attachments.map((a) => (
                      <span
                        key={a.id}
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] ${
                          msg.role === 'user'
                            ? 'bg-zinc-800 text-zinc-200'
                            : 'bg-white text-zinc-500 border border-zinc-200'
                        }`}
                      >
                        <FileText className="h-3 w-3" strokeWidth={1.75} />
                        {a.fileName}
                      </span>
                    ))}
                  </div>
                )}
                <CoachMessageContent content={msg.content} />
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
            Cognitive health and focus signals, summarized for you. Attach TXT, MD, CSV, JSON, or PDF.
          </p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage(input)
        }}
        className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-colors focus-within:border-zinc-300"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.markdown,.csv,.json,.pdf,text/*,application/pdf"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleFilePick(file)
          }}
        />

        {pendingAttachments.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-zinc-100 px-4 py-2.5">
            {pendingAttachments.map((a) => (
              <span
                key={a.id}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] text-zinc-600"
              >
                <FileText className="h-3 w-3 text-zinc-400" strokeWidth={1.75} />
                {a.fileName}
                <button
                  type="button"
                  onClick={() => removeAttachment(a.id)}
                  className="text-zinc-400 hover:text-zinc-700"
                  aria-label={`Remove ${a.fileName}`}
                >
                  <X className="h-3 w-3" strokeWidth={2} />
                </button>
              </span>
            ))}
          </div>
        )}

        {uploadError && (
          <p className="border-b border-zinc-100 px-4 py-2 text-[11px] text-red-600">{uploadError}</p>
        )}

        <div className="min-h-0 flex-1 px-5 py-4">
          <label htmlFor="dashboard-chat-input" className="sr-only">
            Message FlowSight AI
          </label>
          <textarea
            ref={textareaRef}
            id="dashboard-chat-input"
            rows={2}
            value={input}
            maxLength={MAX_CHARS}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about focus, activity, meetings, planning, or uploaded docs…"
            className="block w-full min-h-[3.25rem] max-h-[200px] resize-none overflow-y-auto bg-transparent text-[14px] leading-relaxed text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
          />
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50/60 px-3 py-2">
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
              disabled={uploading || sending}
              onClick={() => fileInputRef.current?.click()}
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors disabled:opacity-40"
              aria-label="Upload document"
            >
              <Paperclip className={`h-4 w-4 ${uploading ? 'animate-pulse' : ''}`} strokeWidth={1.75} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-[11px] tabular-nums ${
                input.length >= MAX_CHARS ? 'text-amber-600' : 'text-zinc-400'
              }`}
              aria-live="polite"
            >
              {input.length}/{MAX_CHARS}
            </span>
            <button
              type="submit"
              disabled={(!input.trim() && pendingAttachments.length === 0) || sending || uploading}
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:text-zinc-300 disabled:hover:bg-transparent"
              aria-label="Send message"
            >
              <SendHorizonal className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
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
