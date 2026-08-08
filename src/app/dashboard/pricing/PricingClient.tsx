'use client';

import { useState } from 'react';
import { Check, Loader2, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { PlanId } from '@/lib/plans';

export interface PricingPlanView {
    id: PlanId;
    name: string;
    price: number;
    features: string[];
    maxMembers: number;
    popular?: boolean;
    checkoutAvailable: boolean;
}

interface PricingClientProps {
    plans: PricingPlanView[];
    checkoutConfigured: boolean;
}

export function PricingClient({ plans, checkoutConfigured }: PricingClientProps) {
    const [selectedPlan, setSelectedPlan] = useState<PricingPlanView | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePlanSelect = (plan: PricingPlanView) => {
        if (!plan.checkoutAvailable) return;
        setQuantity(1);
        setSelectedPlan(plan);
    };

    const handlePurchase = async () => {
        if (!selectedPlan?.checkoutAvailable) return;

        setLoading(selectedPlan.id);
        setError(null);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planType: selectedPlan.id,
                    maxMembers: selectedPlan.maxMembers === -1 ? 9999 : selectedPlan.maxMembers,
                    quantity: selectedPlan.id === 'individual_pro' ? 1 : quantity,
                }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                throw new Error(payload?.error || (await response.text()) || 'Failed to create checkout session');
            }

            const { url } = await response.json();
            window.location.href = url;
        } catch (err) {
            console.error('Purchase error:', err);
            setError(err instanceof Error ? err.message : 'Failed to start checkout');
            setLoading(null);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/settings"
                    className="p-2 hover:bg-dashboard-border rounded-lg transition-colors"
                >
                    <ArrowLeft className="text-dashboard-muted" size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-dashboard-text flex items-center gap-2">
                        <CreditCard className="text-primary-blue" size={28} />
                        Choose Your Plan
                    </h1>
                    <p className="text-dashboard-muted">Pro plans include encrypted notification settings and AI coach</p>
                </div>
            </div>

            {!checkoutConfigured && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-sm space-y-2">
                    <p className="font-medium text-amber-100">Checkout is not configured yet</p>
                    <p>
                        Add your live Stripe Price IDs to{' '}
                        <code className="text-xs bg-dashboard-bg px-1.5 py-0.5 rounded">NEXT_PUBLIC_STRIPE_PRICE_*</code>{' '}
                        in <code className="text-xs bg-dashboard-bg px-1.5 py-0.5 rounded">.env.local</code>, set{' '}
                        <code className="text-xs bg-dashboard-bg px-1.5 py-0.5 rounded">STRIPE_SECRET_KEY</code>, then
                        restart the dev server (or redeploy on Vercel).
                    </p>
                    <p className="text-dashboard-muted">
                        Create prices in Stripe Dashboard → Products → Pricing → copy each Price ID (starts with{' '}
                        <code className="text-xs">price_</code>).
                    </p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-accent-red/20 border border-accent-red/30 rounded-lg text-accent-red">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`dashboard-card p-6 relative ${plan.popular ? 'ring-2 ring-primary-blue' : ''}`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                                    Most Popular
                                </span>
                            </div>
                        )}

                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-dashboard-text mb-2">{plan.name}</h3>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-4xl font-bold text-dashboard-text">€{plan.price}</span>
                                <span className="text-dashboard-muted">
                                    {plan.id === 'individual_pro' ? '/mo' : '/seat/mo'}
                                </span>
                            </div>
                            <p className="text-sm text-dashboard-muted mt-2">
                                {plan.maxMembers === -1
                                    ? 'Unlimited members'
                                    : plan.id === 'individual_pro'
                                      ? 'Single user'
                                      : `Up to ${plan.maxMembers} members`}
                            </p>
                        </div>

                        <ul className="space-y-3 mb-6">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <Check className="text-accent-green flex-shrink-0 mt-0.5" size={16} />
                                    <span className="text-sm text-dashboard-text">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            onClick={() => handlePlanSelect(plan)}
                            disabled={!plan.checkoutAvailable}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                                ${!plan.checkoutAvailable
                                    ? 'bg-dashboard-bg border border-dashboard-border text-dashboard-muted cursor-not-allowed opacity-60'
                                    : plan.popular
                                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                      : 'bg-dashboard-bg border border-dashboard-border text-dashboard-text hover:bg-dashboard-border'
                                }
                            `}
                        >
                            {plan.checkoutAvailable ? `Select ${plan.name}` : 'Unavailable'}
                        </button>
                    </div>
                ))}
            </div>

            {selectedPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-dashboard-card border border-dashboard-border rounded-xl shadow-xl max-w-md w-full p-6 space-y-6">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-dashboard-text">Configure {selectedPlan.name}</h3>
                            <p className="text-dashboard-muted mt-2">
                                {selectedPlan.id === 'individual_pro'
                                    ? 'Individual Pro subscription'
                                    : 'How many seats do you need?'}
                            </p>
                        </div>

                        {selectedPlan.id !== 'individual_pro' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-dashboard-text mb-2">
                                        Number of Seats
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                        className="w-full px-4 py-3 bg-dashboard-bg border border-dashboard-border rounded-lg text-dashboard-text focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="bg-dashboard-bg p-4 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm text-dashboard-muted">
                                <span>Price</span>
                                <span>
                                    €{selectedPlan.price}
                                    {selectedPlan.id === 'individual_pro' ? '/mo' : '/seat/mo'}
                                </span>
                            </div>
                            {selectedPlan.id !== 'individual_pro' && (
                                <div className="flex justify-between text-sm text-dashboard-muted">
                                    <span>Seats</span>
                                    <span>{quantity}</span>
                                </div>
                            )}
                            <div className="border-t border-dashboard-border pt-2 flex justify-between font-bold text-dashboard-text text-lg">
                                <span>Total</span>
                                <span>
                                    €
                                    {(selectedPlan.price * (selectedPlan.id === 'individual_pro' ? 1 : quantity)).toFixed(2)}
                                    /mo
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedPlan(null)}
                                className="flex-1 py-3 px-4 rounded-lg font-medium border border-dashboard-border text-dashboard-text hover:bg-dashboard-bg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handlePurchase}
                                disabled={loading !== null}
                                className="flex-1 py-3 px-4 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading === selectedPlan.id ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Processing...
                                    </>
                                ) : (
                                    'Proceed to Checkout'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center text-sm text-dashboard-muted space-y-2">
                <p>Secure checkout powered by Stripe. Billed monthly. Cancel anytime.</p>
                <p>Recipient emails and digest settings are encrypted at rest (AES-256-GCM).</p>
            </div>
        </div>
    );
}
