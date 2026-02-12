import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // @ts-ignore - bypassing strict version check to accommodate latest SDK in 2026 context
    apiVersion: '2026-01-28.clover',
    typescript: true,
});
