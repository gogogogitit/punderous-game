import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import { GA_TRACKING_ID } from '@/lib/analytics';
import dynamic from 'next/dynamic'

const GoogleAnalytics = dynamic(() => import('@/components/GoogleAnalytics'), { 
  ssr: false,
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://punderous.com'),
  title: 'Punderous™ - A Pun-Filled Word Game',
  description: 'Play Punderous™, a pun-filled word game where we ask the questions and you guess the puns!',
  keywords: ['pun', 'word game', 'puzzle', 'brain teaser', 'Punderous'],
  authors: [{ name: 'MJKUltra' }],
  creator: 'MJKUltra',
  publisher: 'MJKUltra',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Punderous™ - A Pun-Filled Word Game!',
    description: 'Play Punderous™, a fun word game where we ask the questions and you guess the puns!',
    url: 'https://punderous.com',
    siteName: 'Punderous',
    images: [
      {
        url: 'https://punderous.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Punderous™ - A Pun-Filled Word Game!',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Punderous™ - A Pun-Filled Word Game!',
    description: 'Play Punderous, a pun-filled word game where we ask the questions and you guess the puns!',
    creator: '@PunderousGame',
    images: ['https://punderous.com/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#00B4D8',
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
        <GoogleAnalytics />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </body>
    </html>
  )
}