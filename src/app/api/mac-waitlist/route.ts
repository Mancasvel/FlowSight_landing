import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import MacWaitlistSubscriber from '@/models/MacWaitlistSubscriber'

export const dynamic = 'force-dynamic'

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

    const existing = await MacWaitlistSubscriber.findOne({ email: normalizedEmail })
    if (existing) {
      return NextResponse.json(
        { message: 'You are already on the macOS waitlist. We will notify you when it is ready.' },
        { status: 200 }
      )
    }

    await MacWaitlistSubscriber.create({
      email: normalizedEmail,
      source: typeof source === 'string' ? source.trim().slice(0, 60) : 'download-section',
    })

    return NextResponse.json(
      { message: 'Thanks! We will notify you when the macOS version is ready.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('mac-waitlist POST:', error)

    if (error instanceof Error && (error.message.includes('duplicate key') || (error as { code?: number }).code === 11000)) {
      return NextResponse.json(
        { message: 'You are already on the macOS waitlist. We will notify you when it is ready.' },
        { status: 200 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
