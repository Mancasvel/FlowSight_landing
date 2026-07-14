import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/promptLimits';
import { buildLicenseActivation } from '@/lib/licenseActivation';
import { linkOwnerTeamsToLicense } from '@/lib/linkLicenseToTeams';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!sessionId) {
        return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=no_session`);
    }

    try {
        // Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['subscription'],
        });

        // Verify payment was successful
        if (session.payment_status !== 'paid') {
            return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=payment_incomplete`);
        }

        const supabase = createServiceClient();
        const licenseId = session.metadata?.licenseId;
        const ownerId = session.metadata?.userId;
        const planType = session.metadata?.planId ?? session.metadata?.planType;
        const maxMembers = session.metadata?.maxMembers
            ? parseInt(session.metadata.maxMembers)
            : undefined;
        const activation = buildLicenseActivation(planType, maxMembers);

        if (!licenseId) {
            console.error('No licenseId in session metadata');
            return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=no_license`);
        }

        // Get subscription details for expiration date
        let expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Default 30 days

        if (session.subscription && typeof session.subscription === 'object') {
            const subscription = session.subscription;
            if ('current_period_end' in subscription && subscription.current_period_end) {
                expiresAt = new Date((subscription.current_period_end as number) * 1000).toISOString();
            }
        }

        // Update the license with subscription info
        const { error: updateError } = await supabase
            .from('licenses')
            .update({
                stripe_subscription_id: typeof session.subscription === 'string'
                    ? session.subscription
                    : session.subscription?.id,
                plan_id: activation.plan_id,
                plan_type: activation.plan_type,
                max_members: activation.max_members,
                is_active: activation.is_active,
                expires_at: expiresAt,
            })
            .eq('id', licenseId);

        if (updateError) {
            console.error('Failed to update license:', updateError);
            return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=update_failed`);
        }

        if (ownerId) {
            try {
                await linkOwnerTeamsToLicense(supabase, ownerId, licenseId);
            } catch (linkError) {
                console.error('Failed to link teams to license:', linkError);
            }
        }

        // Redirect to onboarding page with success message
        return NextResponse.redirect(`${baseUrl}/dashboard/onboarding?success=true`);
    } catch (error) {
        console.error('Checkout success error:', error);
        return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=verification_failed`);
    }
}
