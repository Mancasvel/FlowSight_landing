import { NextRequest, NextResponse } from 'next/server'
import { guardCoachApi, coachSecurityErrorResponse } from '@/lib/api/guardCoachApi'
import {
  createCoachConversationInDb,
  listCoachConversationsFromDb,
} from '@/lib/coachChat/server'
import { isSchemaMismatchError } from '@/lib/supabase/schemaCompat'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const teamId = req.nextUrl.searchParams.get('teamId') ?? ''
    const { supabase, user } = await guardCoachApi(req, { teamId, rateScope: 'api' })
    const conversations = await listCoachConversationsFromDb(supabase, user.id, teamId)
    return NextResponse.json({ conversations })
  } catch (err) {
    const security = coachSecurityErrorResponse(err)
    if (security) return security
    if (isSchemaMismatchError(err)) {
      return NextResponse.json({ conversations: [] })
    }
    console.error('List coach conversations error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { teamId?: string }
    const teamId = body.teamId ?? ''
    const { supabase, user } = await guardCoachApi(req, { teamId, rateScope: 'api' })
    const conversation = await createCoachConversationInDb(supabase, user.id, teamId)
    return NextResponse.json({ conversation })
  } catch (err) {
    const security = coachSecurityErrorResponse(err)
    if (security) return security
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
