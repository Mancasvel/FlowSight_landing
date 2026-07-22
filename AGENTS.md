# FlowSight Landing — Agent Guide

## Commands

```bash
pnpm dev       # Next.js dev server (Turbopack)
pnpm build     # Production build
pnpm start     # Start production server
pnpm lint      # ESLint flat config (eslint.config.mjs) — max-warnings 100
```

- **Package manager**: `pnpm` only (engine-strict). Lockfile: `pnpm-lock.yaml`.
- **Node**: `>=20.9.0 <23`, pnpm `>=10.33.4 <11`.
- **No test framework** is configured — no test runner, no test scripts.

## Architecture

- Next.js 16 App Router at `src/app/`. `/dashboard/*`, `/account/*`, and `/api/chat/*` are **auth-protected** by Supabase SSR middleware (`src/middleware.ts`). All other routes are public marketing pages.
- Path alias `@/*` → `./src/*`.
- Dependencies use `~` semver range (patch-level only), enforced by `.npmrc`.
- MongoDB/Mongoose are `serverExternalPackages` (not bundled for client).

## Key Integrations

| Service | Purpose |
|---|---|
| Supabase | Auth, storage (SSR via `@supabase/ssr`) |
| Stripe | Payments, licenses (live mode in .env.local.example) |
| MongoDB/Mongoose | Landing analytics, newsletter, waitlist |
| Resend | Weekly report emails (AI Coach) |
| Azure OpenAI (Mistral-Large-3) | AI Coach chat |
| Cloudflare Turnstile | Coach API bot protection |
| Ko-fi webhook | Sponsor/donation display (`/api/sponsors`) |

## Env Setup

Copy `.env.local.example` → `.env.local`. For local dev, use **staging/clone** Supabase credentials (not production). See extensive comments in the example file for every key — especially Supabase, Stripe live price IDs, and cron secrets.

## Vercel Crons

Defined in `vercel.json` — not runnable locally:
- `GET /api/cron/check-expiration` — daily 3am
- `GET /api/cron/weekly-reports` — weekly Monday 1am
Crons send `Authorization: Bearer <CRON_SECRET>`.

## Linting

ESLint flat config (`eslint.config.mjs`) extends `eslint-config-next/core-web-vitals`. Some hooks rules are explicitly disabled. `react/no-unescaped-entities` and `@next/next/no-img-element` are warn-level only. Ignored: `node_modules`, `.next`, `out`, `public`, `next-env.d.ts`.
