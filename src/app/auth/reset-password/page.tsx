'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AuthLayout } from '@/components/auth/AuthLayout';
import {
    AuthErrorBanner,
    AuthField,
    AuthSuccessBanner,
} from '@/components/auth/AuthFormFields';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [hasSession, setHasSession] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const supabase = createClient();

    useEffect(() => {
        let isMounted = true;
        const supabaseClient = createClient();

        const verifySession = async () => {
            const { data: { session } } = await supabaseClient.auth.getSession();

            if (!isMounted) return;

            setHasSession(Boolean(session));
            setCheckingSession(false);
        };

        verifySession();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        const { error: updateError } = await supabase.auth.updateUser({ password });

        if (updateError) {
            setError(updateError.message);
            setIsLoading(false);
            return;
        }

        setSuccess('Password updated successfully. Redirecting to sign in...');
        await supabase.auth.signOut();
        setTimeout(() => {
            router.replace('/login');
        }, 1500);
    };

    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="dashboard-card p-8 backdrop-blur-xl bg-dashboard-card/80">
                    {checkingSession ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="animate-spin text-primary-blue" size={32} />
                        </div>
                    ) : !hasSession ? (
                        <div className="space-y-4 text-center">
                            <AuthErrorBanner message="This reset link is invalid or has expired." />
                            <p className="text-sm text-dashboard-muted">
                                Request a new password reset link to continue.
                            </p>
                            <Link
                                href="/forgot-password"
                                className="inline-block text-sm text-primary-blue hover:underline"
                            >
                                Request new link
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <AuthErrorBanner message={error} />
                            <AuthSuccessBanner message={success} />

                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-dashboard-text mb-2">
                                    Choose a new password
                                </h2>
                                <p className="text-sm text-dashboard-muted">
                                    Enter a new password for your FlowSight account
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <AuthField
                                    id="password"
                                    label="New password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="At least 8 characters"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                    minLength={8}
                                    disabled={isLoading}
                                />
                                <AuthField
                                    id="confirmPassword"
                                    label="Confirm new password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Repeat your password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    required
                                    minLength={8}
                                    disabled={isLoading}
                                />

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-primary-blue to-primary-teal text-white font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Updating password...
                                        </>
                                    ) : (
                                        'Update password'
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </motion.div>
        </AuthLayout>
    );
}
