import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SacredDataProvider } from '@/providers/SacredDataProvider'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MKWW Biosynthetic Vessel',
  description: 'Where Biology Meets Digital Transcendence - Advanced biosynthetic research platform commissioned under MKWW',
  keywords: ['biosynthetic', 'mkww', 'biology', 'technology', 'research', 'ai', 'master key world wide'],
  authors: [{ name: 'MKWW (Master Key World Wide)' }],
  creator: 'MKWW (Master Key World Wide)',
  publisher: 'MKWW (Master Key World Wide)',
  robots: 'index, follow',
  openGraph: {
    title: 'MKWW Biosynthetic Vessel',
    description: 'Where Biology Meets Digital Transcendence',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MKWW Biosynthetic Vessel',
    description: 'Where Biology Meets Digital Transcendence',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://kit.fontawesome.com/your-kit-code.js"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <SacredDataProvider>
          {children}
        </SacredDataProvider>
      </body>
    </html>
  )
} 