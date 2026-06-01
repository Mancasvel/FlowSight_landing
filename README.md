# FlowSight Landing Page

A modern, high-performance landing page for **FlowSight** - the privacy-first AI project manager that runs locally on your device. Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Privacy-First Architecture**: Emphasizes local on-device processing and GDPR compliance.
- **Interactive Flow**: "Zero Friction" section with animated mockups (Agent, AI, Dashboard, Privacy).
- **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop.
- **Dark & Light Modes**: Clean, professional UI with slate/navy accents.
- **Performance**: Optimized Core Web Vitals with Next.js Image and dynamic imports.

## 💜 Sponsors & Donations

FlowSight is free and privacy-first. We accept donations via [Ko-fi](https://ko-fi.com/flowsight) to fund development.

### How it works

1. A user donates on Ko-fi
2. Ko-fi sends a webhook to `/api/sponsors`
3. The sponsor appears automatically on the landing page "Our Supporters" section

### Sponsor Tiers

| Tier | Amount | Badge |
|------|--------|-------|
| ☕ Supporter | €1-4 | Purple badge |
| ☕☕ Champion | €5-14 | Gold badge |
| 💎 Founding Supporter | €15+ | Cyan badge |
| 🔄 Monthly Backer | Any recurring | Pink badge |

### Setup

#### 1. Ko-fi Webhook

Go to [ko-fi.com → Webhooks](https://ko-fi.com/manage/webhooks) and set:

- **Webhook URL**: `https://your-domain.com/api/sponsors`
- **Verification Token**: Generate one and add to `.env.local`

#### 2. Environment Variables

Add to `.env.local`:

```env
# Ko-fi webhook verification (required for production)
KOFI_WEBHOOK_TOKEN=your_random_token_here

# Supabase (optional — for persistent storage on Vercel)
# If not set, falls back to local JSON file (src/data/sponsors.json)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### 3. Supabase Table (optional, for production)

If using Supabase, create a `sponsors` table:

```sql
create table sponsors (
  id text primary key,
  name text not null,
  message text default '',
  amount numeric default 0,
  tier text default 'supporter',
  avatar text,
  url text,
  timestamp timestamptz default now()
);

-- Allow public reads
alter table sponsors enable row level security;
create policy "Public read" on sponsors for select using (true);
create policy "Service write" on sponsors for insert with check (true);
```

#### 4. Local JSON fallback

For local dev or self-hosted deployments, sponsors are stored in `src/data/sponsors.json`. No Supabase needed.

You can manually seed sponsors by editing that file:

```json
{
  "sponsors": [
    {
      "id": "manual-001",
      "name": "Your Name",
      "message": "Supporting privacy-first AI!",
      "amount": 10,
      "tier": "champion",
      "avatar": null,
      "url": "https://your-site.com",
      "timestamp": "2026-05-27T00:00:00Z"
    }
  ]
}
```

### Testing the Webhook Locally

```bash
# Simulate a Ko-fi donation webhook
curl -X POST http://localhost:3000/api/sponsors \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Donation",
    "from_name": "Test User",
    "message": "Great project!",
    "amount": "5.00",
    "kofi_transaction_id": "test-123",
    "verification_token": "your_token"
  }'
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Directory)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/sponsors/route.ts     # Ko-fi webhook + sponsors API
│   ├── features/                 # Features page
│   ├── invite/                   # Invite flow
│   ├── login/                    # Login page
│   ├── pricing/                  # Pricing page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # UI Components
│   ├── SponsorsSection.tsx       # Sponsors display + CTA
│   ├── Hero.tsx                  # Main hero with animated canvas
│   ├── FlowSection.tsx           # "Zero Friction" animated steps
│   ├── ComparisonTable.tsx       # Feature comparison
│   ├── Pricing.tsx               # Pricing tiers
│   └── ui/                       # Reusable UI elements (buttons, etc.)
├── data/
│   └── sponsors.json             # Local sponsor data (fallback)
└── lib/                          # Utilities & Supabase client
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open:** [http://localhost:3000](http://localhost:3000)

## 📦 Build & Deploy

To create a production build:
```bash
npm run build
npm start
```

## 🔐 Environment Variables

Create a `.env.local` file for local development:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Sponsors (optional)
KOFI_WEBHOOK_TOKEN=your_kofi_token
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📄 License

Proprietary software. All rights reserved.
