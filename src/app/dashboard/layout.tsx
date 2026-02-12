import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';

// Force dynamic rendering - auth can't be done at build time
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check if user has profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    // If no profile exists, create one as PM (user came from dashboard login)
    if (!profile) {
        const { error: insertError } = await supabase.from('profiles').insert({
            id: user.id,
            display_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url,
            email: user.email,
            role: 'pm', // Users logging in through dashboard are PMs
        });

        if (insertError) {
            console.error('Failed to create profile:', insertError);
            redirect('/login?error=profile_creation_failed');
        }
    }
    // Note: We no longer reject users based on role - all dashboard users are considered PMs

    return (
        <div className="min-h-screen bg-dashboard-bg flex">
            <Sidebar />
            <main className="flex-1 overflow-auto dark-scrollbar">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
