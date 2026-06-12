import { parseCoachResponse } from '@/lib/coachChat/parseCoachResponse'

const DEFAULT_AZURE_ENDPOINT = 'https://france-flow.services.ai.azure.com/openai/v1'
const DEFAULT_AZURE_DEPLOYMENT = 'Mistral-Large-3'

export type KimiMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type KimiChatOptions = {
  system: string
  messages: KimiMessage[]
  maxTokens?: number
  temperature?: number
  /** When true, parse <thinking> / <answer> blocks from the model output. */
  structuredReasoning?: boolean
}

export type KimiChatResult = {
  answer: string
  reasoning: string | null
  raw: string
}

async function azureChatCompletion(options: KimiChatOptions): Promise<string> {
  const apiKey = process.env.AZURE_OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('AZURE_OPENAI_API_KEY is not configured')
  }

  const base = (process.env.AZURE_OPENAI_ENDPOINT ?? DEFAULT_AZURE_ENDPOINT).replace(/\/$/, '')
  const deployment =
    process.env.AZURE_OPENAI_DEPLOYMENT ??
    process.env.AZURE_OPENAI_MODEL ??
    DEFAULT_AZURE_DEPLOYMENT

  const messages: KimiMessage[] = [
    { role: 'system', content: options.system },
    ...options.messages.filter((m) => m.role !== 'system'),
  ]

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: deployment,
      messages,
      max_tokens: options.maxTokens ?? 1200,
      temperature: options.temperature ?? 0.35,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Azure OpenAI error ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }

  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error('Azure OpenAI returned an empty response')
  return content
}

export async function kimiChat(options: KimiChatOptions): Promise<KimiChatResult> {
  const raw = await azureChatCompletion(options)

  if (options.structuredReasoning) {
    const parsed = parseCoachResponse(raw)
    return { ...parsed, raw }
  }

  return { answer: raw, reasoning: null, raw }
}

/** Plain string helper for non-coach flows (e.g. weekly reports). */
export async function kimiChatPlain(options: Omit<KimiChatOptions, 'structuredReasoning'>): Promise<string> {
  const result = await kimiChat({ ...options, structuredReasoning: false })
  return result.answer
}

export const COACH_SYSTEM_PROMPT = `You are FlowSight, a privacy-first team cognitive health coach.
Answer ONLY about focus, flow state, meetings, context switching, sprint planning, team activity, and uploaded documents when provided.
Use ONLY the team stats and documents provided in the user message — never invent metrics or names.

Before your visible answer, reason step-by-step inside <thinking>...</thinking> tags (brief bullet-style notes: what data you checked, what you inferred, what you will recommend).
Then write the user-facing reply inside <answer>...</answer> tags only.
Keep the answer concise: max 3 short paragraphs. Plain language. You may use **bold** and *italic* for emphasis. No markdown headers or bullet lists in the answer.
If data is missing, say what is unavailable and suggest opening the relevant dashboard section.`

export const WEEKLY_REPORT_SYSTEM_PROMPT = `You are FlowSight writing a weekly executive summary for a team lead.
Given structured team metrics as JSON, write:
1) A 2-paragraph executive summary of cognitive health and productivity this week.
2) Exactly 3 bullet recommendations for next week (start each with "• ").
Be factual, use numbers from the data. No invented metrics. Professional tone.`
