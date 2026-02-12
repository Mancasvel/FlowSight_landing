import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const headerPayload = await headers();
    const signature = headerPayload.get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        return new NextResponse(`Webhook Error: ${error instanceof Error ? error.message : 'Unknown Error'}`, { status: 400 });
    }

    const supabase = await createClient();
    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        const subscriptionId = session.subscription as string;
        const licenseId = session.metadata?.licenseId;
        const planType = session.metadata?.planType;
        const maxMembers = session.metadata?.maxMembers ? parseInt(session.metadata.maxMembers) : 50;

        if (!licenseId) {
            return new NextResponse('Missing licenseId in metadata', { status: 400 });
        }

        // Map plan type
        const planMapping: Record<string, 'starter' | 'professional' | 'enterprise'> = {
            'basic': 'starter',
            'pro': 'professional',
            'enterprise': 'enterprise',
        };
        const dbPlanType = planMapping[planType || 'pro'] || 'professional';

        // Retrieve subscription details to get expiration
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const expirationDate = new Date((subscription as any).current_period_end * 1000).toISOString();

        // Update license
        await supabase.from('licenses').update({
            stripe_subscription_id: subscriptionId,
            is_active: true,
            plan_type: dbPlanType,
            max_members: maxMembers,
            expires_at: expirationDate,
        }).eq('id', licenseId);
    }

    if (event.type === 'invoice.payment_succeeded') {
        const subscriptionId = session.subscription as string;
        // Find license by subscription ID
        const { data: license } = await supabase.from('licenses').select('id').eq('stripe_subscription_id', subscriptionId).single();

        if (license) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const expirationDate = new Date((subscription as any).current_period_end * 1000).toISOString();

            await supabase.from('licenses').update({
                expires_at: expirationDate,
                is_active: true, // Re-activate if it was inactive
            }).eq('id', license.id);
        }
    }

    return new NextResponse('ok', { status: 200 });
}
