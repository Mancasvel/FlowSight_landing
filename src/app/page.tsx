'use client'

import HeroSection from '@/components/HeroSection'
import ProblemSection from '@/components/ProblemSection'
import SolutionSection from '@/components/SolutionSection'
import ProblemSolvedSection from '@/components/ProblemSolvedSection'
import MarketPerfectStormSection from '@/components/MarketPerfectStormSection'
import PricingSection from '@/components/PricingSection'
import ComparisonSection from '@/components/ComparisonSection'
import FaqSection from '@/components/FaqSection'
import TeamSection from '@/components/TeamSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import FinalCtaSection from '@/components/FinalCtaSection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <MarketPerfectStormSection />
      <SolutionSection />
      <ProblemSolvedSection />
      <PricingSection  />
      <ComparisonSection />
      <FaqSection />
      <TeamSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </main>
  )
}
