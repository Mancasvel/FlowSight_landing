'use client'

import HeroSection from '@/components/HeroSection'
import ProblemSection from '@/components/ProblemSection'
import SolutionSection from '@/components/SolutionSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import ProblemSolvedSection from '@/components/ProblemSolvedSection'
import TractionSection from '@/components/TractionSection'
import WhyNowSection from '@/components/WhyNowSection'
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
      <SolutionSection />
      <HowItWorksSection />
      <ProblemSolvedSection />
      <TractionSection />
      <WhyNowSection />
      <PricingSection id="pricing" />
      <ComparisonSection />
      <FaqSection />
      <TeamSection id="team" />
      <TestimonialsSection />
      <FinalCtaSection />
    </main>
  )
}
