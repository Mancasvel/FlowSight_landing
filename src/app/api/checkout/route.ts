import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { mapCheckoutPlan } from '@/lib/plansCheckout';
import { buildPendingLicenseInsert } from '@/lib/licenseActivation';
import { resolveCheckoutPriceId } from '@/lib/stripeConfig';
import { appUrl } from '@/lib/appUrl';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { planType = 'teams_pro', maxMembers, quantity = 1 } = await req.json();
        const mapped = mapCheckoutPlan(planType);
        const seatCount = Math.max(1, Number(quantity) || 1);
        const memberLimit = maxMembers ?? mapped.maxMembers;
        const resolvedPriceId = resolveCheckoutPriceId(mapped.planId);

        if (!resolvedPriceId) {
            return new NextResponse(
                JSON.stringify({
                    error: 'Stripe price is not configured for this plan. Set the live NEXT_PUBLIC_STRIPE_PRICE_* env vars.',
                }),
                { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
        }

        let { data: license } = await supabase
            .from('licenses')
            .select('id, stripe_customer_id')
            .eq('owner_id', user.id)
            .single();

        if (!license) {
            const pending = buildPendingLicenseInsert();
            const { data: newLicense, error: licenseError } = await supabase
                .from('licenses')
                .insert({
                    owner_id: user.id,
                    ...pending,
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

        const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
            price: resolvedPriceId,
            quantity: seatCount,
        };

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [lineItem],
            mode: 'subscription',
            success_url: appUrl('/api/checkout/success?session_id={CHECKOUT_SESSION_ID}'),
            cancel_url: appUrl('/dashboard/pricing?canceled=true'),
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
