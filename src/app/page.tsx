import type { Metadata } from 'next'
import { Hero } from '@/components/Hero'
import { TrustBar } from '@/components/TrustBar'
import { UseCases } from '@/components/UseCases'
import { FlowSection } from '@/components/FlowSection'
import { DownloadSection } from '@/components/DownloadSection'
import { ComparisonTable } from '@/components/ComparisonTable'
import { Pricing } from '@/components/Pricing'
import { FinalCTA } from '@/components/FinalCTA'
import { absoluteUrl, siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Task visibility without employee surveillance',
  description: siteConfig.description,
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    url: absoluteUrl('/'),
    title: `${siteConfig.name} — Task visibility without employee surveillance`,
    description: siteConfig.description,
  },
}

export default function Home() {
  return (
    <main className="min-h-screen font-sans selection:bg-cyan-100 selection:text-cyan-900">
      <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-secondary-navy">
          <span>Flow<span className="text-primary-teal">Sight</span></span>
        </div>
        <div className="flex gap-6 items-center text-sm font-medium text-secondary-navy/70">
          <a href="#how-it-works" className="hidden md:block hover:text-primary-cyan transition-colors">How it works</a>
          <a href="#privacy" className="hidden md:block hover:text-primary-cyan transition-colors">Privacy</a>
          <a href="/blog" className="hidden md:block hover:text-primary-cyan transition-colors">Blog</a>
          <a
            href="/login"
            className="px-4 py-2 rounded-lg border border-secondary-navy/30 hover:border-primary-teal hover:text-primary-teal transition-all"
          >
            Login
          </a>
        </div>
      </nav>

      <Hero />
      <TrustBar />
      <UseCases />
      <FlowSection />
      <DownloadSection />
      <ComparisonTable />
      <Pricing />
      <FinalCTA />
    </main>
  );
}
