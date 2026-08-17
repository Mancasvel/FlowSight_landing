import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import {
  GITHUB_RELEASES_CACHE_TAG,
  getLatestAgentRelease,
} from '@/lib/downloads.server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function authorizeCron(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET) return true
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}

/**
 * Hourly: purge the GitHub Releases Data Cache and re-resolve Windows / macOS /
 * Linux independently so a new tag on any repo is linked without a redeploy.
 */
export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidateTag(GITHUB_RELEASES_CACHE_TAG, 'max')
  revalidatePath('/')
  revalidatePath('/pricing')
  revalidatePath('/about')

  const release = await getLatestAgentRelease({ forceRefresh: true })

  return NextResponse.json({
    ok: true,
    refreshedAt: new Date().toISOString(),
    platforms: {
      windows: {
        tag: release.desktopTag,
        version: release.version,
        hasAssets: Boolean(release.downloadUrls.windowsExe || release.downloadUrls.windowsMsi),
      },
      macos: {
        tag: release.macTag,
        version: release.macVersion ?? release.version,
        hasAssets: Boolean(release.downloadUrls.macDmgAarch64 || release.downloadUrls.macDmgX64),
      },
      linux: {
        tag: release.linuxTag,
        version: release.linuxVersion ?? release.version,
        hasAssets: Boolean(release.downloadUrls.linuxDeb || release.downloadUrls.linuxAppImage),
      },
    },
  })
}
