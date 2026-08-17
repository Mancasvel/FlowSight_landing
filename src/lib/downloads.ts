/**
 * Client-safe metadata + types for the desktop agent downloads.
 *
 * The landing pulls binaries from three separate GitHub repositories:
 *  - `FLOWSIGHT_DESKTOP_REPO` (`Mancasvel/FlowSight.AI`), Windows.
 *  - `FLOWSIGHT_MAC_REPO`     (`Mancasvel/FlowSight_Mac`), macOS (.dmg).
 *  - `FLOWSIGHT_LINUX_REPO`   (`Mancasvel/FlowSight_linux`), Linux (.deb + AppImage).
 *
 * Actual URLs are resolved at request time by `downloads.server.ts`, which
 * queries the Releases APIs in parallel and caches for 1h via Next's Data
 * Cache. This module stays import-safe from both server and client components
 * and provides the offline fallback used when a live fetch is unavailable.
 */

export const FLOWSIGHT_DESKTOP_REPO = 'Mancasvel/FlowSight.AI' as const
export const FLOWSIGHT_MAC_REPO = 'Mancasvel/FlowSight_Mac' as const
export const FLOWSIGHT_LINUX_REPO = 'Mancasvel/FlowSight_linux' as const

export const desktopReleasesUrl =
  `https://github.com/${FLOWSIGHT_DESKTOP_REPO}/releases` as const
export const macReleasesUrl =
  `https://github.com/${FLOWSIGHT_MAC_REPO}/releases` as const
export const linuxReleasesUrl =
  `https://github.com/${FLOWSIGHT_LINUX_REPO}/releases` as const

/** Kept for back-compat with any external link that still points to the main repo. */
export const releasesUrl = desktopReleasesUrl

/**
 * Last-known-good values used only as an offline fallback.
 */
export const FALLBACK_DESKTOP_RELEASE_TAG = 'v3.6.0' as const
export const FALLBACK_MAC_RELEASE_TAG = 'v3.6.0' as const
/** Latest known tag on `Mancasvel/FlowSight_linux` (see releases/latest redirect). */
export const FALLBACK_LINUX_RELEASE_TAG = 'v3.5.0' as const
export const FALLBACK_AGENT_VERSION = '3.6.0' as const
export const FALLBACK_MAC_VERSION = '3.6.0' as const
export const FALLBACK_LINUX_VERSION = '3.5.0' as const

export type AgentDownloadUrls = {
  windowsExe?: string
  windowsMsi?: string
  macDmgAarch64?: string
  macDmgX64?: string
  linuxDeb?: string
  linuxAppImage?: string
}

export type AgentRelease = {
  /** Tauri bundle version for Windows (e.g. "3.6.0"). */
  version: string
  /** Tauri bundle version for macOS when it differs from `version`. */
  macVersion?: string
  /** Tauri bundle version for Linux when it differs from `version`. */
  linuxVersion?: string
  /** GitHub tag hosting the Windows binaries. */
  desktopTag: string
  /** GitHub tag hosting the macOS binaries (may differ from `desktopTag`). */
  macTag: string
  /** GitHub tag hosting the Linux binaries (may differ from `desktopTag`). */
  linuxTag: string
  /** Direct link to the macOS release page on GitHub (used when assets are not yet attached). */
  macReleaseUrl: string
  /** Direct link to the Linux release page on GitHub (used when assets are not yet attached). */
  linuxReleaseUrl: string
  /** Direct `browser_download_url`s for each platform artifact. */
  downloadUrls: AgentDownloadUrls
}

function githubReleaseAsset(repo: string, tag: string, filename: string): string {
  return `https://github.com/${repo}/releases/download/${tag}/${filename}`
}

/**
 * Build a fully-formed release descriptor pointing at known GitHub release
 * filenames. Used as the offline fallback when live fetches fail.
 */
export function buildFallbackAgentRelease(
  desktopTag: string = FALLBACK_DESKTOP_RELEASE_TAG,
  linuxTag: string = FALLBACK_LINUX_RELEASE_TAG,
  version: string = FALLBACK_AGENT_VERSION,
  linuxVersion: string = FALLBACK_LINUX_VERSION,
  macTag: string = FALLBACK_MAC_RELEASE_TAG,
  macVersion: string = FALLBACK_MAC_VERSION
): AgentRelease {
  return {
    version,
    macVersion,
    linuxVersion,
    desktopTag,
    macTag,
    linuxTag,
    macReleaseUrl: `${macReleasesUrl}/tag/${macTag}`,
    linuxReleaseUrl: `${linuxReleasesUrl}/tag/${linuxTag}`,
    downloadUrls: {
      windowsExe: githubReleaseAsset(
        FLOWSIGHT_DESKTOP_REPO,
        desktopTag,
        `FlowSight.Agent_${version}_x64-setup.exe`
      ),
      windowsMsi: githubReleaseAsset(
        FLOWSIGHT_DESKTOP_REPO,
        desktopTag,
        `FlowSight.Agent_${version}_x64_en-US.msi`
      ),
      macDmgAarch64: githubReleaseAsset(
        FLOWSIGHT_MAC_REPO,
        macTag,
        `FlowSight.Agent_${macVersion}_aarch64.dmg`
      ),
    },
  }
}
