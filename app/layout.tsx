import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Punderous™ - A Pun-Filled Word Game',
  description: 'Challenge your wit with Punderous™, a fun word game where we ask the questions and you guess the puns!',
  keywords: ['pun', 'word game', 'puzzle', 'brain teaser', 'Punderous'],
  authors: [{ name: 'MJKUltra' }],
  creator: 'MJKUltra',
  publisher: 'Punderous™',
  openGraph: {
    type: 'website',
    url: 'https://punderous.com',
    title: 'Punderous™ - A Pun-Filled Word Game',
    description: 'Challenge your wit with Punderous™, a fun word game where we ask the questions and you guess the puns!',
    siteName: 'Punderous™',
    images: [
      {
        url: 'https://punderous.com/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Punderous™ - A Pun-Filled Word Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Punderous™ - A Pun-Filled Word Game',
    description: 'Challenge your wit with Punderous™, a fun word game where we ask the questions and you guess the puns!',
    images: ['https://punderous.com/twitter-image.jpg'],
    creator: '@PunderousGame',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}