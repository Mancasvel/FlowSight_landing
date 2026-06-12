import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { getStripePriceId } from '@/lib/plans';
import { mapCheckoutPlan } from '@/lib/plansCheckout';
import { buildLicenseActivation } from '@/lib/licenseActivation';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { priceId, planType = 'teams_pro', maxMembers, quantity = 1 } = await req.json();
        const mapped = mapCheckoutPlan(planType);
        const seatCount = Math.max(1, Number(quantity) || 1);
        const memberLimit = maxMembers ?? mapped.maxMembers;

        let { data: license } = await supabase
            .from('licenses')
            .select('id, stripe_customer_id')
            .eq('owner_id', user.id)
            .single();

        if (!license) {
            const activation = buildLicenseActivation(planType, memberLimit);
            const { data: newLicense, error: licenseError } = await supabase
                .from('licenses')
                .insert({
                    owner_id: user.id,
                    plan_id: activation.plan_id,
                    plan_type: activation.plan_type,
                    max_members: activation.max_members,
                    expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                })
                .select('id, stripe_customer_id')
                .single();

            if (licenseError) {
                console.error('Failed to create license:', licenseError);
                return new NextResponse('Failed to create license', { status: 500 });
            }

            license = newLicense;
        }

        let customerId = license.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email || undefined,
                metadata: {
                    userId: user.id,
                    licenseId: license.id,
                }
            });
            customerId = customer.id;

            await supabase.from('licenses').update({ stripe_customer_id: customerId }).eq('id', license.id);
        }

        const stripePriceFromEnv = getStripePriceId(mapped.planId);
        const resolvedPriceId =
            priceId &&
            priceId.startsWith('price_') &&
            !['price_basic', 'price_pro', 'price_enterprise'].includes(priceId)
                ? priceId
                : stripePriceFromEnv;

        let lineItem: Stripe.Checkout.SessionCreateParams.LineItem;

        if (resolvedPriceId) {
            lineItem = {
                price: resolvedPriceId,
                quantity: seatCount,
            };
        } else {
            lineItem = {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `FlowSight ${mapped.name}`,
                        description: `Monthly subscription — ${mapped.name}`,
                    },
                    unit_amount: mapped.priceCents,
                    recurring: {
                        interval: 'month' as const,
                    },
                },
                quantity: seatCount,
            };
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [lineItem],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/pricing?canceled=true`,
            allow_promotion_codes: true,
            subscription_data: {
                metadata: {
                    userId: user.id,
                    licenseId: license.id,
                    planType: mapped.planId,
                    planId: mapped.planId,
                    maxMembers: String(memberLimit === -1 ? 9999 : memberLimit),
                },
            },
            metadata: {
                userId: user.id,
                licenseId: license.id,
                planType: mapped.planId,
                planId: mapped.planId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return new NextResponse(
            JSON.stringify({ error: error instanceof Error ? error.message : 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
