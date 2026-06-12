import { NextRequest, NextResponse } from 'next/server'
import { guardCoachApi, coachSecurityErrorResponse } from '@/lib/api/guardCoachApi'
import {
  deleteCoachConversationFromDb,
  getCoachConversationFromDb,
  replaceCoachConversationMessages,
  updateCoachConversationTitleInDb,
} from '@/lib/coachChat/server'
import { isSchemaMismatchError } from '@/lib/supabase/schemaCompat'
import type { CoachChatMessage } from '@/lib/coachChat/types'

export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const teamId = req.nextUrl.searchParams.get('teamId') ?? ''
    const { supabase, user } = await guardCoachApi(req, { teamId, rateScope: 'api' })

    const conversation = await getCoachConversationFromDb(supabase, user.id, teamId, id)
    if (!conversation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ conversation })
  } catch (err) {
    const security = coachSecurityErrorResponse(err)
    if (security) return security
    console.error('Get coach conversation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = (await req.json()) as {
      teamId?: string
      messages?: CoachChatMessage[]
      title?: string
    }

    const teamId = body.teamId ?? ''
    const { supabase, user } = await guardCoachApi(req, { teamId, rateScope: 'api' })

    if (typeof body.title === 'string') {
      const conversation = await updateCoachConversationTitleInDb(
        supabase,
        user.id,
        teamId,
        id,
        body.title
      )
      if (!conversation) {
        return NextResponse.json({ error: 'Not found or invalid title' }, { status: 404 })
      }
      return NextResponse.json({ conversation })
    }

    if (!Array.isArray(body.messages)) {
      return NextResponse.json({ error: 'messages array or title is required' }, { status: 400 })
    }

    const conversation = await replaceCoachConversationMessages(
      supabase,
      user.id,
      teamId,
      id,
      body.messages
    )

    if (!conversation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

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
    console.error('Sync coach conversation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const teamId = req.nextUrl.searchParams.get('teamId') ?? ''
    const { supabase, user } = await guardCoachApi(req, { teamId, rateScope: 'api' })

    const deleted = await deleteCoachConversationFromDb(supabase, user.id, teamId, id)
    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const security = coachSecurityErrorResponse(err)
    if (security) return security
    if (isSchemaMismatchError(err)) {
      return NextResponse.json(
        { error: 'Coach chat storage is not available yet. Run the latest database migration.' },
        { status: 503 }
      )
    }
    console.error('Delete coach conversation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
