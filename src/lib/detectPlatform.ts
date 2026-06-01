export type DetectedPlatform = 'windows' | 'macos' | 'linux' | 'unknown'

/** Best-effort OS detection from the browser (client-only). */
export function detectPlatform(): DetectedPlatform {
  if (typeof navigator === 'undefined') return 'unknown'

  const ua = navigator.userAgent.toLowerCase()
  const platform = (navigator.platform ?? '').toLowerCase()

  if (/win/.test(ua) || platform.includes('win')) return 'windows'
  if (/mac/.test(ua) || platform.includes('mac') || ua.includes('iphone') || ua.includes('ipad')) {
    return 'macos'
  }
  if (/linux/.test(ua) || /x11/.test(ua) || platform.includes('linux')) return 'linux'

  return 'unknown'
}

export function downloadLabelForPlatform(platform: DetectedPlatform): string {
  switch (platform) {
    case 'windows':
      return 'Download for Windows'
    case 'macos':
      return 'Notify me for macOS'
    case 'linux':
      return 'Download for Linux'
    default:
      return 'Download'
  }
}
