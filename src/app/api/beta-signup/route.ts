import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import BetaUser from '@/models/BetaUser'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { name, email } = await request.json()

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await BetaUser.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered for beta access' },
        { status: 409 }
      )
    }

    // Create new beta user
    const betaUser = await BetaUser.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
    })

    console.log('Beta user created successfully:', betaUser.email)

    return NextResponse.json(
      {
        message: 'Successfully signed up for beta access!',
        user: {
          id: betaUser._id,
          name: betaUser.name,
          email: betaUser.email,
          createdAt: betaUser.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Beta signup error:', error)

    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid data provided' },
        { status: 400 }
      )
    }

    // Handle duplicate key errors (MongoDB error code 11000)
    if (error instanceof Error && (error.message.includes('duplicate key') || (error as any).code === 11000)) {
      return NextResponse.json(
        { error: 'Email already registered for beta access' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
