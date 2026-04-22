/**
 * Client-safe metadata + types for the desktop agent downloads.
 *
 * Actual URLs are resolved at request time by `downloads.server.ts`, which
 * queries the GitHub Releases API and caches for 1h via Next's Data Cache.
 * This module stays import-safe from both server and client components, and
 * provides a static fallback used when the live fetch is unavailable (offline
 * build, rate-limited CI, etc.).
 */

export const GITHUB_REPO = 'Mancasvel/FlowSight.AI' as const

export const releasesUrl =
  `https://github.com/${GITHUB_REPO}/releases` as const

/** Last-known-good values, used only as an offline fallback. */
export const FALLBACK_AGENT_RELEASE_TAG = 'v1.0.1' as const
export const FALLBACK_AGENT_VERSION = '0.1.0' as const

export type AgentDownloadUrls = {
  windowsExe?: string
  windowsMsi?: string
  macDmgAarch64?: string
  linuxDeb?: string
  linuxAppImage?: string
}

export type AgentRelease = {
  /** GitHub release tag that currently hosts the binaries (e.g. "v1.0.1"). */
  tag: string
  /** Tauri bundle version embedded in the artifact filenames (e.g. "0.1.0"). */
  version: string
  /** Direct `browser_download_url`s for each platform artifact. */
  downloadUrls: AgentDownloadUrls
}

/**
 * Build a fully-formed release descriptor pointing at a specific tag/version
 * using our known filename convention. Used as the offline fallback when the
 * GitHub API is unreachable.
 */
export function buildFallbackAgentRelease(
  tag: string = FALLBACK_AGENT_RELEASE_TAG,
  version: string = FALLBACK_AGENT_VERSION
): AgentRelease {
  const at = (filename: string) =>
    `https://github.com/${GITHUB_REPO}/releases/download/${tag}/${filename}`

  return {
    tag,
    version,
    downloadUrls: {
      windowsExe: at(`FlowSight.Agent_${version}_x64-setup.exe`),
      windowsMsi: at(`FlowSight.Agent_${version}_x64_en-US.msi`),
      macDmgAarch64: at(`FlowSight.Agent_${version}_aarch64.dmg`),
      linuxDeb: at(`FlowSight.Agent_${version}_amd64.deb`),
      linuxAppImage: at(`FlowSight.Agent_${version}_amd64.AppImage`),
    },
  }
}
