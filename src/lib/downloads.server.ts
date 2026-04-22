/**
 * Server-only resolver for the latest desktop agent release.
 *
 * Uses Next's cached `fetch` (ISR Data Cache) so we hit the GitHub API at most
 * once per hour per deployment region. New releases go live to visitors
 * without needing a redeploy: the first request after the 1h window triggers
 * a background revalidation and subsequent visitors get the fresh data.
 *
 * Env knobs:
 * - `NEXT_PUBLIC_AGENT_RELEASE_TAG` — pin a specific tag (emergency rollback).
 * - `GITHUB_TOKEN`                  — authenticated rate limit (5k/h vs 60/h).
 */

import {
  GITHUB_REPO,
  FALLBACK_AGENT_RELEASE_TAG,
  FALLBACK_AGENT_VERSION,
  buildFallbackAgentRelease,
  type AgentDownloadUrls,
  type AgentRelease,
} from './downloads'

export const AGENT_RELEASE_REVALIDATE_SECONDS = 3600
const AGENT_ASSET_PREFIX = 'FlowSight.Agent_'

type GithubAsset = { name: string; browser_download_url: string }
type GithubRelease = {
  tag_name: string
  draft: boolean
  prerelease: boolean
  published_at: string
  assets?: GithubAsset[]
}

/** Filename-suffix → download-url-key mapping. */
const ASSET_MATCHERS: ReadonlyArray<{
  key: keyof AgentDownloadUrls
  test: (name: string) => boolean
}> = [
  { key: 'windowsExe', test: (n) => n.endsWith('_x64-setup.exe') },
  { key: 'windowsMsi', test: (n) => n.endsWith('_x64_en-US.msi') },
  { key: 'macDmgAarch64', test: (n) => n.endsWith('_aarch64.dmg') },
  { key: 'linuxDeb', test: (n) => n.endsWith('_amd64.deb') },
  { key: 'linuxAppImage', test: (n) => n.endsWith('_amd64.AppImage') },
]

function parseAgentVersion(assetName: string): string | undefined {
  const match = assetName.match(/^FlowSight\.Agent_([\d.]+)_/)
  return match?.[1]
}

function extractDownloadUrls(release: GithubRelease): {
  version: string
  downloadUrls: AgentDownloadUrls
} {
  const downloadUrls: AgentDownloadUrls = {}
  let version: string | undefined

  for (const asset of release.assets ?? []) {
    for (const matcher of ASSET_MATCHERS) {
      if (matcher.test(asset.name)) {
        downloadUrls[matcher.key] = asset.browser_download_url
        version ??= parseAgentVersion(asset.name)
      }
    }
  }

  return { version: version ?? FALLBACK_AGENT_VERSION, downloadUrls }
}

/**
 * Resolve the most recent release that publishes agent installers.
 *
 * Skips drafts, prereleases, and any release whose assets don't include the
 * `FlowSight.Agent_*` artifacts (e.g. docs/licensing-only tags like v2.0.0).
 */
export async function getLatestAgentRelease(): Promise<AgentRelease> {
  const pinnedTag = process.env.NEXT_PUBLIC_AGENT_RELEASE_TAG

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'flowsight-landing',
    }
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=30`,
      {
        headers,
        next: {
          revalidate: AGENT_RELEASE_REVALIDATE_SECONDS,
          tags: ['github-releases'],
        },
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API responded ${response.status}`)
    }

    const releases = (await response.json()) as GithubRelease[]

    const candidates = releases
      .filter((r) => !r.draft && !r.prerelease)
      .sort(
        (a, b) =>
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime()
      )

    const release = pinnedTag
      ? candidates.find((r) => r.tag_name === pinnedTag)
      : candidates.find((r) =>
          (r.assets ?? []).some((a) => a.name.startsWith(AGENT_ASSET_PREFIX))
        )

    if (!release) {
      throw new Error(
        pinnedTag
          ? `pinned tag ${pinnedTag} not found among published releases`
          : 'no published release ships FlowSight.Agent_* assets'
      )
    }

    const { version, downloadUrls } = extractDownloadUrls(release)
    return { tag: release.tag_name, version, downloadUrls }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn(
      `[downloads.server] Falling back to ${FALLBACK_AGENT_RELEASE_TAG} (${message}).`
    )
    return buildFallbackAgentRelease(pinnedTag ?? FALLBACK_AGENT_RELEASE_TAG)
  }
}
