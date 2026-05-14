import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabaseAdmin';

/** Remove rows that block ON DELETE CASCADE from auth.users → profiles. */
async function clearProfileDeleteBlockers(admin: SupabaseClient, userId: string) {
    const { error: invitedByError } = await admin
        .from('team_members')
        .update({ invited_by: null })
        .eq('invited_by', userId);
    if (invitedByError) {
        return { error: invitedByError.message };
    }

    const { error: ticketsError } = await admin.from('ticket_snapshots').delete().eq('user_id', userId);
    if (ticketsError) {
        return { error: ticketsError.message };
    }

    const { error: sprintError } = await admin
        .from('sprint_commitments')
        .update({ created_by: null })
        .eq('created_by', userId);
    if (sprintError) {
        return { error: sprintError.message };
    }

    const { error: inviteAuthError } = await admin
        .from('invitations')
        .update({ created_by: null })
        .eq('created_by', userId);
    if (inviteAuthError) {
        return { error: inviteAuthError.message };
    }

    return { error: null as string | null };
}

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
        const message =
            error instanceof Error
                ? error.message
                : 'Supabase secret key is not configured.';
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

    try {
        const admin = createAdminClient();

        const purge = await clearProfileDeleteBlockers(admin, userId);
        if (purge.error) {
            return NextResponse.json({ error: purge.error }, { status: 500 });
        }

        // Normalize nullable auth string columns (GoTrue admin API can fail scanning NULL → string).
        const { error: prepAuthError } = await admin.rpc('prepare_worker_auth_delete', { p_user_id: userId });
        if (prepAuthError) {
            if (prepAuthError.code === 'PGRST202') {
                console.warn(
                    '[team-workers DELETE] Missing RPC prepare_worker_auth_delete on this database; create it in Supabase (SQL) or worker Auth delete may fail.'
                );
            } else {
                console.warn('[team-workers DELETE] prepare_worker_auth_delete:', prepAuthError.message);
            }
        }

        const { data: deletedProfiles, error: profileDeleteError } = await admin
            .from('profiles')
            .delete()
            .eq('id', userId)
            .select('id');
        if (profileDeleteError) {
            return NextResponse.json({ error: profileDeleteError.message }, { status: 500 });
        }

        const profileRemoved = (deletedProfiles?.length ?? 0) > 0;

        const { error: deleteUserError } = await admin.auth.admin.deleteUser(userId);

        if (deleteUserError) {
            const msg = deleteUserError.message.toLowerCase();
            if (msg.includes('not found') || msg.includes('does not exist')) {
                return NextResponse.json({ ok: true });
            }
            if (profileRemoved) {
                const { error: hardDelError } = await admin.rpc('delete_worker_auth_user', {
                    p_user_id: userId,
                });
                if (hardDelError) {
                    if (hardDelError.code === 'PGRST202') {
                        console.error(
                            '[team-workers DELETE] Missing RPC delete_worker_auth_user; Auth row may remain for',
                            userId
                        );
                    } else {
                        console.error(
                            '[team-workers DELETE] delete_worker_auth_user:',
                            hardDelError.message,
                            userId
                        );
                    }
                }
                return NextResponse.json({ ok: true });
            }
            return NextResponse.json({ error: deleteUserError.message }, { status: 400 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('team-workers DELETE', error);
        const message = error instanceof Error ? error.message : 'Worker delete failed.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
