'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AuthLayout } from '@/components/auth/AuthLayout';
import {
    AuthErrorBanner,
    AuthField,
    AuthSuccessBanner,
} from '@/components/auth/AuthFormFields';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const supabase = createClient();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        const normalizedEmail = email.trim().toLowerCase();
        const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/auth/reset-password')}`;

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
            redirectTo,
        });

        if (resetError) {
            setError(resetError.message);
            setIsLoading(false);
            return;
        }

        setSuccess(
            'If an account exists for that email, you will receive a password reset link shortly.'
        );
        setIsLoading(false);
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
                    <div className="space-y-6">
                        <AuthErrorBanner message={error} />
                        <AuthSuccessBanner message={success} />

                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-dashboard-text mb-2">
                                Reset your password
                            </h2>
                            <p className="text-sm text-dashboard-muted">
                                Enter your email and we&apos;ll send you a link to choose a new password
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AuthField
                                id="email"
                                label="Email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
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
                                        Sending link...
                                    </>
                                ) : (
                                    'Send reset link'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="text-center mt-6 text-sm text-dashboard-muted">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1 text-primary-blue hover:underline"
                    >
                        <ArrowLeft size={14} />
                        Back to sign in
                    </Link>
                </p>
            </motion.div>
        </AuthLayout>
    );
}
