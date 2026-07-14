import type { PlanId } from '@/lib/plans'
import { getStripePriceId } from '@/lib/plans'

const PLACEHOLDER_PRICE_IDS = new Set([
  'price_individual_pro',
  'price_teams_simple',
  'price_teams_pro',
  'price_enterprise',
  'price_basic',
  'price_pro',
  'price_123456789',
])

export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function getRequiredStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }

  if (isProductionRuntime() && key.startsWith('sk_test_')) {
    throw new Error('STRIPE_SECRET_KEY must be a live key (sk_live_) in production')
  }

  return key
}

export function isPlaceholderStripePriceId(priceId: string | null | undefined): boolean {
  if (!priceId) return true
  const trimmed = priceId.trim()
  if (!trimmed || trimmed === 'price_') return true
  return PLACEHOLDER_PRICE_IDS.has(trimmed)
}

export function isConfiguredStripePriceId(priceId: string | null | undefined): boolean {
  if (!priceId) return false
  return priceId.startsWith('price_') && !isPlaceholderStripePriceId(priceId)
}

/** Server-side source of truth: never trust client-sent price IDs in production. */
export function resolveCheckoutPriceId(planId: PlanId): string | null {
  const priceId = getStripePriceId(planId)
  if (!isConfiguredStripePriceId(priceId)) return null
  return priceId ?? null
}
