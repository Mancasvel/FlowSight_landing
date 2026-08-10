import Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe';

type LicenseRef = { id: string; stripe_customer_id: string | null };
type UserRef = { id: string; email?: string | null };

export function isStripeMissingCustomerError(error: unknown): boolean {
    if (!(error instanceof Stripe.errors.StripeInvalidRequestError)) {
        return false;
    }

    if (error.code === 'resource_missing') {
        return error.param === 'customer' || /no such customer/i.test(error.message);
    }

    return false;
}

async function persistStripeCustomerId(
    supabase: SupabaseClient,
    licenseId: string,
    customerId: string | null
): Promise<void> {
    await supabase.from('licenses').update({ stripe_customer_id: customerId }).eq('id', licenseId);
}

async function createStripeCustomer(
    license: LicenseRef,
    user: UserRef,
    supabase: SupabaseClient
): Promise<string> {
    const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
            userId: user.id,
            licenseId: license.id,
        },
    });

    await persistStripeCustomerId(supabase, license.id, customer.id);
    return customer.id;
}

export async function resolveOrCreateStripeCustomer(
    license: LicenseRef,
    user: UserRef,
    supabase: SupabaseClient
): Promise<string> {
    if (!license.stripe_customer_id) {
        return createStripeCustomer(license, user, supabase);
    }

    try {
        const customer = await stripe.customers.retrieve(license.stripe_customer_id);

        if ('deleted' in customer && customer.deleted) {
            await persistStripeCustomerId(supabase, license.id, null);
            return createStripeCustomer(license, user, supabase);
        }

        return license.stripe_customer_id;
    } catch (error) {
        if (!isStripeMissingCustomerError(error)) {
            throw error;
        }

        await persistStripeCustomerId(supabase, license.id, null);
        return createStripeCustomer(license, user, supabase);
    }
}
