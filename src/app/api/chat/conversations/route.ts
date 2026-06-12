import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { assertTeamAccess } from '@/lib/coachChat/access'
import {
  createCoachConversationInDb,
  listCoachConversationsFromDb,
} from '@/lib/coachChat/server'
import { isSchemaMismatchError } from '@/lib/supabase/schemaCompat'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teamId = req.nextUrl.searchParams.get('teamId')
    if (!teamId) {
      return NextResponse.json({ error: 'teamId is required' }, { status: 400 })
    }

    if (!(await assertTeamAccess(supabase, user.id, teamId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const conversations = await listCoachConversationsFromDb(supabase, user.id, teamId)
    return NextResponse.json({ conversations })
  } catch (err) {
    if (isSchemaMismatchError(err)) {
      return NextResponse.json({ conversations: [] })
    }
    console.error('List coach conversations error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as { teamId?: string }
    const teamId = body.teamId
    if (!teamId) {
      return NextResponse.json({ error: 'teamId is required' }, { status: 400 })
    }

    if (!(await assertTeamAccess(supabase, user.id, teamId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const conversation = await createCoachConversationInDb(supabase, user.id, teamId)
    return NextResponse.json({ conversation })
  } catch (err) {
    if (isSchemaMismatchError(err)) {
      return NextResponse.json(
        { error: 'Coach chat storage is not available yet. Run the latest database migration.' },
        { status: 503 }
      )
    }
    console.error('Create coach conversation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
