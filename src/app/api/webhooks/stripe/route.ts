import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/promptLimits';
import { buildLicenseActivation } from '@/lib/licenseActivation';
import Stripe from 'stripe';

async function activateLicense(params: {
  licenseId: string;
  subscriptionId: string;
  planType?: string | null;
  maxMembers?: number;
}) {
  const supabase = createServiceClient();
  const activation = buildLicenseActivation(params.planType, params.maxMembers);
  const subscription = await stripe.subscriptions.retrieve(params.subscriptionId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const expirationDate = new Date((subscription as any).current_period_end * 1000).toISOString();

  await supabase.from('licenses').update({
    stripe_subscription_id: params.subscriptionId,
    plan_id: activation.plan_id,
    plan_type: activation.plan_type,
    max_members: activation.max_members,
    is_active: activation.is_active,
    expires_at: expirationDate,
  }).eq('id', params.licenseId);
}

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

    const supabase = createServiceClient();

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        const licenseId = session.metadata?.licenseId;
        const planType = session.metadata?.planId ?? session.metadata?.planType;
        const maxMembers = session.metadata?.maxMembers ? parseInt(session.metadata.maxMembers) : undefined;

        if (!licenseId) {
            return new NextResponse('Missing licenseId in metadata', { status: 400 });
        }

        await activateLicense({ licenseId, subscriptionId, planType, maxMembers });
    }

    if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId =
            typeof invoice.parent?.subscription_details?.subscription === 'string'
                ? invoice.parent.subscription_details.subscription
                : null;

        if (!subscriptionId) {
            return new NextResponse('ok', { status: 200 });
        }

        const { data: license } = await supabase.from('licenses').select('id').eq('stripe_subscription_id', subscriptionId).single();

        if (license) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const expirationDate = new Date((subscription as any).current_period_end * 1000).toISOString();

            await supabase.from('licenses').update({
                expires_at: expirationDate,
                is_active: true,
            }).eq('id', license.id);
        }
    }

    return new NextResponse('ok', { status: 200 });
}
