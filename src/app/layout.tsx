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
    images: [
      {
        url: '/flowsight_screen.png',
        width: 1200,
        height: 630,
        alt: 'FlowSight - Task Visibility Without Developer Surveillance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlowSight - Task Visibility Without Developer Surveillance',
    description: 'Automatic task traceability powered by AI context understanding. Replace invasive time tracking and manual task updates with privacy-first architecture.',
    images: ['/flowsight_screen.png'],
  },
  other: {
    'og:image': '/flowsight_screen.png',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': 'FlowSight - Task Visibility Without Developer Surveillance',
    'twitter:image': '/flowsight_screen.png',
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
