import type { Metadata } from 'next'
import { RedesignHero } from '@/components/redesign/RedesignHero'
import { FeatureTriad } from '@/components/redesign/FeatureTriad'
import { YoursForever } from '@/components/redesign/YoursForever'
import { AudiencePlatforms } from '@/components/redesign/AudiencePlatforms'
import { ClosingCTA } from '@/components/redesign/ClosingCTA'
import { DownloadSection } from '@/components/DownloadSection'
import { Pricing } from '@/components/Pricing'
import { DownloadActionsProvider } from '@/context/DownloadActionsContext'
import { getLatestAgentRelease } from '@/lib/downloads.server'
import Link from 'next/link'
import { Lock } from 'lucide-react'

import { absoluteUrl, siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy-first AI for high performers · cognitive health & deep focus',
  description: siteConfig.description,
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    url: absoluteUrl('/'),
    title: `${siteConfig.name} · Protect your focus. Understand your patterns.`,
    description: siteConfig.description,
  },
}

export default async function Home() {
  const release = await getLatestAgentRelease()

  return (
    <DownloadActionsProvider release={release}>
      <main className="relative min-h-screen bg-white font-sans selection:bg-cyan-100 selection:text-cyan-900 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] [background-size:32px_32px]">
        <header className="fixed top-0 left-0 z-50 w-full border-b border-slate-200/60 bg-white/70 px-6 py-4 backdrop-blur-md">
          <div className="relative mx-auto flex max-w-7xl items-center justify-between">
            <div className="text-lg font-bold tracking-tighter text-secondary-navy">
              Flow<span className="text-primary-teal">Sight</span>
            </div>

            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1.5 text-xs font-medium text-slate-400 md:flex">
              <Lock className="h-3 w-3" aria-hidden />
              <span>privacy-first, local, yours forever</span>
            </div>

            <Link
              href="/login"
              className="rounded-full bg-gradient-to-r from-primary-cyan to-primary-teal px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-primary-teal hover:to-primary-cyan hover:shadow-lg"
            >
              Sign in
            </Link>
          </div>
        </header>

        <RedesignHero />
        <FeatureTriad />
        <DownloadSection release={release} />
        <YoursForever />
        <AudiencePlatforms />
        <Pricing />
        <ClosingCTA />
      </main>
    </DownloadActionsProvider>
  );
}
