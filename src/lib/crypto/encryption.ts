import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const TAG_LENGTH = 16
const PREFIX = 'enc:v1:'

function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY
  if (raw) {
    const key = Buffer.from(raw, 'base64')
    if (key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must decode to exactly 32 bytes (base64)')
    }
    return key
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ENCRYPTION_KEY is required in production')
  }
  return scryptSync('flowsight-dev-encryption', 'flowsight-salt-v1', 32)
}

/** AES-256-GCM encrypt. Output: enc:v1:<iv>:<tag>:<ciphertext> (all base64). */
export function encrypt(plaintext: string): string {
  if (!plaintext) return ''
  const key = getKey()
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH })
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${PREFIX}${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`
}

/** Decrypt a value produced by {@link encrypt}. Returns plaintext or throws on tamper. */
export function decrypt(ciphertext: string): string {
  if (!ciphertext) return ''
  if (!ciphertext.startsWith(PREFIX)) {
    throw new Error('Invalid encrypted payload: missing version prefix')
  }
  const parts = ciphertext.slice(PREFIX.length).split(':')
  if (parts.length !== 3) throw new Error('Invalid encrypted payload format')

  const [ivB64, tagB64, dataB64] = parts
  const key = getKey()
  const iv = Buffer.from(ivB64, 'base64')
  const tag = Buffer.from(tagB64, 'base64')
  const data = Buffer.from(dataB64, 'base64')

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH })
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
}

export function isEncrypted(value: string): boolean {
  return value.startsWith(PREFIX)
}

/** Encrypt a JSON-serializable value. */
export function encryptJson<T>(value: T): string {
  return encrypt(JSON.stringify(value))
}

/** Decrypt JSON encrypted with {@link encryptJson}. */
export function decryptJson<T>(ciphertext: string): T {
  return JSON.parse(decrypt(ciphertext)) as T
}

/** Encrypt an array of email addresses for storage at rest. */
export function encryptEmails(emails: string[]): string {
  const normalized = emails.map((e) => e.trim().toLowerCase()).filter(Boolean)
  return encryptJson(normalized)
}

/** Decrypt stored email list. */
export function decryptEmails(ciphertext: string | null | undefined): string[] {
  if (!ciphertext) return []
  try {
    return decryptJson<string[]>(ciphertext)
  } catch {
    return []
  }
}
