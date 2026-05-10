import type { Metadata, Viewport } from 'next'
import './globals.css'
import Footer from '@/components/Footer'
import { ClickAnalytics } from '@/components/ClickAnalytics'
import { CookieConsent } from '@/components/CookieConsent'
import { ConsentProvider } from '@/context/ConsentContext'
import { MicrosoftClarity } from '@/components/MicrosoftClarity'
import { RootJsonLd } from '@/components/seo/RootJsonLd'
import { absoluteUrl, siteConfig } from '@/lib/site'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · Protect your focus. Prove your work. Automatically.`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: 'technology',
  icons: {
    icon: '/flowsight_sinfondo.png',
    apple: '/flowsight_sinfondo.png',
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      en: siteConfig.url,
      'en-US': siteConfig.url,
      'en-GB': siteConfig.url,
      'x-default': siteConfig.url,
    },
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    alternateLocale: ['en_GB'],
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} · Protect your focus. Prove your work. Automatically.`,
    description: siteConfig.description,
    images: [
      {
        url: absoluteUrl(siteConfig.defaultOgImage),
        width: 512,
        height: 512,
        alt: `${siteConfig.name} logo`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} · Cognitive health and proof of work, locally`,
    description: siteConfig.description,
    ...(siteConfig.twitterHandle ? { site: siteConfig.twitterHandle, creator: siteConfig.twitterHandle } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  formatDetection: { telephone: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ConsentProvider>
          <MicrosoftClarity />
          <ClickAnalytics />
          <CookieConsent />
          <RootJsonLd />
          {children}
          <Footer />
        </ConsentProvider>
      </body>
    </html>
  )
}
