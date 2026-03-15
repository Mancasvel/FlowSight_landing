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
        <div className="min-h-screen bg-[#FAFAFA]">
            <Sidebar />
            <main className="lg:pl-20 min-h-screen overflow-auto dark-scrollbar">
                <div className="px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-7 lg:pb-7 max-w-[1440px]">
                    {children}
                </div>
            </main>
        </div>
    );
}
