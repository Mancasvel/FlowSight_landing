import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'
import { RootJsonLd } from '@/components/seo/RootJsonLd'
import { absoluteUrl, siteConfig } from '@/lib/site'

const inter = Inter({ subsets: ['latin'] })

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
    default: `${siteConfig.name} — Task visibility without employee surveillance`,
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
    title: `${siteConfig.name} — Task visibility without employee surveillance`,
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
    title: `${siteConfig.name} — Task visibility without surveillance`,
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
      <body className={inter.className} suppressHydrationWarning>
        <RootJsonLd />
        {children}
        {/* </main> */}
        <Footer />
      </body>
    </html>
  )
}
