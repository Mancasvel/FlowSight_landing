/**
 * Server-only resolver for the latest desktop agent release.
 *
 * The landing draws binaries from two separate repos:
 *  - `Mancasvel/FlowSight.AI`    → Windows + macOS
 *  - `Mancasvel/FlowSight_linux` → Linux (.deb + AppImage)
 *
 * We fan out both Releases API calls in parallel and cache each response for
 * 1h via Next's Data Cache. New releases in either repo propagate to visitors
 * within the cache window without needing a redeploy.
 *
 * Transitional behavior: while the Linux repo has no releases yet, we fall
 * back to the main repo's last-known-good Linux binaries so the Linux buttons
 * never disappear. The fallback becomes dormant the moment `FlowSight_linux`
 * publishes its first release that ships a `.deb` or `.AppImage`.
 *
 * Env knobs:
 * - `NEXT_PUBLIC_AGENT_RELEASE_TAG`       — pin Win/Mac to a specific tag.
 * - `NEXT_PUBLIC_AGENT_LINUX_RELEASE_TAG` — pin Linux to a specific tag.
 * - `GITHUB_TOKEN`                        — authenticated rate limit (5k/h).
 */

import {
  FLOWSIGHT_DESKTOP_REPO,
  FLOWSIGHT_LINUX_REPO,
  FALLBACK_DESKTOP_RELEASE_TAG,
  FALLBACK_LINUX_RELEASE_TAG,
  FALLBACK_AGENT_VERSION,
  buildFallbackAgentRelease,
  type AgentDownloadUrls,
  type AgentRelease,
} from './downloads'

export const AGENT_RELEASE_REVALIDATE_SECONDS = 3600

type GithubAsset = { name: string; browser_download_url: string }
type GithubRelease = {
  tag_name: string
  draft: boolean
  prerelease: boolean
  published_at: string
  assets?: GithubAsset[]
}

/** Fan-in: a partial platform slice produced by one of the per-repo resolvers. */
type ReleaseSlice = {
  tag: string
  version?: string
  urls: AgentDownloadUrls
}

// ---------- shared helpers ---------------------------------------------------

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'flowsight-landing',
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return headers
}

