import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

/* ------------------------------------------------------------------ */
/*  Storage adapter — works with Supabase (production) or JSON file   */
/*  (local dev / self-hosted). Set KOFI_WEBHOOK_TOKEN in .env.local   */
/* ------------------------------------------------------------------ */

type Sponsor = {
  id: string;
  name: string;
  message: string;
  amount: number;
  tier: 'supporter' | 'champion' | 'founding' | 'monthly';
  avatar: string | null;
  url: string | null;
  timestamp: string;
};

const TIERS: Record<string, Sponsor['tier']> = {
  '☕': 'supporter',
  '☕☕': 'champion',
  '☕☕☕': 'founding',
};

function resolveTier(amount: number, isSubscription: boolean): Sponsor['tier'] {
  if (isSubscription) return 'monthly';
  if (amount >= 15) return 'founding';
  if (amount >= 5) return 'champion';
  return 'supporter';
}

/* ---------- Supabase path (production on Vercel) ---------- */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getAllSponsors(): Promise<Sponsor[]> {
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return (data as Sponsor[]) ?? [];
  }

  // Fallback: local JSON file
  const filePath = path.join(process.cwd(), 'src', 'data', 'sponsors.json');
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw).sponsors ?? [];
  } catch {
    return [];
  }
}

async function addSponsor(sponsor: Sponsor): Promise<void> {
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('sponsors').insert(sponsor);
    if (error) throw error;
    return;
  }

  // Fallback: append to local JSON
  const filePath = path.join(process.cwd(), 'src', 'data', 'sponsors.json');
  let data: { sponsors: Sponsor[] };
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    data = { sponsors: [] };
  }
  data.sponsors.push(sponsor);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/* ---------- API Handlers ---------- */

// GET /api/sponsors — public, returns all sponsors
export async function GET() {
  try {
    const sponsors = await getAllSponsors();
    return NextResponse.json({ sponsors });
  } catch (err) {
    console.error('[sponsors] GET error:', err);
    return NextResponse.json({ sponsors: [], error: 'Failed to load sponsors' }, { status: 500 });
  }
}

// POST /api/sponsors — Ko-fi webhook receiver
// Ko-fi sends: type, from_name, message, amount, currency, url, email, is_subscription, etc.
// Also sends verification_token to validate the request.
export async function POST(request: NextRequest) {
  try {
    // Ko-fi sends data as form-urlencoded with a `data` field containing JSON
    const contentType = request.headers.get('content-type') || '';
    let body: Record<string, unknown>;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      const raw = formData.get('data') as string;
      body = JSON.parse(raw);
    } else {
      body = await request.json();
    }

    // Validate webhook token (set KOFI_WEBHOOK_TOKEN in .env.local)
    const expectedToken = process.env.KOFI_WEBHOOK_TOKEN;
    if (expectedToken && body.verification_token !== expectedToken) {
      console.warn('[sponsors] Invalid webhook token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only process donations and subscriptions
    const type = body.type as string;
    if (type !== 'Donation' && type !== 'Subscription') {
      return NextResponse.json({ status: 'ignored', type });
    }

    const amount = parseFloat(body.amount as string) || 0;
    const isSubscription = type === 'Subscription' || body.is_subscription === 'true';

    const sponsor: Sponsor = {
      id: `kofi-${(body.kofi_transaction_id as string) || Date.now()}`,
      name: (body.from_name as string) || 'Anonymous',
      message: (body.message as string) || '',
      amount,
      tier: resolveTier(amount, isSubscription),
      avatar: null,
      url: null,
      timestamp: new Date().toISOString(),
    };

    await addSponsor(sponsor);
    console.log(`[sponsors] New sponsor: ${sponsor.name} (€${sponsor.amount}, ${sponsor.tier})`);

    return NextResponse.json({ status: 'ok', sponsor });
  } catch (err) {
    console.error('[sponsors] POST error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
