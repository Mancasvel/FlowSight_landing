import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://flowsight.site'),
  title: 'FlowSight - Task Visibility Without Employee Surveillance',
  description: 'Automatic task traceability powered by AI context understanding.',
  icons: {
    icon: '/flowsight_sinfondo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {/* <Navigation /> */}
        {/* <main className="flex-1"> */}
        {children}
        {/* </main> */}
        <Footer />
      </body>
    </html>
  )
}
