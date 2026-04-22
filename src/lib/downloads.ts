/**
 * Client-safe metadata + types for the desktop agent downloads.
 *
 * The landing pulls binaries from two separate GitHub repositories:
 *  - `FLOWSIGHT_DESKTOP_REPO` (`Mancasvel/FlowSight.AI`) — Windows + macOS.
 *  - `FLOWSIGHT_LINUX_REPO`   (`Mancasvel/FlowSight_linux`) — Linux (.deb + AppImage).
 *
 * Actual URLs are resolved at request time by `downloads.server.ts`, which
 * queries both Releases APIs in parallel and caches for 1h via Next's Data
 * Cache. This module stays import-safe from both server and client components
 * and provides the offline fallback used when a live fetch is unavailable.
 */

export const FLOWSIGHT_DESKTOP_REPO = 'Mancasvel/FlowSight.AI' as const
export const FLOWSIGHT_LINUX_REPO = 'Mancasvel/FlowSight_linux' as const

export const desktopReleasesUrl =
  `https://github.com/${FLOWSIGHT_DESKTOP_REPO}/releases` as const
export const linuxReleasesUrl =
  `https://github.com/${FLOWSIGHT_LINUX_REPO}/releases` as const

/** Kept for back-compat with any external link that still points to the main repo. */
export const releasesUrl = desktopReleasesUrl

/**
 * Last-known-good values used only as an offline fallback, and — transitionally —
 * as the Linux source until `FLOWSIGHT_LINUX_REPO` publishes its first release.
 */
export const FALLBACK_DESKTOP_RELEASE_TAG = 'v1.0.1' as const
export const FALLBACK_LINUX_RELEASE_TAG = 'v1.0.1' as const
export const FALLBACK_AGENT_VERSION = '0.1.0' as const

export type AgentDownloadUrls = {
  windowsExe?: string
  windowsMsi?: string
  macDmgAarch64?: string
  linuxDeb?: string
  linuxAppImage?: string
}

export type AgentRelease = {
  /** Tauri bundle version embedded in the artifact filenames (e.g. "0.1.0"). */
  version: string
  /** GitHub tag hosting the Windows + macOS binaries. */
  desktopTag: string
  /** GitHub tag hosting the Linux binaries (may differ from `desktopTag`). */
  linuxTag: string
  /** Direct `browser_download_url`s for each platform artifact. */
  downloadUrls: AgentDownloadUrls
}

/**
 * Build a fully-formed release descriptor pointing at the known main-repo
 * filename convention. Used as the offline fallback when both live fetches
 * fail. Not called in the happy path.
 */
export function buildFallbackAgentRelease(
  desktopTag: string = FALLBACK_DESKTOP_RELEASE_TAG,
  linuxTag: string = FALLBACK_LINUX_RELEASE_TAG,
  version: string = FALLBACK_AGENT_VERSION
): AgentRelease {
  const mainRepoAsset = (tag: string, filename: string) =>
    `https://github.com/${FLOWSIGHT_DESKTOP_REPO}/releases/download/${tag}/${filename}`

  return {
    version,
    desktopTag,
    linuxTag,
    downloadUrls: {
      windowsExe: mainRepoAsset(
        desktopTag,
        `FlowSight.Agent_${version}_x64-setup.exe`
      ),
      windowsMsi: mainRepoAsset(
        desktopTag,
        `FlowSight.Agent_${version}_x64_en-US.msi`
      ),
      macDmgAarch64: mainRepoAsset(
        desktopTag,
        `FlowSight.Agent_${version}_aarch64.dmg`
      ),
      linuxDeb: mainRepoAsset(
        linuxTag,
        `FlowSight.Agent_${version}_amd64.deb`
      ),
      linuxAppImage: mainRepoAsset(
        linuxTag,
        `FlowSight.Agent_${version}_amd64.AppImage`
      ),
    },
  }
}
