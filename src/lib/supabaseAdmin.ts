import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

export function createAdminClient() {
    if (adminClient) return adminClient;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Prefer SUPABASE_SECRET_KEY (current Supabase naming). SUPABASE_SERVICE_ROLE_KEY is legacy-only fallback.
    const secretKey =
        process.env.SUPABASE_SECRET_KEY?.trim() ||
        process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!supabaseUrl || !secretKey) {
        throw new Error(
            'Missing SUPABASE_SECRET_KEY on the server. Use the secret key from Project Settings → API (not the publishable key).'
        );
    }

    adminClient = createClient(supabaseUrl, secretKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    return adminClient;
}
