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
  description: 'Play Punderous™ - the pun-a-day word game!',
  url: 'https://punderous.com',
  ogImage: '/images/og-image.jpg',
  twitterImage: '/images/twitter-image.jpg',
  fbAppId: '462159136491139',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - The Pun-A-Day Word Game!`,
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
    siteName: siteConfig.name,
    title: {
      default: `${siteConfig.name} - The Pun-A-Day Word Game!`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - The Pun-A-Day Word Game!`,
        type: 'image/jpeg',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - The Pun-A-Day Word Game!`,
    description: siteConfig.description,
    creator: '@PunderousGame',
    images: [{
      url: siteConfig.twitterImage,
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} - The Pun-A-Day Word Game!`,
      type: 'image/jpeg',
    }],
  },
  // Single robots configuration
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
      noimageindex: false
    }
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: [
      { url: '/favicon-96x96.png', type: 'image/png' }
    ],
    apple: {
      url: '/images/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png'
    },
    other: [
      {
        rel: 'icon',
        url: '/favicon-96x96.png',
        type: 'image/png',
        sizes: '96x96'
      }
    ]
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: new URL('/', siteConfig.url).toString()
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
        <meta property="fb:app_id" content={siteConfig.fbAppId} />
        {/* Add explicit favicon links as recommended by Google */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon-96x96.png" sizes="96x96" type="image/png" />
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