async function fetchReleases(repo: string): Promise<GithubRelease[]> {
  const response = await fetch(
    `https://api.github.com/repos/${repo}/releases?per_page=30`,
    {
      headers: githubHeaders(),
      next: {
        revalidate: AGENT_RELEASE_REVALIDATE_SECONDS,
        tags: ['github-releases', `github-releases:${repo}`],
      },
    }
  )
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} for ${repo}`)
  }
  return (await response.json()) as GithubRelease[]
}

function sortedStableReleases(releases: GithubRelease[]): GithubRelease[] {
  return releases
    .filter((r) => !r.draft && !r.prerelease)
    .sort(
      (a, b) =>
        new Date(b.published_at).getTime() -
        new Date(a.published_at).getTime()
    )
}

function parseAgentVersion(assetName: string): string | undefined {
  // Tauri default naming: <product>_<semver>_<arch>.<ext>
  const match = assetName.match(/_(\d+\.\d+\.\d+)_/)
  return match?.[1]
}

// ---------- desktop (Windows + macOS) ---------------------------------------

const DESKTOP_MATCHERS: ReadonlyArray<{
  key: keyof AgentDownloadUrls
  test: (name: string) => boolean
}> = [
  { key: 'windowsExe', test: (n) => n.endsWith('_x64-setup.exe') },
  { key: 'windowsMsi', test: (n) => n.endsWith('_x64_en-US.msi') },
  { key: 'macDmgAarch64', test: (n) => n.endsWith('_aarch64.dmg') },
]

async function resolveDesktopSlice(): Promise<ReleaseSlice> {
  const pinnedTag = process.env.NEXT_PUBLIC_AGENT_RELEASE_TAG
  try {
    const releases = await fetchReleases(FLOWSIGHT_DESKTOP_REPO)
    const candidates = sortedStableReleases(releases)

    const release = pinnedTag
      ? candidates.find((r) => r.tag_name === pinnedTag)
      : candidates.find((r) =>
          (r.assets ?? []).some((a) =>
            DESKTOP_MATCHERS.some((m) => m.test(a.name))
          )
        )
    if (!release) {
      throw new Error(
        pinnedTag
          ? `pinned desktop tag ${pinnedTag} not found`
          : 'no desktop release ships Windows/macOS assets'
      )
    }

    const urls: AgentDownloadUrls = {}
    let version: string | undefined
    for (const asset of release.assets ?? []) {
      for (const matcher of DESKTOP_MATCHERS) {
        if (matcher.test(asset.name)) {
          urls[matcher.key] = asset.browser_download_url
          version ??= parseAgentVersion(asset.name)
        }
      }
    }

    return { tag: release.tag_name, version, urls }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn(
      `[downloads.server] Desktop resolver falling back to ${FALLBACK_DESKTOP_RELEASE_TAG} (${message}).`
    )
    const fallback = buildFallbackAgentRelease()
    return {
      tag: fallback.desktopTag,
      version: fallback.version,
      urls: {
        windowsExe: fallback.downloadUrls.windowsExe,
        windowsMsi: fallback.downloadUrls.windowsMsi,
        macDmgAarch64: fallback.downloadUrls.macDmgAarch64,
      },
    }
  }
}

// ---------- linux (separate repo) -------------------------------------------

/**
 * Linux asset matchers are intentionally generic: the new `FlowSight_linux`
 * repo may not follow the `FlowSight.Agent_*` filename convention of the main
 * repo, so we key off extension alone. Prefer amd64 variants when several
 * architectures are published, falling back to the first matching asset.
 */
function pickLinuxAsset(
  assets: GithubAsset[],
  extension: '.deb' | '.AppImage'
): string | undefined {
  const matches = assets.filter((a) => a.name.endsWith(extension))
  if (matches.length === 0) return undefined
  return (
    matches.find((a) => /amd64|x86_64|x64/i.test(a.name))?.browser_download_url
    ?? matches[0].browser_download_url
  )
}

async function resolveLinuxSlice(): Promise<ReleaseSlice | null> {
  const pinnedTag = process.env.NEXT_PUBLIC_AGENT_LINUX_RELEASE_TAG
  try {
    const releases = await fetchReleases(FLOWSIGHT_LINUX_REPO)
    const candidates = sortedStableReleases(releases)

    const release = pinnedTag
      ? candidates.find((r) => r.tag_name === pinnedTag)
      : candidates.find((r) =>
          (r.assets ?? []).some(
            (a) => a.name.endsWith('.deb') || a.name.endsWith('.AppImage')
          )
        )
    if (!release) return null

    const assets = release.assets ?? []
    const linuxDeb = pickLinuxAsset(assets, '.deb')
    const linuxAppImage = pickLinuxAsset(assets, '.AppImage')

    if (!linuxDeb && !linuxAppImage) return null

    const version =
      assets
        .map((a) => parseAgentVersion(a.name))
        .find((v): v is string => Boolean(v))

    return {
      tag: release.tag_name,
      version,
      urls: { linuxDeb, linuxAppImage },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn(
      `[downloads.server] Linux resolver unavailable, using main-repo fallback (${message}).`
    )
    return null
  }
}

// ---------- public entrypoint -----------------------------------------------

/**
 * Merge the per-platform slices into a single `AgentRelease`.
 * Linux slice missing → transparently backfill from main-repo fallback.
 */
export async function getLatestAgentRelease(): Promise<AgentRelease> {
  const [desktop, linux] = await Promise.all([
    resolveDesktopSlice(),
    resolveLinuxSlice(),
  ])

  const version =
    desktop.version ?? linux?.version ?? FALLBACK_AGENT_VERSION

  if (linux) {
    return {
      version,
      desktopTag: desktop.tag,
      linuxTag: linux.tag,
      downloadUrls: { ...desktop.urls, ...linux.urls },
    }
  }

  // Transitional path: FlowSight_linux hasn't cut a release yet (or all assets
  // are non-Linux). Reuse the main-repo's last-known-good Linux binaries so
  // the Linux buttons stay functional. Flip over automatically once the Linux
  // repo publishes its first .deb/.AppImage release.
  const fallback = buildFallbackAgentRelease(
    desktop.tag,
    FALLBACK_LINUX_RELEASE_TAG,
    version
  )
  return {
    version,
    desktopTag: desktop.tag,
    linuxTag: FALLBACK_LINUX_RELEASE_TAG,
    downloadUrls: {
      ...desktop.urls,
      linuxDeb: fallback.downloadUrls.linuxDeb,
      linuxAppImage: fallback.downloadUrls.linuxAppImage,
    },
  }
}
