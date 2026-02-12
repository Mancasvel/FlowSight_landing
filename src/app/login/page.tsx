'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginContent() {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const supabase = createClient();

    useEffect(() => {
        // Check for auth error from callback
        const authError = searchParams.get('error');
        if (authError === 'auth_failed') {
            setError('Authentication failed. Please try again.');
        } else if (authError === 'not_pm') {
            setError('Access denied. This portal is for Project Managers only.');
        } else if (authError === 'jira_auth_failed') {
            setError('Jira authentication failed. Please try again.');
        } else if (authError === 'token_exchange_failed') {
            setError('Failed to authenticate with Jira. Please try again.');
        } else if (authError === 'jira_resources_failed') {
            setError('Could not access your Jira workspace. Please check permissions.');
        } else if (authError === 'jira_user_failed') {
            setError('Could not retrieve your Jira user information.');
        } else if (authError === 'profile_creation_failed') {
            setError('Failed to create your profile. Please try again.');
        }
    }, [searchParams]);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    const handleJiraSignIn = () => {
        setIsLoading(true);
        setError('');

        // Redirect to Jira OAuth authorization endpoint
        const clientId = process.env.NEXT_PUBLIC_JIRA_CLIENT_ID;
        const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/jira/callback`);
        const scope = encodeURIComponent('read:jira-user read:jira-work offline_access');
        const state = crypto.randomUUID(); // CSRF protection

        // Store state in sessionStorage for verification
        sessionStorage.setItem('jira_oauth_state', state);

        const authUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}&response_type=code&prompt=consent`;

        window.location.href = authUrl;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md relative z-10"
        >


            {/* Login Card */}
            <div className="dashboard-card p-8 backdrop-blur-xl bg-dashboard-card/80">
                <div className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-accent-red/20 border border-accent-red/30 rounded-lg text-accent-red text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Welcome Text */}
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-dashboard-text mb-2">
                            Welcome back
                        </h2>
                        <p className="text-sm text-dashboard-muted">
                            Sign in to access your team&apos;s productivity dashboard
                        </p>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg
                     text-gray-700 font-medium
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue/50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Redirecting...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </button>

                    {/* Or divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-dashboard-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-dashboard-card text-dashboard-muted">or</span>
                        </div>
                    </div>

                    {/* Jira Sign In Button */}
                    <button
                        onClick={handleJiraSignIn}
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-[#0052CC] border border-[#0052CC] rounded-lg
                     text-white font-medium
                     hover:bg-[#0747A6] focus:outline-none focus:ring-2 focus:ring-[#0052CC]/50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Redirecting...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.762a1.005 1.005 0 0 0-1.001-1.005zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.005 1.005 0 0 0 23.013 0z" />
                                </svg>
                                Continue with Jira
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-dashboard-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-dashboard-card text-dashboard-muted"></span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-center text-sm text-dashboard-muted">
                        <p>Workers should use the FlowSight desktop app</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <p className="text-center mt-6 text-sm text-dashboard-muted">
                Need a license?{' '}
                <a href="/#pricing" className="text-primary-blue hover:underline">
                    View pricing
                </a>
            </p>
        </motion.div>
    );
}

function LoginFallback() {
    return (
        <div className="w-full max-w-md relative z-10">

            <div className="dashboard-card p-8 backdrop-blur-xl bg-dashboard-card/80 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-blue" size={32} />
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-dashboard-bg flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background gradient effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-blue/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-teal/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-category-design/10 rounded-full blur-3xl" />
            </div>

            <Suspense fallback={<LoginFallback />}>
                <LoginContent />
            </Suspense>
        </div>
    );
}
