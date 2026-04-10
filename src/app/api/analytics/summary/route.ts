import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ClickCounter from '@/models/ClickCounter'

export const dynamic = 'force-dynamic'

/**
 * Returns aggregated click counts. Protect with ANALYTICS_READ_SECRET (Bearer token).
 */
export async function GET(request: NextRequest) {
  const secret = process.env.ANALYTICS_READ_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'ANALYTICS_READ_SECRET is not configured on the server' },
      { status: 503 }
    )
  }

  const auth = request.headers.get('authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }

  try {
    const docs = await ClickCounter.find({}).lean().exec()
    const byKey: Record<string, number> = {}
    for (const d of docs) {
      byKey[d.key] = d.count
    }
    return NextResponse.json({
      totalClicks: byKey.global ?? 0,
      byKey,
      updatedAt: new Date().toISOString(),
    })
  } catch (e) {
    console.error('analytics/summary GET:', e)
    return NextResponse.json({ error: 'Failed to load summary' }, { status: 500 })
  }
}
