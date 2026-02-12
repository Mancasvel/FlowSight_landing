'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function InviteContent() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const token = params.token as string;

    const [status, setStatus] = useState<'loading' | 'valid' | 'expired' | 'used' | 'error'>('loading');
    const [teamName, setTeamName] = useState('');
    const [accepting, setAccepting] = useState(false);

    useEffect(() => {
        validateInvite();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const validateInvite = async () => {
        try {
            const { data: invite, error } = await supabase
                .from('invitations')
                .select(`
          *,
          team:teams(name)
        `)
                .eq('token', token)
                .single();

            if (error || !invite) {
                setStatus('error');
                return;
            }

            if (invite.used_at) {
                setStatus('used');
                return;
            }

            if (new Date(invite.expires_at) < new Date()) {
                setStatus('expired');
                return;
            }

            setTeamName(invite.team?.name || 'Unknown Team');
            setStatus('valid');
        } catch {
            setStatus('error');
        }
    };

    const acceptInvite = async () => {
        setAccepting(true);

        try {
            // Check if user is logged in
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Redirect to login with return URL
                const returnUrl = encodeURIComponent(`/invite/${token}`);
                router.push(`/login?returnTo=${returnUrl}`);
                return;
            }

            // Get invite details
            const { data: invite } = await supabase
                .from('invitations')
                .select('team_id')
                .eq('token', token)
                .single();

            if (!invite) {
                setStatus('error');
                return;
            }

            // Add user to team
            const { error: memberError } = await supabase
                .from('team_members')
                .insert({
                    team_id: invite.team_id,
                    user_id: user.id,
                    role: 'member',
                });

            if (memberError) {
                if (memberError.code === '23505') {
                    // Already a member
                    alert('You are already a member of this team!');
                    router.push('/dashboard');
                    return;
                }
                throw memberError;
            }

            // Update profile to worker role if needed
            await supabase
                .from('profiles')
                .update({ role: 'worker' })
                .eq('id', user.id)
                .eq('role', 'pm'); // Only update if currently PM

            // Mark invitation as used
            await supabase
                .from('invitations')
                .update({ used_at: new Date().toISOString() })
                .eq('token', token);

            // Redirect to success or app download
            router.push('/invite/success');
        } catch (err) {
            console.error('Error accepting invite:', err);
            setStatus('error');
        } finally {
            setAccepting(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="text-center">
                <Loader2 className="animate-spin text-primary-blue mx-auto mb-4" size={48} />
                <p className="text-dashboard-muted">Validating invitation...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-center">
                <XCircle className="text-accent-red mx-auto mb-4" size={48} />
                <h2 className="text-xl font-semibold text-dashboard-text mb-2">Invalid Invitation</h2>
                <p className="text-dashboard-muted mb-6">This invitation link is not valid.</p>
                <a href="/" className="text-primary-blue hover:underline">Go to Homepage</a>
            </div>
        );
    }

    if (status === 'expired') {
        return (
            <div className="text-center">
                <XCircle className="text-accent-orange mx-auto mb-4" size={48} />
                <h2 className="text-xl font-semibold text-dashboard-text mb-2">Invitation Expired</h2>
                <p className="text-dashboard-muted mb-6">This invitation has expired. Please ask your PM for a new link.</p>
                <a href="/" className="text-primary-blue hover:underline">Go to Homepage</a>
            </div>
        );
    }

    if (status === 'used') {
        return (
            <div className="text-center">
                <CheckCircle className="text-accent-green mx-auto mb-4" size={48} />
                <h2 className="text-xl font-semibold text-dashboard-text mb-2">Already Used</h2>
                <p className="text-dashboard-muted mb-6">This invitation has already been used.</p>
                <a href="/" className="text-primary-blue hover:underline">Go to Homepage</a>
            </div>
        );
    }

    return (
        <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-blue to-primary-teal rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-dashboard-text mb-2">
                Join {teamName}
            </h2>
            <p className="text-dashboard-muted mb-8">
                You&apos;ve been invited to join this team on FlowSight.
            </p>
            <button
                onClick={acceptInvite}
                disabled={accepting}
                className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-teal text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
            >
                {accepting ? 'Joining...' : 'Accept Invitation'}
            </button>
            <p className="text-sm text-dashboard-muted mt-6">
                You&apos;ll need to download the FlowSight desktop app to start tracking.
            </p>
        </div>
    );
}

export default function InvitePage() {
    return (
        <div className="min-h-screen bg-dashboard-bg flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-blue/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-teal/20 rounded-full blur-3xl" />
            </div>
            <div className="dashboard-card p-8 max-w-md w-full relative z-10">
                <Suspense fallback={<Loader2 className="animate-spin text-primary-blue mx-auto" size={48} />}>
                    <InviteContent />
                </Suspense>
            </div>
        </div>
    );
}
