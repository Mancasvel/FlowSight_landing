/**
 * First-party download click tracking (MongoDB via /api/analytics/click).
 * Runs on explicit download actions — independent of cookie-consent analytics.
 */
export function trackDownloadClick(key: string) {
  fetch('/api/analytics/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
    keepalive: true,
  }).catch(() => {
    /* ignore network errors */
  })
}
