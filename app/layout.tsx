import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import { GA_TRACKING_ID } from '@/lib/analytics'
import dynamic from 'next/dynamic'

const GoogleAnalytics = dynamic(() => import('@/components/GoogleAnalytics'), { 
  ssr: false,
})

const JsonLd = dynamic(() => import('@/components/JsonLd'), {
  ssr: true
})

const inter = Inter({ subsets: ['latin'] })

const siteConfig = {
  name: 'Punderous™',
  description: 'Play Punderous™ - a pun-filled word game where we ask the questions and you guess the puns!',
  url: 'https://punderous.com',
  ogImage: '/og-image.jpg',
  twitterImage: '/twitter-image.jpg',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - A Pun-Filled Word Game!`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
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
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: {
      default: `${siteConfig.name} - A Pun-Filled Word Game!`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} - A Pun-Filled Word Game!`,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - A Pun-Filled Word Game!`,
    description: siteConfig.description,
    creator: '@PunderousGame',
    images: [siteConfig.twitterImage], // Using separate Twitter image
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
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: {
      url: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon-16x16.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: siteConfig.url,
  },
}

export const viewport: Viewport = {
  themeColor: '#00B4D8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" crossOrigin="use-credentials" />
        <JsonLd />
      </head>
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