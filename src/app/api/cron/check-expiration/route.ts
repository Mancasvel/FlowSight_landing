import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // Allow running if no secret is set (development) or if secret matches
        if (process.env.CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const now = new Date().toISOString();

    // 1. Find expired active licenses
    const { data: expiredLicenses, error: fetchError } = await supabase
        .from('licenses')
        .select('id, owner_id')
        .eq('is_active', true)
        .lt('expires_at', now);

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!expiredLicenses || expiredLicenses.length === 0) {
        return NextResponse.json({ message: 'No expired licenses found' });
    }

    // 2. Mark them as inactive
    const ids = expiredLicenses.map(l => l.id);
    const { error: updateError } = await supabase
        .from('licenses')
        .update({ is_active: false })
        .in('id', ids);

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
        message: `Deactivated ${ids.length} expired licenses`,
        deactivated_ids: ids
    });
}
