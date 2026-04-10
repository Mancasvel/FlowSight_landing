import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ClickCounter from '@/models/ClickCounter'

export const dynamic = 'force-dynamic'

const MAX_KEY_LEN = 120

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
  } catch {
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 })
  }

  try {
    let key: string | undefined
    try {
      const body = await request.json()
      if (typeof body?.key === 'string' && body.key.length <= MAX_KEY_LEN) {
        key = body.key.trim() || undefined
      }
    } catch {
      // empty body is fine
    }

    await ClickCounter.updateOne({ key: 'global' }, { $inc: { count: 1 } }, { upsert: true })

    if (key && key !== 'global') {
      await ClickCounter.updateOne({ key }, { $inc: { count: 1 } }, { upsert: true })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('analytics/click POST:', e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
