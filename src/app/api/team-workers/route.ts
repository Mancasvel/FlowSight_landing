import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

type CreateWorkerPayload = {
    teamId?: string;
    displayName?: string;
    email?: string;
    password?: string;
};

function generateTemporaryPassword() {
    return `Fs-${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}A1!`;
}

function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

async function validateTeamOwner(teamId: string, ownerId: string) {
    const supabase = await createClient();

    const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('id, license_id')
        .eq('id', teamId)
        .eq('owner_id', ownerId)
        .eq('is_active', true)
        .single();

    if (teamError || !team) {
        return { error: NextResponse.json({ error: 'Team not found or unauthorized.' }, { status: 403 }) };
    }

    const { data: license, error: licenseError } = await supabase
        .from('licenses')
        .select('id, max_members')
        .eq('id', team.license_id)
        .eq('owner_id', ownerId)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

    if (licenseError || !license) {
        return { error: NextResponse.json({ error: 'An active license is required.' }, { status: 403 }) };
    }

    return { team, license };
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = (await request.json()) as CreateWorkerPayload;
    const teamId = body.teamId?.trim();
    const displayName = body.displayName?.trim();
    const email = body.email ? normalizeEmail(body.email) : '';
    const password = body.password?.trim() || generateTemporaryPassword();

    if (!teamId || !displayName || !email) {
        return NextResponse.json({ error: 'Name, email, and team are required.' }, { status: 400 });
    }

    if (password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const ownership = await validateTeamOwner(teamId, user.id);
    if (ownership.error) return ownership.error;

    const { count, error: countError } = await supabase
        .from('team_members')
        .select('id', { count: 'exact', head: true })
        .eq('team_id', teamId);

    if (countError) {
        return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    if ((count ?? 0) >= ownership.license.max_members) {
        return NextResponse.json({ error: 'This team has reached the license seat limit.' }, { status: 409 });
    }

    let admin;
    try {
        admin = createAdminClient();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Supabase secret key is not configured.';
        return NextResponse.json({ error: message }, { status: 500 });
    }

    const { data: createdUser, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: displayName },
    });

    if (createError || !createdUser.user) {
        return NextResponse.json(
            { error: createError?.message || 'Could not create worker account.' },
            { status: 400 }
        );
    }

    const workerId = createdUser.user.id;

    try {
        const { error: profileError } = await admin
            .from('profiles')
            .upsert({
                id: workerId,
                display_name: displayName,
                avatar_url: null,
                role: 'worker',
            }, { onConflict: 'id' });

        if (profileError) throw profileError;

        const { error: memberError } = await admin
            .from('team_members')
            .insert({
                team_id: teamId,
                user_id: workerId,
                role: 'member',
                invited_by: user.id,
            });

        if (memberError) throw memberError;
    } catch (error) {
        await admin.auth.admin.deleteUser(workerId);
        const message = error instanceof Error ? error.message : 'Could not finish worker setup.';
        return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({
        worker: {
            id: workerId,
            email,
            displayName,
            role: 'member',
        },
        credentials: {
            email,
            password,
        },
    });
}
