import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { assertTeamAccess } from '@/lib/coachChat/access'
import {
  createCoachConversationInDb,
  getCoachConversationFromDb,
} from '@/lib/coachChat/server'
import {
  deleteCoachContextSource,
  indexCoachDocumentVectors,
  listCoachContextSources,
} from '@/lib/coachChat/contextVectorServer'
import { extractDocumentText, isSupportedCoachDocument } from '@/lib/coachChat/extractDocumentText'
import { MAX_COACH_FILE_BYTES, MAX_COACH_FILE_LABEL } from '@/lib/coachChat/limits'
import { isSchemaMismatchError } from '@/lib/supabase/schemaCompat'

export const dynamic = 'force-dynamic'
const SESSION_TEXT_MAX = 24_000

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const teamId = req.nextUrl.searchParams.get('teamId')
    const conversationId = req.nextUrl.searchParams.get('conversationId')
    if (!teamId || !conversationId) {
      return NextResponse.json({ error: 'teamId and conversationId are required' }, { status: 400 })
    }

    if (!(await assertTeamAccess(supabase, user.id, teamId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const sources = await listCoachContextSources(supabase, user.id, teamId, conversationId)
    return NextResponse.json({ sources, vectorIndexReady: true })
  } catch (err) {
    if (isSchemaMismatchError(err)) {
      return NextResponse.json({ sources: [], vectorIndexReady: false })
    }
    console.error('Coach context sources list error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const form = await req.formData()
    const teamId = String(form.get('teamId') ?? '')
    let conversationId = String(form.get('conversationId') ?? '')
    const file = form.get('file')

    if (!teamId) return NextResponse.json({ error: 'teamId is required' }, { status: 400 })
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 })
    }

    if (!(await assertTeamAccess(supabase, user.id, teamId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (file.size > MAX_COACH_FILE_BYTES) {
      return NextResponse.json(
        { error: `File must be ${MAX_COACH_FILE_LABEL} or smaller.` },
        { status: 400 }
      )
    }

    if (!isSupportedCoachDocument(file.name, file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use TXT, MD, CSV, JSON, or PDF.' },
        { status: 400 }
      )
    }

    let conversation =
      conversationId
        ? await getCoachConversationFromDb(supabase, user.id, teamId, conversationId)
        : null

    if (!conversation) {
      conversation = await createCoachConversationInDb(supabase, user.id, teamId)
      conversationId = conversation.id
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const extracted = await extractDocumentText(file.name, file.type, buffer)
    const sessionText = extracted.text.slice(0, SESSION_TEXT_MAX)

    try {
      const source = await indexCoachDocumentVectors(
        supabase,
        user.id,
        teamId,
        conversationId,
        extracted.fileName,
        extracted.text
      )

      return NextResponse.json({
        source,
        conversationId,
        indexed: true,
        vectorIndexReady: true,
        preview: sessionText.slice(0, 200),
      })
    } catch (indexErr) {
      const schemaMissing = isSchemaMismatchError(indexErr)
      const embeddingIssue =
        indexErr instanceof Error &&
        (indexErr.message.includes('embeddings') ||
          indexErr.message.includes('EMBEDDING') ||
          indexErr.message.includes('deployment'))

      if (schemaMissing || embeddingIssue) {
        return NextResponse.json({
          conversationId,
          indexed: false,
          vectorIndexReady: false,
          fileName: extracted.fileName,
          sessionText,
          preview: sessionText.slice(0, 200),
          notice: schemaMissing
            ? 'Vector index not ready — using this document for the current session only.'
            : 'Embeddings unavailable — using this document for the current session only.',
        })
      }

      const message = indexErr instanceof Error ? indexErr.message : 'Upload failed'
      console.error('Coach vector index error:', indexErr)
      return NextResponse.json({ error: message }, { status: 400 })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    console.error('Coach document upload error:', err)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const sourceId = req.nextUrl.searchParams.get('id')
    const teamId = req.nextUrl.searchParams.get('teamId')
    if (!sourceId || !teamId) {
      return NextResponse.json({ error: 'id and teamId are required' }, { status: 400 })
    }

    if (!(await assertTeamAccess(supabase, user.id, teamId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await deleteCoachContextSource(supabase, user.id, teamId, sourceId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (isSchemaMismatchError(err)) {
      return NextResponse.json({ ok: true })
    }
    console.error('Coach context delete error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
