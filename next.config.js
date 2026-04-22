/** @type {import('next').NextConfig} */

const DEFAULT_AGENT_RELEASE_TAG = 'v1.0.1'
const FLOWSIGHT_REPO = 'Mancasvel/FlowSight.AI'
const AGENT_ASSET_PREFIX = 'FlowSight.Agent_'

/**
 * Find the newest non-draft, non-prerelease GitHub release that ships the
 * desktop agent installers. We can't blindly point to `/releases/latest/…`
 * because a tag can be flagged "Latest" without publishing binaries (e.g.
 * docs-only releases), in which case those URLs 404. Bakes the tag into
 * `NEXT_PUBLIC_AGENT_RELEASE_TAG` at build time so the client bundle stays
 * static and never hits GitHub at runtime.
 */
async function resolveLatestAgentReleaseTag() {
  const override = process.env.NEXT_PUBLIC_AGENT_RELEASE_TAG
  if (override) {
    return override
  }

  try {
    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'flowsight-landing-build',
    }
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const res = await fetch(
      `https://api.github.com/repos/${FLOWSIGHT_REPO}/releases?per_page=30`,
      { headers }
    )
    if (!res.ok) {
      throw new Error(`GitHub API responded ${res.status}`)
    }

    const releases = await res.json()
    const match = releases
      .filter((r) => !r.draft && !r.prerelease)
      .sort(
        (a, b) => new Date(b.published_at) - new Date(a.published_at)
      )
      .find((r) =>
        (r.assets || []).some((asset) =>
          asset.name.startsWith(AGENT_ASSET_PREFIX)
        )
      )

    if (!match) {
      throw new Error('no published release ships FlowSight.Agent_* assets')
    }

    console.log(
      `[next.config] Using FlowSight agent release tag ${match.tag_name}`
    )
    return match.tag_name
  } catch (err) {
    console.warn(
      `[next.config] Could not resolve latest agent release tag (${err?.message ?? err}). Falling back to ${DEFAULT_AGENT_RELEASE_TAG}.`
    )
    return DEFAULT_AGENT_RELEASE_TAG
  }
}

module.exports = async () => {
  const agentReleaseTag = await resolveLatestAgentReleaseTag()

  /** @type {import('next').NextConfig} */
  const config = {
    turbopack: {
      root: __dirname,
    },
    serverExternalPackages: ['mongoose', 'mongodb'],
    experimental: {
      optimizePackageImports: [
        'lucide-react',
        'framer-motion',
        'recharts',
        '@supabase/supabase-js',
      ],
    },
    env: {
      NEXT_PUBLIC_AGENT_RELEASE_TAG: agentReleaseTag,
    },
  }

  return config
}
