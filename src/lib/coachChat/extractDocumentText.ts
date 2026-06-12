const MAX_EXTRACT_CHARS = 24_000

const TEXT_EXTENSIONS = new Set(['txt', 'md', 'markdown', 'csv', 'json', 'log', 'html', 'htm'])

export type ExtractedDocument = {
  fileName: string
  mimeType: string
  text: string
  truncated: boolean
}

function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  return dot >= 0 ? fileName.slice(dot + 1).toLowerCase() : ''
}

function truncateText(text: string): { text: string; truncated: boolean } {
  if (text.length <= MAX_EXTRACT_CHARS) return { text, truncated: false }
  return {
    text: `${text.slice(0, MAX_EXTRACT_CHARS)}\n\n[…document truncated for context length]`,
    truncated: true,
  }
}

export function isSupportedCoachDocument(fileName: string, mimeType: string): boolean {
  const ext = extensionOf(fileName)
  if (TEXT_EXTENSIONS.has(ext)) return true
  if (mimeType.startsWith('text/')) return true
  if (mimeType === 'application/json' || mimeType === 'application/csv') return true
  return ext === 'pdf' || mimeType === 'application/pdf'
}

export async function extractDocumentText(
  fileName: string,
  mimeType: string,
  buffer: Buffer
): Promise<ExtractedDocument> {
  const ext = extensionOf(fileName)

  if (ext === 'pdf' || mimeType === 'application/pdf') {
    const { extractText, getDocumentProxy } = await import('unpdf')
    const pdf = await getDocumentProxy(new Uint8Array(buffer))
    const { text } = await extractText(pdf, { mergePages: true })
    const joined = Array.isArray(text) ? text.join('\n\n') : String(text ?? '')
    const { text: clipped, truncated } = truncateText(joined.trim())
    return { fileName, mimeType: mimeType || 'application/pdf', text: clipped, truncated }
  }

  if (!isSupportedCoachDocument(fileName, mimeType)) {
    throw new Error('Unsupported file type. Use TXT, MD, CSV, JSON, or PDF.')
  }

  const raw = buffer.toString('utf-8').replace(/\u0000/g, '').trim()
  if (!raw) throw new Error('Document appears empty or unreadable.')

  const { text, truncated } = truncateText(raw)
  return { fileName, mimeType: mimeType || 'text/plain', text, truncated }
}
