import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlowSight - Task Visibility Without Developer Surveillance',
  description: 'Automatic task traceability powered by AI context understanding. Replace invasive time tracking and manual task updates with privacy-first architecture.',
  keywords: 'task traceability, developer productivity, AI context understanding, privacy-first, B2B SaaS, organizational intelligence',
  authors: [{ name: 'Manuel Castillejo' }],
  icons: {
    icon: '/flowsight_sinfondo.png',
    apple: '/flowsight_sinfondo.png',
  },
  openGraph: {
    title: 'FlowSight - Task Visibility Without Developer Surveillance',
    description: 'Automatic task traceability powered by AI context understanding. Replace invasive time tracking and manual task updates with privacy-first architecture.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
