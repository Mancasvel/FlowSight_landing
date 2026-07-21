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
 * Transitional behavior removed: Linux binaries always come from
 * `Mancasvel/FlowSight_linux`. If the live fetch fails, we fall back to
 * last-known-good URLs on that repo only — never the desktop repo.
 *
 * Env knobs:
 * - `NEXT_PUBLIC_AGENT_RELEASE_TAG`      , pin Win/Mac to a specific tag.
 * - `NEXT_PUBLIC_AGENT_LINUX_RELEASE_TAG`, pin Linux to a specific tag.
 * - `GITHUB_TOKEN`                       , authenticated rate limit (5k/h).
 */

import {
  FLOWSIGHT_DESKTOP_REPO,
  FLOWSIGHT_LINUX_REPO,
  FALLBACK_DESKTOP_RELEASE_TAG,
  FALLBACK_LINUX_RELEASE_TAG,
  FALLBACK_AGENT_VERSION,
  FALLBACK_LINUX_VERSION,
  linuxReleasesUrl,
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
  body?: string
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

function linuxAssetKind(name: string): '.deb' | '.AppImage' | null {
  const lower = name.toLowerCase()
  if (lower.endsWith('.deb')) return '.deb'
  if (lower.endsWith('.appimage')) return '.AppImage'
  return null
}

// ---------- desktop (Windows + macOS) ---------------------------------------

/** Windows/macOS may ship from the main repo or the Linux repo during migration. */
const DESKTOP_RELEASE_REPOS = [FLOWSIGHT_DESKTOP_REPO, FLOWSIGHT_LINUX_REPO] as const

const DESKTOP_MATCHERS: ReadonlyArray<{
  key: keyof AgentDownloadUrls
  test: (name: string) => boolean
}> = [
  { key: 'windowsExe', test: (n) => /_x64-setup\.exe$/i.test(n) },
  { key: 'windowsMsi', test: (n) => /_x64_en-US\.msi$/i.test(n) },
  { key: 'macDmgAarch64', test: (n) => /_aarch64\.dmg$/i.test(n) },
]

function compareSemverTags(a: string, b: string): number {
  const parse = (tag: string): [number, number, number] => {
    const match = tag.replace(/^v/i, '').match(/^(\d+)\.(\d+)\.(\d+)/)
    if (!match) return [0, 0, 0]
    return [Number(match[1]), Number(match[2]), Number(match[3])]
  }
  const left = parse(a)
  const right = parse(b)
  for (let i = 0; i < 3; i++) {
    if (left[i] !== right[i]) return left[i] - right[i]
  }
  return 0
}

function sliceFromDesktopRelease(release: GithubRelease): ReleaseSlice | null {
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
  if (!urls.windowsExe && !urls.windowsMsi && !urls.macDmgAarch64) return null
  return {
    tag: release.tag_name,
    version: version ?? release.tag_name.replace(/^v/i, ''),
    urls,
  }
}

function pickBestDesktopRelease(releases: GithubRelease[]): GithubRelease | undefined {
  const byTag = new Map<string, GithubRelease>()
  for (const release of releases) {
    const existing = byTag.get(release.tag_name)
    if (
      !existing ||
      new Date(release.published_at).getTime() >
        new Date(existing.published_at).getTime()
    ) {
      byTag.set(release.tag_name, release)
    }
  }

  return [...byTag.values()].sort(
    (a, b) =>
      compareSemverTags(b.tag_name, a.tag_name) ||
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  )[0]
}

async function collectDesktopReleaseCandidates(): Promise<GithubRelease[]> {
  const perRepo = await Promise.all(
    DESKTOP_RELEASE_REPOS.map(async (repo) => {
      const [latest, releases] = await Promise.all([
        fetchLatestRelease(repo),
        fetchReleases(repo),
      ])
      return { latest, releases: sortedStableReleases(releases) }
    })
  )

  const candidates: GithubRelease[] = []
  for (const { latest, releases } of perRepo) {
    if (latest && !latest.draft && !latest.prerelease) {
      candidates.push(latest)
    }
    candidates.push(...releases)
  }
  return candidates.filter((release) => sliceFromDesktopRelease(release) !== null)
}

async function resolveDesktopSlice(): Promise<ReleaseSlice> {
  const pinnedTag = process.env.NEXT_PUBLIC_AGENT_RELEASE_TAG
  try {
    const candidates = await collectDesktopReleaseCandidates()

    const release = pinnedTag
      ? candidates.find((r) => r.tag_name === pinnedTag)
      : pickBestDesktopRelease(candidates)
    if (!release) {
      throw new Error(
        pinnedTag
          ? `pinned desktop tag ${pinnedTag} not found with Win/Mac assets`
          : 'no desktop release ships Windows/macOS assets'
      )
    }

    const slice = sliceFromDesktopRelease(release)
    if (!slice) {
      throw new Error(`release ${release.tag_name} has no Win/Mac assets`)
    }
    return slice
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
  const matches = assets.filter((a) => linuxAssetKind(a.name) === extension)
  if (matches.length === 0) return undefined
  return (
    matches.find((a) => /amd64|x86_64|x64/i.test(a.name))?.browser_download_url
    ?? matches[0].browser_download_url
  )
}

function sliceFromRelease(release: GithubRelease): ReleaseSlice | null {
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
}

async function fetchLatestRelease(repo: string): Promise<GithubRelease | null> {
  const response = await fetch(
    `https://api.github.com/repos/${repo}/releases/latest`,
    {
      headers: githubHeaders(),
      next: {
        revalidate: AGENT_RELEASE_REVALIDATE_SECONDS,
        tags: ['github-releases', `github-releases:${repo}`, 'github-releases:latest'],
      },
    }
  )
  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} for ${repo}/releases/latest`)
  }
  return (await response.json()) as GithubRelease
}

function emptyLinuxSlice(tag: string, version?: string): ReleaseSlice {
  return {
    tag,
    version: version ?? FALLBACK_LINUX_VERSION,
    urls: {},
  }
}

async function resolveLinuxSlice(): Promise<ReleaseSlice> {
  const pinnedTag = process.env.NEXT_PUBLIC_AGENT_LINUX_RELEASE_TAG
  try {
    if (pinnedTag) {
      const releases = await fetchReleases(FLOWSIGHT_LINUX_REPO)
      const release = sortedStableReleases(releases).find((r) => r.tag_name === pinnedTag)
      if (!release) {
        throw new Error(`pinned Linux tag ${pinnedTag} not found on ${FLOWSIGHT_LINUX_REPO}`)
      }
      const slice = sliceFromRelease(release)
      if (slice) return slice
      console.warn(
        `[downloads.server] Linux tag ${pinnedTag} exists on ${FLOWSIGHT_LINUX_REPO} but has no .deb/.AppImage assets yet.`
      )
      return emptyLinuxSlice(release.tag_name)
    }

    const latest = await fetchLatestRelease(FLOWSIGHT_LINUX_REPO)
    if (latest && !latest.draft) {
      const slice = sliceFromRelease(latest)
      if (slice) return slice
      console.warn(
        `[downloads.server] Latest Linux release ${latest.tag_name} on ${FLOWSIGHT_LINUX_REPO} has no .deb/.AppImage assets yet.`
      )
      return emptyLinuxSlice(latest.tag_name)
    }

    const releases = await fetchReleases(FLOWSIGHT_LINUX_REPO)
    const candidates = sortedStableReleases(releases)
    for (const release of candidates) {
      const slice = sliceFromRelease(release)
      if (slice) return slice
    }

    throw new Error(`no Linux release ships .deb/.AppImage on ${FLOWSIGHT_LINUX_REPO}`)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn(
      `[downloads.server] Linux resolver could not load assets from ${FLOWSIGHT_LINUX_REPO} (${message}).`
    )
    return emptyLinuxSlice(FALLBACK_LINUX_RELEASE_TAG)
  }
}

// ---------- updater (Tauri v2 manifest source) ------------------------------

/**
 * Raw view of the latest stable desktop release, used by the Tauri updater
 * endpoint. Unlike `getLatestAgentRelease`, this keeps the full asset list so
 * the updater route can locate both the update bundle (`*.nsis.zip`,
 * `*.app.tar.gz`, `*.AppImage.tar.gz`) and its sibling `*.sig` file.
 */
export type DesktopReleaseAssets = {
  tag: string
  version: string
  publishedAt: string
  notes: string
  assets: GithubAsset[]
}

/**
 * Resolve the newest stable desktop release that ships updater artifacts.
 * Returns `null` when none is available (no network, no signed bundles, etc.),
 * so the caller can answer the updater with a 204 (= "no update").
 */
export async function getDesktopUpdaterRelease(): Promise<DesktopReleaseAssets | null> {
  const pinnedTag = process.env.NEXT_PUBLIC_AGENT_RELEASE_TAG
  try {
    const perRepo = await Promise.all(
      DESKTOP_RELEASE_REPOS.map(async (repo) =>
        sortedStableReleases(await fetchReleases(repo))
      )
    )
    const sigCandidates = perRepo
      .flat()
      .filter((r) => (r.assets ?? []).some((a) => a.name.endsWith('.sig')))

    // The updater needs a release that contains at least one `.sig`; otherwise
    // signature verification on the client would fail anyway.
    const release = pinnedTag
      ? sigCandidates.find((r) => r.tag_name === pinnedTag)
      : pickBestDesktopRelease(sigCandidates)
    if (!release) return null

    const assets = release.assets ?? []
    const version =
      assets
        .map((a) => parseAgentVersion(a.name))
        .find((v): v is string => Boolean(v)) ??
      release.tag_name.replace(/^v/, '')

    return {
      tag: release.tag_name,
      version,
      publishedAt: release.published_at,
      notes: release.body ?? '',
      assets,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn(`[downloads.server] Updater resolver unavailable (${message}).`)
    return null
  }
}

// ---------- public entrypoint -----------------------------------------------

/**
 * Merge the per-platform slices into a single `AgentRelease`.
 * Linux always resolves from `Mancasvel/FlowSight_linux`.
 */
export async function getLatestAgentRelease(): Promise<AgentRelease> {
  const [desktop, linux] = await Promise.all([
    resolveDesktopSlice(),
    resolveLinuxSlice(),
  ])

  return {
    version: desktop.version ?? linux.version ?? FALLBACK_AGENT_VERSION,
    linuxVersion: linux.version ?? FALLBACK_LINUX_VERSION,
    desktopTag: desktop.tag,
    linuxTag: linux.tag,
    linuxReleaseUrl: `${linuxReleasesUrl}/tag/${linux.tag}`,
    downloadUrls: { ...desktop.urls, ...linux.urls },
  }
}
