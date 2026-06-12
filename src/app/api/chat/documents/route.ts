import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { assertTeamAccess } from '@/lib/coachChat/access'
import {
  createCoachConversationInDb,
  getCoachConversationFromDb,
} from '@/lib/coachChat/server'
import {
  deleteCoachDocument,
  insertCoachDocument,
  listCoachDocuments,
} from '@/lib/coachChat/documentServer'
import { extractDocumentText, isSupportedCoachDocument } from '@/lib/coachChat/extractDocumentText'
import { isSchemaMismatchError } from '@/lib/supabase/schemaCompat'

export const dynamic = 'force-dynamic'

const MAX_FILE_BYTES = 2 * 1024 * 1024

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

    const documents = await listCoachDocuments(supabase, user.id, teamId, conversationId)
    return NextResponse.json({ documents })
  } catch (err) {
    if (isSchemaMismatchError(err)) {
      return NextResponse.json({ documents: [], storageReady: false })
    }
    console.error('Coach documents list error:', err)
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

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: 'File must be 2 MB or smaller.' }, { status: 400 })
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

    const document = await insertCoachDocument(
      supabase,
      user.id,
      teamId,
      conversationId,
      extracted.fileName,
      extracted.mimeType,
      extracted.text,
      extracted.truncated
    )

    return NextResponse.json({
      document,
      conversationId,
      preview: extracted.text.slice(0, 280),
      storageReady: true,
    })
  } catch (err) {
    if (isSchemaMismatchError(err)) {
      return NextResponse.json(
        {
          error: 'Document storage is not available yet. Run the latest database migration.',
          storageReady: false,
        },
        { status: 503 }
      )
    }

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

    const documentId = req.nextUrl.searchParams.get('id')
    const teamId = req.nextUrl.searchParams.get('teamId')
    if (!documentId || !teamId) {
      return NextResponse.json({ error: 'id and teamId are required' }, { status: 400 })
    }

    if (!(await assertTeamAccess(supabase, user.id, teamId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await deleteCoachDocument(supabase, user.id, teamId, documentId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (isSchemaMismatchError(err)) {
      return NextResponse.json({ error: 'Document storage not available.' }, { status: 503 })
    }
    console.error('Coach document delete error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
