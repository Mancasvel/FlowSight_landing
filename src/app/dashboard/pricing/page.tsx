'use client';

import { useState } from 'react';
import { Check, Loader2, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PricingPlan {
    id: string;
    name: string;
    price: number;
    priceId: string; // Stripe Price ID
    features: string[];
    maxMembers: number;
    popular?: boolean;
}

const plans: PricingPlan[] = [
    {
        id: 'basic',
        name: 'Basic',
        price: 12,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || 'price_basic',
        maxMembers: 10,
        features: [
            'Up to 10 team members',
            '7 days data retention',
            'Basic analytics',
            'Email support',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 19,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || 'price_pro',
        maxMembers: 50,
        popular: true,
        features: [
            'Up to 50 team members',
            '90 days data retention',
            'Advanced analytics',
            'Real-time PM Dashboard',
            'Jira, Linear, GitHub integration',
            'Priority email support',
        ],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 49,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE || 'price_enterprise',
        maxMembers: -1, // Unlimited
        features: [
            'Unlimited team members',
            'Unlimited data retention',
            'Custom analytics & reports',
            'Custom integrations',
            'SSO (SAML)',
            'Dedicated support engineer',
            'SLA guarantee',
        ],
    },
];

export default function DashboardPricingPage() {
    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePlanSelect = (plan: PricingPlan) => {
        setQuantity(1);
        setSelectedPlan(plan);
    };

    const handlePurchase = async () => {
        if (!selectedPlan) return;

        setLoading(selectedPlan.id);
        setError(null);

        // Validation removed as per user request (dynamic pricing/environment variables managed elsewhere)
        /*
        if (!selectedPlan.priceId || selectedPlan.priceId.startsWith('price_')) {
            // ... validation logic ...
        }
        */

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: selectedPlan.priceId,
                    planType: selectedPlan.id,
                    maxMembers: quantity, // Use the selected quantity as the member limit
                    quantity: quantity,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to create checkout session');
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
            {/* Header */}
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
                    <p className="text-dashboard-muted">Select the plan that best fits your team</p>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="p-4 bg-accent-red/20 border border-accent-red/30 rounded-lg text-accent-red">
                    {error}
                </div>
            )}

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`dashboard-card p-6 relative ${plan.popular
                            ? 'ring-2 ring-primary-blue'
                            : ''
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="px-3 py-1 bg-gradient-to-r from-primary-blue to-primary-teal text-white text-xs font-semibold rounded-full">
                                    Most Popular
                                </span>
                            </div>
                        )}

                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-dashboard-text mb-2">
                                {plan.name}
                            </h3>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-4xl font-bold text-dashboard-text">
                                    €{plan.price}
                                </span>
                                <span className="text-dashboard-muted">/dev/mo</span>
                            </div>
                            <p className="text-sm text-dashboard-muted mt-2">
                                {plan.maxMembers === -1
                                    ? 'Unlimited members'
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
                            onClick={() => handlePlanSelect(plan)}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                                ${plan.popular
                                    ? 'bg-gradient-to-r from-primary-blue to-primary-teal text-white hover:opacity-90'
                                    : 'bg-dashboard-bg border border-dashboard-border text-dashboard-text hover:bg-dashboard-border'
                                }
                            `}
                        >
                            Select {plan.name}
                        </button>
                    </div>
                ))}
            </div>

            {/* Quantity Modal */}
            {selectedPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-dashboard-card border border-dashboard-border rounded-xl shadow-xl max-w-md w-full p-6 space-y-6">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-dashboard-text">
                                Configure {selectedPlan.name} Plan
                            </h3>
                            <p className="text-dashboard-muted mt-2">
                                How many team members do you need?
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dashboard-text mb-2">
                                    Number of Seats
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full px-4 py-3 bg-dashboard-bg border border-dashboard-border rounded-lg text-dashboard-text focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all"
                                />
                            </div>

                            <div className="bg-dashboard-bg p-4 rounded-lg space-y-2">
                                <div className="flex justify-between text-sm text-dashboard-muted">
                                    <span>Price per seat</span>
                                    <span>€{selectedPlan.price}/mo</span>
                                </div>
                                <div className="flex justify-between text-sm text-dashboard-muted">
                                    <span>Quantity</span>
                                    <span>{quantity}</span>
                                </div>
                                <div className="border-t border-dashboard-border pt-2 flex justify-between font-bold text-dashboard-text text-lg">
                                    <span>Total</span>
                                    <span>€{(selectedPlan.price * quantity).toFixed(2)}/mo</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedPlan(null)}
                                className="flex-1 py-3 px-4 rounded-lg font-medium border border-dashboard-border text-dashboard-text hover:bg-dashboard-bg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePurchase}
                                disabled={loading !== null}
                                className="flex-1 py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-primary-blue to-primary-teal text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
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

            {/* Info */}
            <div className="text-center text-sm text-dashboard-muted space-y-2">
                <p>All plans include a 14-day free trial. Cancel anytime.</p>
                <p>Annual billing available — save 20%.</p>
                <p>
                    Need a custom solution?{' '}
                    <a href="mailto:sales@flowsight.ai" className="text-primary-blue hover:underline">
                        Contact sales
                    </a>
                </p>
            </div>
        </div>
    );
}
