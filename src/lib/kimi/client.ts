const DEFAULT_BASE = 'https://api.moonshot.ai/v1'

export type KimiMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type KimiChatOptions = {
  system: string
  messages: KimiMessage[]
  maxTokens?: number
  temperature?: number
}

export async function kimiChat(options: KimiChatOptions): Promise<string> {
  const apiKey = process.env.MOONSHOT_API_KEY ?? process.env.KIMI_API_KEY
  if (!apiKey) {
    throw new Error('MOONSHOT_API_KEY (or KIMI_API_KEY) is not configured')
  }

  const base = (process.env.MOONSHOT_API_BASE ?? DEFAULT_BASE).replace(/\/$/, '')
  const model = process.env.MOONSHOT_MODEL ?? 'moonshot-v1-8k'

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
      model,
      messages,
      max_tokens: options.maxTokens ?? 700,
      temperature: options.temperature ?? 0.35,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Kimi API error ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }

  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error('Kimi returned an empty response')
  return content
}

export const COACH_SYSTEM_PROMPT = `You are FlowSight, a privacy-first team cognitive health coach.
Answer ONLY about focus, flow state, meetings, context switching, sprint planning, and team activity.
Use ONLY the team stats provided in the user message — never invent metrics or names.
Be concise: max 3 short paragraphs. Use plain language. No markdown headers.
If data is missing, say what is unavailable and suggest opening the relevant dashboard section.`

export const WEEKLY_REPORT_SYSTEM_PROMPT = `You are FlowSight writing a weekly executive summary for a team lead.
Given structured team metrics as JSON, write:
1) A 2-paragraph executive summary of cognitive health and productivity this week.
2) Exactly 3 bullet recommendations for next week (start each with "• ").
Be factual, use numbers from the data. No invented metrics. Professional tone.`
