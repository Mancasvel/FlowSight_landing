import Stripe from 'stripe';
import { getRequiredStripeSecretKey } from '@/lib/stripeConfig';

let stripeInstance: Stripe | undefined;

function createStripeClient(): Stripe {
    return new Stripe(getRequiredStripeSecretKey(), {
        // @ts-ignore - bypassing strict version check to accommodate latest SDK in 2026 context
        apiVersion: '2026-01-28.clover',
        typescript: true,
    });
}

/** Lazy Stripe client — validated on first API use, not at module import during build. */
export function getStripeClient(): Stripe {
    if (!stripeInstance) {
        stripeInstance = createStripeClient();
    }
    return stripeInstance;
}

export const stripe = new Proxy({} as Stripe, {
    get(_target, prop) {
        const client = getStripeClient();
        const value = client[prop as keyof Stripe];
        return typeof value === 'function' ? value.bind(client) : value;
    },
});
