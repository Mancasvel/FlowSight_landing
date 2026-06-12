import type { NextRequest } from 'next/server'
import { COACH_CLIENT_HEADER, COACH_CLIENT_VALUE } from '@/lib/coachChat/coachApiClient'

export class CoachApiSecurityError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'CoachApiSecurityError'
    this.status = status
  }
}

function normalizeOrigin(value: string): string {
  return value.replace(/\/$/, '')
}

export function getAllowedCoachOrigins(): string[] {
  const fromEnv = process.env.COACH_API_ALLOWED_ORIGINS
  const origins = new Set<string>()

  if (fromEnv) {
    for (const part of fromEnv.split(',')) {
      const trimmed = part.trim()
      if (trimmed) origins.add(normalizeOrigin(trimmed))
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (appUrl) origins.add(normalizeOrigin(appUrl))

  const vercel = process.env.VERCEL_URL
  if (vercel) {
    origins.add(normalizeOrigin(`https://${vercel}`))
  }

  if (process.env.NODE_ENV === 'development') {
    origins.add('http://localhost:3000')
    origins.add('http://127.0.0.1:3000')
  }

  return Array.from(origins)
}

/** Reject cross-site scripted requests; allow same-origin dashboard fetches only. */
export function assertCoachBrowserRequest(req: NextRequest): void {
  if (process.env.COACH_API_SKIP_ORIGIN_CHECK === 'true') return

  const secFetchSite = req.headers.get('sec-fetch-site')
  if (secFetchSite === 'same-origin' || secFetchSite === 'same-site') return

  const allowed = getAllowedCoachOrigins()
  const origin = req.headers.get('origin')
  if (origin && allowed.some((o) => normalizeOrigin(origin) === o)) return

  const referer = req.headers.get('referer')
  if (referer && allowed.some((o) => referer.startsWith(o))) return

  throw new CoachApiSecurityError(
    'Cross-origin coach API requests are not allowed.',
    403
  )
}

export function assertCoachClientHeader(req: NextRequest): void {
  if (process.env.COACH_API_SKIP_CLIENT_HEADER === 'true') return
  const value = req.headers.get(COACH_CLIENT_HEADER)
  if (value !== COACH_CLIENT_VALUE) {
    throw new CoachApiSecurityError('Invalid client.', 403)
  }
}

type RateBucket = { count: number; resetAt: number }

const rateBuckets = new Map<string, RateBucket>()

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now()
  const bucket = rateBuckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSec: 0 }
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    }
  }

  bucket.count += 1
  return { allowed: true, retryAfterSec: 0 }
}

export function assertCoachRateLimit(
  req: NextRequest,
  userId: string,
  scope: 'chat' | 'upload' | 'api'
): void {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  const limits: Record<typeof scope, { perUser: number; perIp: number; windowMs: number }> = {
    chat: { perUser: 12, perIp: 40, windowMs: 60_000 },
    upload: { perUser: 6, perIp: 20, windowMs: 60_000 },
    api: { perUser: 120, perIp: 300, windowMs: 60_000 },
  }

  const { perUser, perIp, windowMs } = limits[scope]

  const userCheck = checkRateLimit(`${scope}:user:${userId}`, perUser, windowMs)
  if (!userCheck.allowed) {
    throw new CoachApiSecurityError(
      `Too many requests. Try again in ${userCheck.retryAfterSec}s.`,
      429
    )
  }

  const ipCheck = checkRateLimit(`${scope}:ip:${ip}`, perIp, windowMs)
  if (!ipCheck.allowed) {
    throw new CoachApiSecurityError(
      `Too many requests from this network. Try again in ${ipCheck.retryAfterSec}s.`,
      429
    )
  }
}

export async function verifyTurnstileToken(
  token: string | undefined,
  req: NextRequest
): Promise<void> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return

  if (!token?.trim()) {
    throw new CoachApiSecurityError('Bot verification required.', 403)
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    undefined

  const body = new URLSearchParams({
    secret,
    response: token.trim(),
  })
  if (ip) body.set('remoteip', ip)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  const data = (await res.json()) as { success?: boolean }
  if (!data.success) {
    throw new CoachApiSecurityError('Bot verification failed.', 403)
  }
}
