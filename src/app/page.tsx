import type { Metadata } from 'next'
import { RedesignHero } from '@/components/redesign/RedesignHero'
import { FeatureTriad } from '@/components/redesign/FeatureTriad'
import { YoursForever } from '@/components/redesign/YoursForever'
import { AudiencePlatforms } from '@/components/redesign/AudiencePlatforms'
import { ClosingCTA } from '@/components/redesign/ClosingCTA'
import { DownloadSection } from '@/components/DownloadSection'
import { Pricing } from '@/components/Pricing'
import { Lock, Menu } from 'lucide-react'

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

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white font-sans selection:bg-cyan-100 selection:text-cyan-900 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] [background-size:32px_32px]">
      <header className="fixed top-0 left-0 z-50 w-full border-b border-slate-200/60 bg-white/70 px-6 py-4 backdrop-blur-md">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between">
          <div className="text-lg font-bold tracking-tighter text-secondary-navy">
            Flow<span className="text-primary-teal">Sight</span>
          </div>

          {/* Centered tagline pill (mirrors Anytype top tagline) */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1.5 text-xs font-medium text-slate-400 md:flex">
            <Lock className="h-3 w-3" aria-hidden />
            <span>privacy-first, local, yours forever</span>
          </div>

          <button
            type="button"
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary-navy transition-colors hover:bg-slate-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <RedesignHero />
      <FeatureTriad />
      <DownloadSection />
      <YoursForever />
      <AudiencePlatforms />
      <Pricing />
      <ClosingCTA />

    </main>
  );
}
