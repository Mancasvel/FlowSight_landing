'use client';

import { useState } from 'react';
import { Check, Loader2, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PLANS, type PlanId } from '@/lib/plans';

interface PricingPlan {
    id: PlanId;
    name: string;
    price: number;
    priceId: string;
    features: string[];
    maxMembers: number;
    popular?: boolean;
}

const plans: PricingPlan[] = [
    {
        id: 'individual_pro',
        name: PLANS.individual_pro.name,
        price: PLANS.individual_pro.priceEur,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_INDIVIDUAL_PRO || 'price_individual_pro',
        maxMembers: PLANS.individual_pro.maxMembers,
        features: [
            '150 AI coach prompts / month',
            'Personal weekly PDF digest',
            '90 days cloud history',
            'Proactive dashboard insights',
            'Priority email support',
        ],
    },
    {
        id: 'teams_simple',
        name: PLANS.teams_simple.name,
        price: PLANS.teams_simple.priceEur,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAMS_SIMPLE || 'price_teams_simple',
        maxMembers: PLANS.teams_simple.maxMembers,
        features: [
            'Up to 10 team members',
            '50 admin coach prompts / month',
            'Shared team reports',
            'Basic weekly email report',
            '90 days data retention',
        ],
    },
    {
        id: 'teams_pro',
        name: PLANS.teams_pro.name,
        price: PLANS.teams_pro.priceEur,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAMS_PRO || 'price_teams_pro',
        maxMembers: PLANS.teams_pro.maxMembers,
        popular: true,
        features: [
            '250 coach prompts / seat + 500 team pool',
            'Weekly executive report (email + AI narrative)',
            'Burnout & meeting overload alerts',
            '365 days data retention',
            'Priority support (< 8h)',
        ],
    },
    {
        id: 'enterprise',
        name: PLANS.enterprise.name,
        price: PLANS.enterprise.priceEur,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE || 'price_enterprise',
        maxMembers: PLANS.enterprise.maxMembers,
        features: [
            '500 prompts / seat + 2000 team pool',
            'White-label weekly reports',
            'SSO (SAML) & audit trails',
            'Unlimited data retention',
            'Dedicated success engineer',
        ],
    },
];

export default function DashboardPricingPage() {
    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePlanSelect = (plan: PricingPlan) => {
        setQuantity(plan.id === 'individual_pro' ? 1 : 1);
        setSelectedPlan(plan);
    };

    const handlePurchase = async () => {
        if (!selectedPlan) return;

        setLoading(selectedPlan.id);
        setError(null);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: selectedPlan.priceId,
                    planType: selectedPlan.id,
                    maxMembers: selectedPlan.maxMembers === -1 ? 9999 : selectedPlan.maxMembers,
                    quantity: selectedPlan.id === 'individual_pro' ? 1 : quantity,
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

            {error && (
                <div className="p-4 bg-accent-red/20 border border-accent-red/30 rounded-lg text-accent-red">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
                                <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
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
                            onClick={() => handlePlanSelect(plan)}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                                ${plan.popular
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-dashboard-bg border border-dashboard-border text-dashboard-text hover:bg-dashboard-border'
                                }
                            `}
                        >
                            Select {plan.name}
                        </button>
                    </div>
                ))}
            </div>

            {selectedPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-dashboard-card border border-dashboard-border rounded-xl shadow-xl max-w-md w-full p-6 space-y-6">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-dashboard-text">
                                Configure {selectedPlan.name}
                            </h3>
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
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full px-4 py-3 bg-dashboard-bg border border-dashboard-border rounded-lg text-dashboard-text focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="bg-dashboard-bg p-4 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm text-dashboard-muted">
                                <span>Price</span>
                                <span>€{selectedPlan.price}{selectedPlan.id === 'individual_pro' ? '/mo' : '/seat/mo'}</span>
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
                                    €{(selectedPlan.price * (selectedPlan.id === 'individual_pro' ? 1 : quantity)).toFixed(2)}/mo
                                </span>
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
                <p>All plans include a 14-day free trial. Cancel anytime.</p>
                <p>Recipient emails and digest settings are encrypted at rest (AES-256-GCM).</p>
            </div>
        </div>
    );
}
