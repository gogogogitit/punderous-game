import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://punderous.com'),
  title: 'Punderous™ - A Pun-Filled Word Game',
  description: 'Play Punderous, a fun word game where we ask the questions and you guess the puns!',
  openGraph: {
    title: 'Punderous™ - A Pun-Filled Word Game',
    description: 'Challenge your wit with Punderous™, the ultimate pun guessing game!',
    url: 'https://punderous.com',
    siteName: 'Punderous™',
    images: [
      {
        url: 'https://punderous.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Punderous™ - A Pun-Filled Word Game',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Punderous™ - A Pun-Filled Word Game',
    description: 'Challenge your wit with Punderous™, the ultimate pun guessing game!',
    images: ['https://punderous.com/twitter-image.jpg'],
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
        <main className="min-h-screen bg-[#00B4D8]">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}