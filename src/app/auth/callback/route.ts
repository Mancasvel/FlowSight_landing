import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            // Check if profile exists, create if not
            const { data: profile } = await supabase
                .from('profiles')
                .select('id, role')
                .eq('id', data.user.id)
                .single();

            if (!profile) {
                // Create new profile for first-time PM
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    display_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
                    avatar_url: data.user.user_metadata?.avatar_url,
                    role: 'pm', // New users from dashboard are PMs
                });
            }

            const forwardedHost = request.headers.get('x-forwarded-host');
            const isLocalEnv = process.env.NODE_ENV === 'development';

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                return NextResponse.redirect(`${origin}${next}`);
            }
        }
    }

    // Auth failed, redirect to login with error
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
