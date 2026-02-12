import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { priceId, planType = 'pro', maxMembers = 50, quantity = 1 } = await req.json();

        // Map frontend plan types to database valid enum values
        const planMapping: Record<string, 'starter' | 'professional' | 'enterprise'> = {
            'basic': 'starter',
            'pro': 'professional',
            'enterprise': 'enterprise',
            // Fallbacks just in case
            'starter': 'starter',
            'professional': 'professional',
        };

        const dbPlanType = planMapping[planType] || 'professional';

        // Get or create the license
        let { data: license } = await supabase
            .from('licenses')
            .select('id, stripe_customer_id')
            .eq('owner_id', user.id)
            .single();

        // If no license exists, create one
        if (!license) {
            const { data: newLicense, error: licenseError } = await supabase
                .from('licenses')
                .insert({
                    owner_id: user.id,
                    plan_type: dbPlanType,
                    max_members: maxMembers,
                    expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14-day trial
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

        // If no customer ID exists, create one
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email || undefined,
                metadata: {
                    userId: user.id,
                    licenseId: license.id,
                }
            });
            customerId = customer.id;

            // Save customer ID to license
            await supabase.from('licenses').update({ stripe_customer_id: customerId }).eq('id', license.id);
        }

        console.log('Creating checkout session for:', { priceId, customerId });

        // Determine line items based on priceId or planType
        // If priceId looks like a Stripe ID (starts with price_), use it directly.
        // Otherwise, construct price_data dynamically.
        let lineItem: Stripe.Checkout.SessionCreateParams.LineItem;

        if (priceId && priceId.startsWith('price_') && !['price_basic', 'price_pro', 'price_enterprise'].includes(priceId)) {
            lineItem = {
                price: priceId,
                quantity: quantity,
            };
        } else {
            // Dynamic pricing based on plan type
            const prices = {
                basic: { amount: 1200, name: 'FlowSight Basic Plan' },
                pro: { amount: 1900, name: 'FlowSight Pro Plan' },
                enterprise: { amount: 4900, name: 'FlowSight Enterprise Plan' },
            };

            const planConfig = prices[planType as keyof typeof prices] || prices.pro;

            lineItem = {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: planConfig.name,
                        description: `Subscription for ${planType} plan`,
                    },
                    unit_amount: planConfig.amount,
                    recurring: {
                        interval: 'month' as const,
                    },
                },
                quantity: quantity || 1,
            };
        }

        console.log('Creating checkout session for:', { priceId, customerId, mode: 'subscription' });

        // Create checkout session with embedded mode for simpler flow
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [lineItem],
            mode: 'subscription',
            // Use success URL with session_id to verify payment on return
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/pricing?canceled=true`,
            allow_promotion_codes: true,
            subscription_data: {
                metadata: {
                    userId: user.id,
                    licenseId: license.id,
                    planType: planType,
                    maxMembers: String(maxMembers),
                },
            },
            metadata: {
                userId: user.id,
                licenseId: license.id,
                planType: planType,
            },
        });

        console.log('Checkout session created:', session.url);
        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        // Return more specific error message
        return new NextResponse(
            JSON.stringify({ error: error instanceof Error ? error.message : 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
