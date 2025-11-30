import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import NewsletterSubscriber from '@/models/NewsletterSubscriber'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { email } = await request.json()

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existingSubscriber = await NewsletterSubscriber.findOne({ 
      email: email.toLowerCase().trim() 
    })
    
    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      )
    }

    // Create new subscriber
    const subscriber = await NewsletterSubscriber.create({
      email: email.toLowerCase().trim(),
    })

    console.log('Newsletter subscriber added:', subscriber.email)

    return NextResponse.json(
      {
        message: 'Successfully subscribed to newsletter!',
        subscriber: {
          id: subscriber._id,
          email: subscriber.email,
          subscribedAt: subscriber.subscribedAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)

    // Handle duplicate key errors (MongoDB error code 11000)
    if (error instanceof Error && (error.message.includes('duplicate key') || (error as any).code === 11000)) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

