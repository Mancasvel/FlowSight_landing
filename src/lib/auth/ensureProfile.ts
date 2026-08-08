import type { SupabaseClient, User } from '@supabase/supabase-js';

type ProfileRole = 'pm' | 'worker';

/**
 * Creates a profiles row on first login when one does not exist yet.
 * Mirrors the bootstrap logic in /auth/callback for OAuth users.
 */
export async function ensureProfile(
    supabase: SupabaseClient,
    user: User,
    role: ProfileRole = 'pm'
): Promise<{ error: string | null }> {
    const { data: profile, error: selectError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

    if (selectError) {
        return { error: selectError.message };
    }

    if (profile) {
        return { error: null };
    }

    const { error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        display_name:
            user.user_metadata?.full_name ||
            user.email?.split('@')[0] ||
            'User',
        avatar_url: user.user_metadata?.avatar_url ?? null,
        role,
    });

    if (insertError) {
        return { error: insertError.message };
    }

    return { error: null };
}
