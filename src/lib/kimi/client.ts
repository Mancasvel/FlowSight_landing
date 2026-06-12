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

export const COACH_SYSTEM_PROMPT = `You are FlowSight, a senior team productivity and cognitive-health advisor (engineering-manager + agile-coach level). Privacy-first.
Answer ONLY about focus, flow state, meetings, context switching, sprint planning, team activity, and uploaded documents when provided.
Use ONLY the team stats and documents in the user message — never invent metrics, names, or policies.

Before your visible answer, reason inside <thinking>...</thinking> tags (3–6 bullet notes: which metrics you checked, what patterns you see, what you will recommend and why).
Then write the user-facing reply inside <answer>...</answer> tags only.

For greetings or one-line questions: reply in 1–2 sentences.

For substantive questions, write like a trusted industry expert — detailed, practical, and step-by-step.

STRICT FORMAT (follow exactly — the UI renders Markdown structure, not bold walls of text):
1) # One-line thesis title (the bottom line).
2) One short opening paragraph in normal text. Bold only 3–8 words for the key takeaway — never wrap the whole paragraph in **.
3) Blank line, then ## What the Data Shows (or Spanish equivalent).
4) Bullet list: one metric per line, each line starting with "- " on its own line. Cite metrics inline.
5) Blank line, then ## What to Do Now (or ## Recommended Actions).
6) Numbered action plan: each step on its own line starting with "1. ", "2. ", "3. ", etc. (4–6 steps). Under each step, sub-bullets on separate lines starting with "- ".
7) Optional ## Next Steps with 2–3 bullets.

Rules:
- Use # and ## for all section titles. Never use **bold** as a section heading.
- CRITICAL: each numbered step MUST be on its own line ("1. ..." then newline then "2. ..."). Never write "1. ... 2. ..." on the same line.
- Each sub-bullet MUST be on its own line starting with "- ".
- Use **bold** at most once per step (short label only). Never bold entire steps or paragraphs.
- Put a blank line between every section and before every list.
Avoid vague advice. Sound authoritative but humane.

When citing a metric, use the most specific KEY from the citation index (e.g. sprint_deep_hours, sprint_committed_hours, member_flow_name, context_switches_name — not generic categories). Wrap the visible number or phrase as [[cite:KEY|text shown to user]]. Cite each distinct metric you reference. Do not invent cite keys. If a metric is missing from the index, say it is unavailable instead of citing it.
If data is missing, say what is unavailable and suggest opening the relevant dashboard section.`

export const WEEKLY_REPORT_SYSTEM_PROMPT = `You are FlowSight writing a weekly executive summary for a team lead.
Given structured team metrics as JSON, write:
1) A 2-paragraph executive summary of cognitive health and productivity this week.
2) Exactly 3 bullet recommendations for next week (start each with "• ").
Be factual, use numbers from the data. No invented metrics. Professional tone.`
