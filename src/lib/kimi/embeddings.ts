const DEFAULT_AZURE_ENDPOINT = 'https://france-flow.services.ai.azure.com/openai/v1'
const DEFAULT_EMBEDDING_DEPLOYMENT = 'text-embedding-3-small'

export const EMBEDDING_DIMENSIONS = 1536

export class EmbeddingConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EmbeddingConfigError'
  }
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return []

  const apiKey = process.env.AZURE_OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('AZURE_OPENAI_API_KEY is not configured')
  }

  const base = (process.env.AZURE_OPENAI_ENDPOINT ?? DEFAULT_AZURE_ENDPOINT).replace(/\/$/, '')
  const model =
    process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT ??
    process.env.AZURE_OPENAI_EMBEDDING_MODEL ??
    DEFAULT_EMBEDDING_DEPLOYMENT

  const res = await fetch(`${base}/embeddings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: texts,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    const isConfig =
      res.status === 400 &&
      (body.includes('unavailable_model') || body.includes('DeploymentNotFound'))
    const hint = isConfig
      ? ` Set AZURE_OPENAI_EMBEDDING_DEPLOYMENT to your Azure deployment name (not the model id). Deploy text-embedding-3-small in Azure AI Foundry first.`
      : ''
    throw new EmbeddingConfigError(
      `Azure OpenAI embeddings error ${res.status}: ${body.slice(0, 200)}.${hint}`
    )
  }

  const data = (await res.json()) as {
    data?: { embedding?: number[]; index?: number }[]
  }

  const rows = [...(data.data ?? [])].sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
  const vectors = rows.map((row) => row.embedding).filter((v): v is number[] => Array.isArray(v))

  if (vectors.length !== texts.length) {
    throw new Error('Azure OpenAI returned an unexpected embeddings payload')
  }

  return vectors
}

export function embeddingToPgVector(values: number[]): string {
  return `[${values.join(',')}]`
}
