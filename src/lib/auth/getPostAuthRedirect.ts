/**
 * Resolves where to send the user after a successful sign-in or sign-up.
 * Supports invite return URLs and pricing plan deep links from marketing CTAs.
 */
export function getPostAuthRedirect(searchParams: URLSearchParams): string {
    const returnTo = searchParams.get('returnTo');
    if (returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')) {
        return returnTo;
    }

    const plan = searchParams.get('plan');
    if (plan) {
        return `/dashboard/pricing?plan=${encodeURIComponent(plan)}`;
    }

    return '/dashboard';
}

export function getAuthCallbackUrl(searchParams: URLSearchParams): string {
    const next = getPostAuthRedirect(searchParams);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
}
