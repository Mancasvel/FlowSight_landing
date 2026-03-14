import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headerStore = await headers();
    const userId = headerStore.get('x-user-id');

    if (!userId) {
        redirect('/login');
    }

    const supabase = await createClient();

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

    if (!profile) {
        const userName = headerStore.get('x-user-name') || '';
        const userAvatar = headerStore.get('x-user-avatar') || null;
        const userEmail = headerStore.get('x-user-email') || '';

        const { error: insertError } = await supabase.from('profiles').insert({
            id: userId,
            display_name: userName,
            avatar_url: userAvatar,
            email: userEmail,
            role: 'pm',
        });

        if (insertError) {
            console.error('Failed to create profile:', insertError);
            redirect('/login?error=profile_creation_failed');
        }
    }

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
