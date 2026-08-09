const LOCALHOST_FALLBACK = 'http://localhost:3000';

function isLocalhostHost(host: string): boolean {
  return (
    host === 'localhost' ||
    host.startsWith('localhost:') ||
    host === '127.0.0.1' ||
    host.startsWith('127.0.0.1:')
  );
}

/** Normalize a base URL so Stripe and redirects always receive an absolute URL with a scheme. */
function ensureScheme(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!trimmed) return LOCALHOST_FALLBACK;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  const host = trimmed.split('/')[0];
  return isLocalhostHost(host) ? `http://${trimmed}` : `https://${trimmed}`;
}

/** Resolve the public app origin from env (NEXT_PUBLIC_APP_URL, VERCEL_URL, or localhost). */
export function getAppBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return ensureScheme(fromEnv);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return ensureScheme(vercel);

  return LOCALHOST_FALLBACK;
}

/** Build an absolute app URL for a path (e.g. Stripe success/cancel URLs). */
export function appUrl(path: string): string {
  const base = getAppBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
