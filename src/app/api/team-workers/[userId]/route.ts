import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

type WorkerParams = {
    params: Promise<{
        userId: string;
    }>;
};

type UpdateWorkerPayload = {
    teamId?: string;
    displayName?: string;
    email?: string;
    password?: string;
};

function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

async function requireOwnedWorker(teamId: string, workerId: string, ownerId: string) {
    const supabase = await createClient();

    const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('id', teamId)
        .eq('owner_id', ownerId)
        .eq('is_active', true)
        .single();

    if (teamError || !team) {
        return { error: NextResponse.json({ error: 'Team not found or unauthorized.' }, { status: 403 }) };
    }

    const { data: member, error: memberError } = await supabase
        .from('team_members')
        .select('id, role')
        .eq('team_id', teamId)
        .eq('user_id', workerId)
        .single();

    if (memberError || !member) {
        return { error: NextResponse.json({ error: 'Worker is not part of this team.' }, { status: 404 }) };
    }

    if (member.role === 'admin') {
        return { error: NextResponse.json({ error: 'Team admins cannot be managed as workers.' }, { status: 403 }) };
    }

    return { member };
}

export async function PATCH(request: Request, { params }: WorkerParams) {
    const { userId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = (await request.json()) as UpdateWorkerPayload;
    const teamId = body.teamId?.trim();

    if (!teamId) {
        return NextResponse.json({ error: 'Team is required.' }, { status: 400 });
    }

    const access = await requireOwnedWorker(teamId, userId, user.id);
    if (access.error) return access.error;

    const displayName = body.displayName?.trim();
    const email = body.email ? normalizeEmail(body.email) : undefined;
    const password = body.password?.trim();

    if (!displayName && !email && !password) {
        return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
    }

    if (password && password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    let admin;
    try {
        admin = createAdminClient();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Supabase secret key is not configured.';
        return NextResponse.json({ error: message }, { status: 500 });
    }

    const authUpdates: {
        email?: string;
        password?: string;
        email_confirm?: boolean;
        user_metadata?: { full_name: string };
    } = {};

    if (email) {
        authUpdates.email = email;
        authUpdates.email_confirm = true;
    }
    if (password) authUpdates.password = password;
    if (displayName) authUpdates.user_metadata = { full_name: displayName };

    if (Object.keys(authUpdates).length > 0) {
        const { error: authUpdateError } = await admin.auth.admin.updateUserById(userId, authUpdates);
        if (authUpdateError) {
            return NextResponse.json({ error: authUpdateError.message }, { status: 400 });
        }
    }

    const profileUpdates: { display_name?: string } = {};
    if (displayName) profileUpdates.display_name = displayName;

    if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await admin
            .from('profiles')
            .update(profileUpdates)
            .eq('id', userId);

        if (profileError) {
            return NextResponse.json({ error: profileError.message }, { status: 500 });
        }
    }

    return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: WorkerParams) {
    const { userId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    if (userId === user.id) {
        return NextResponse.json({ error: 'You cannot delete your own account here.' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId')?.trim();

    if (!teamId) {
        return NextResponse.json({ error: 'Team is required.' }, { status: 400 });
    }

    const access = await requireOwnedWorker(teamId, userId, user.id);
    if (access.error) return access.error;

    let admin;
    try {
        admin = createAdminClient();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Supabase secret key is not configured.';
        return NextResponse.json({ error: message }, { status: 500 });
    }

    const { error: deleteUserError } = await admin.auth.admin.deleteUser(userId);

    if (deleteUserError) {
        return NextResponse.json({ error: deleteUserError.message }, { status: 400 });
    }

    await admin.from('team_members').delete().eq('user_id', userId);
    await admin.from('profiles').delete().eq('id', userId);

    return NextResponse.json({ ok: true });
}
