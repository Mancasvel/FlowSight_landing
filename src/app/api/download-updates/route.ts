import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import DownloadUpdateSubscriber from '@/models/DownloadUpdateSubscriber'

export const dynamic = 'force-dynamic'

const VALID_SOURCES = new Set(['download-windows', 'download-linux-deb', 'download-linux-appimage'])

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }

  try {
    const { email, source } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const normalizedSource =
      typeof source === 'string' && VALID_SOURCES.has(source) ? source : 'download-windows'

    const existing = await DownloadUpdateSubscriber.findOne({ email: normalizedEmail })
    if (existing) {
      return NextResponse.json(
        { message: 'You are already subscribed to FlowSight updates.' },
        { status: 200 }
      )
    }

    await DownloadUpdateSubscriber.create({
      email: normalizedEmail,
      source: normalizedSource,
    })

    return NextResponse.json(
      { message: 'Thanks! We will keep you posted on FlowSight updates.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('download-updates POST:', error)

    if (error instanceof Error && (error.message.includes('duplicate key') || (error as { code?: number }).code === 11000)) {
      return NextResponse.json(
        { message: 'You are already subscribed to FlowSight updates.' },
        { status: 200 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
