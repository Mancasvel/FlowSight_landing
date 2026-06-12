import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { assertTeamAccess } from '@/lib/coachChat/access'
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

    const conversation = await getCoachConversationFromDb(supabase, user.id, teamId, id)
    if (!conversation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ conversation })
  } catch (err) {
    console.error('Get coach conversation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as {
      teamId?: string
      messages?: CoachChatMessage[]
      title?: string
    }

    const teamId = body.teamId

    if (!teamId) {
      return NextResponse.json({ error: 'teamId is required' }, { status: 400 })
    }

    if (!(await assertTeamAccess(supabase, user.id, teamId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

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

    const deleted = await deleteCoachConversationFromDb(supabase, user.id, teamId, id)
    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
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
