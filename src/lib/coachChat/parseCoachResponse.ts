export type ParsedCoachResponse = {
  answer: string
  reasoning: string | null
}

/**
 * Mistral-Large-3 is an instruct model (no native reasoning tokens).
 * We ask the model to wrap private reasoning in <thinking> tags and parse it here.
 */
export function parseCoachResponse(raw: string): ParsedCoachResponse {
  const trimmed = raw.trim()
  if (!trimmed) return { answer: '', reasoning: null }

  const thinkingMatch = trimmed.match(/<thinking>([\s\S]*?)<\/thinking>/i)
  const answerMatch = trimmed.match(/<answer>([\s\S]*?)<\/answer>/i)

  if (thinkingMatch || answerMatch) {
    const reasoning = thinkingMatch?.[1]?.trim() || null
    const answer = answerMatch?.[1]?.trim() || stripThinkingTags(trimmed)
    return { answer: answer || trimmed, reasoning }
  }

  return { answer: trimmed, reasoning: null }
}

function stripThinkingTags(text: string): string {
  return text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').replace(/<\/?answer>/gi, '').trim()
}
