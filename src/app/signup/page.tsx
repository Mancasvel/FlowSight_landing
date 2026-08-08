'use client';

import { useState, Suspense, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ensureProfile } from '@/lib/auth/ensureProfile';
import { getAuthCallbackUrl, getPostAuthRedirect } from '@/lib/auth/getPostAuthRedirect';
import { AuthLayout } from '@/components/auth/AuthLayout';
import {
    AuthDivider,
    AuthErrorBanner,
    AuthField,
    AuthSuccessBanner,
} from '@/components/auth/AuthFormFields';

function SignupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const supabase = createClient();

    const buildLoginHref = () => {
        const params = new URLSearchParams();
        const returnTo = searchParams.get('returnTo');
        const plan = searchParams.get('plan');
        if (returnTo) params.set('returnTo', returnTo);
        if (plan) params.set('plan', plan);
        const query = params.toString();
        return query ? `/login?${query}` : '/login';
    };

    const handleEmailSignUp = async (event: FormEvent<HTMLFormElement>) => {
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

        const normalizedEmail = email.trim().toLowerCase();
        const trimmedName = fullName.trim();

        const { data, error: signUpError } = await supabase.auth.signUp({
            email: normalizedEmail,
            password,
            options: {
                data: {
                    full_name: trimmedName,
                },
                emailRedirectTo: getAuthCallbackUrl(searchParams),
            },
        });

        if (signUpError) {
            setError(signUpError.message);
            setIsLoading(false);
            return;
        }

        if (!data.user) {
            setError('Account creation failed. Please try again.');
            setIsLoading(false);
            return;
        }

        if (data.session) {
            const { error: profileError } = await ensureProfile(supabase, data.user);
            if (profileError) {
                setError('Account created, but profile setup failed. Please sign in.');
                setIsLoading(false);
                return;
            }

            router.replace(getPostAuthRedirect(searchParams));
            router.refresh();
            return;
        }

        setSuccess(
            'Account created. Check your email to confirm your address, then sign in.'
        );
        setIsLoading(false);
    };

    const handleGoogleSignUp = async () => {
        setOauthLoading(true);
        setError('');
        setSuccess('');

        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: getAuthCallbackUrl(searchParams),
            },
        });

        if (oauthError) {
            setError(oauthError.message);
            setOauthLoading(false);
        }
    };

    const isBusy = isLoading || oauthLoading;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md relative z-10"
        >
            <div className="dashboard-card p-8 backdrop-blur-xl bg-dashboard-card/80">
                <div className="space-y-6">
                    <AuthErrorBanner message={error} />
                    <AuthSuccessBanner message={success} />

                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-dashboard-text mb-2">
                            Create your account
                        </h2>
                        <p className="text-sm text-dashboard-muted">
                            Start managing your team&apos;s productivity with FlowSight
                        </p>
                    </div>

                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                        <AuthField
                            id="fullName"
                            label="Full name"
                            type="text"
                            autoComplete="name"
                            placeholder="Jane Doe"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            required
                            disabled={isBusy}
                        />
                        <AuthField
                            id="email"
                            label="Email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            disabled={isBusy}
                        />
                        <AuthField
                            id="password"
                            label="Password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            minLength={8}
                            disabled={isBusy}
                        />
                        <AuthField
                            id="confirmPassword"
                            label="Confirm password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Repeat your password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                            minLength={8}
                            disabled={isBusy}
                        />

                        <button
                            type="submit"
                            disabled={isBusy}
                            className="w-full py-3 px-4 bg-gradient-to-r from-primary-blue to-primary-teal text-white font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>

                    <AuthDivider />

                    <button
                        onClick={handleGoogleSignUp}
                        disabled={isBusy}
                        className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
                    >
                        {oauthLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Redirecting...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
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
                </div>
            </div>

            <p className="text-center mt-6 text-sm text-dashboard-muted">
                Already have an account?{' '}
                <Link href={buildLoginHref()} className="text-primary-blue hover:underline">
                    Sign in
                </Link>
            </p>
        </motion.div>
    );
}

function SignupFallback() {
    return (
        <div className="w-full max-w-md relative z-10">
            <div className="dashboard-card p-8 backdrop-blur-xl bg-dashboard-card/80 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-blue" size={32} />
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <AuthLayout>
            <Suspense fallback={<SignupFallback />}>
                <SignupContent />
            </Suspense>
        </AuthLayout>
    );
}
