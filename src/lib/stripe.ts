import Stripe from 'stripe';
import { getRequiredStripeSecretKey } from '@/lib/stripeConfig';

export const stripe = new Stripe(getRequiredStripeSecretKey(), {
    // @ts-ignore - bypassing strict version check to accommodate latest SDK in 2026 context
    apiVersion: '2026-01-28.clover',
    typescript: true,
});
