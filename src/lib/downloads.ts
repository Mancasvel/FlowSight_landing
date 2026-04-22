/**
 * Desktop agent artifacts.
 *
 * We serve the binaries directly from GitHub Releases instead of hosting them
 * under `public/downloadables/`. This keeps the Vercel bundle small and
 * guarantees users always pull the same artifacts we publish on GitHub.
 *
 * `AGENT_RELEASE_TAG` is resolved at build time in `next.config.js`, which
 * queries the GitHub API for the newest release that actually ships the
 * `FlowSight.Agent_*` installers and injects the tag via
 * `NEXT_PUBLIC_AGENT_RELEASE_TAG`. The literal fallback below only kicks in if
 * the build-time fetch is unavailable (e.g. fully offline build); CI can also
 * pin a specific tag by setting `NEXT_PUBLIC_AGENT_RELEASE_TAG` explicitly.
 */

const GITHUB_REPO = 'Mancasvel/FlowSight.AI' as const

/** Tauri bundle version embedded in the artifact filenames. */
export const AGENT_VERSION = '0.1.0' as const

/** Resolved at build time; never read from the browser's `window`. */
export const AGENT_RELEASE_TAG: string =
  process.env.NEXT_PUBLIC_AGENT_RELEASE_TAG || 'v1.0.1'

const releaseAsset = (filename: string) =>
  `https://github.com/${GITHUB_REPO}/releases/download/${AGENT_RELEASE_TAG}/${filename}`

export const downloadUrls = {
  windowsExe: releaseAsset(`FlowSight.Agent_${AGENT_VERSION}_x64-setup.exe`),
  windowsMsi: releaseAsset(`FlowSight.Agent_${AGENT_VERSION}_x64_en-US.msi`),
  macDmgAarch64: releaseAsset(`FlowSight.Agent_${AGENT_VERSION}_aarch64.dmg`),
  linuxDeb: releaseAsset(`FlowSight.Agent_${AGENT_VERSION}_amd64.deb`),
  linuxAppImage: releaseAsset(`FlowSight.Agent_${AGENT_VERSION}_amd64.AppImage`),
} as const

export const releasesUrl = `https://github.com/${GITHUB_REPO}/releases` as const
