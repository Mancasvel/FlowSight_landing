import { PLANS, type PlanId, getStripePriceId } from '@/lib/plans';
import { isConfiguredStripePriceId } from '@/lib/stripeConfig';
import { PricingClient, type PricingPlanView } from './PricingClient';

const CHECKOUT_PLAN_IDS: PlanId[] = ['individual_pro', 'teams_simple', 'teams_pro', 'enterprise'];

const PLAN_FEATURES: Record<(typeof CHECKOUT_PLAN_IDS)[number], string[]> = {
    individual_pro: [
        '150 AI coach prompts / month',
        'Personal weekly PDF digest',
        '90 days cloud history',
        'Proactive dashboard insights',
        'Priority email support',
    ],
    teams_simple: [
        'Up to 10 team members',
        '50 admin coach prompts / month',
        'Shared team reports',
        'Basic weekly email report',
        '90 days data retention',
    ],
    teams_pro: [
        '250 coach prompts / seat + 500 team pool',
        'Weekly executive report (email + AI narrative)',
        'Burnout & meeting overload alerts',
        '365 days data retention',
        'Priority support (< 8h)',
    ],
    enterprise: [
        '500 prompts / seat + 2000 team pool',
        'White-label weekly reports',
        'SSO (SAML) & audit trails',
        'Unlimited data retention',
        'Dedicated success engineer',
    ],
};

function buildPricingPlans(): PricingPlanView[] {
    return CHECKOUT_PLAN_IDS.map((id) => {
        const plan = PLANS[id];
        const priceId = getStripePriceId(id);

        return {
            id,
            name: plan.name,
            price: plan.priceEur,
            maxMembers: plan.maxMembers,
            popular: id === 'teams_pro',
            features: PLAN_FEATURES[id],
            checkoutAvailable: isConfiguredStripePriceId(priceId),
        };
    });
}

export default function DashboardPricingPage() {
    const plans = buildPricingPlans();
    const checkoutConfigured = plans.some((plan) => plan.checkoutAvailable);

    return <PricingClient plans={plans} checkoutConfigured={checkoutConfigured} />;
}
