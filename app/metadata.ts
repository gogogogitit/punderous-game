import { Metadata } from 'next'

const DOMAIN = 'punderous-game-h1n1m3v71-mjkultra.vercel.app'

export const metadata: Metadata = {
  title: 'Punderous™ - The Pun-A-Day Word Game!',
  description: 'Play Punderous™ - the pun-a-day word game!',
  metadataBase: new URL(`https://${DOMAIN}`),
  
  // Basic metadata
  applicationName: 'Punderous™',
  authors: [{ name: 'MJKUltra' }],
  creator: 'MJKUltra',
  publisher: 'MJKUltra',
  keywords: ['pun', 'word game', 'puzzle', 'brain teaser', 'Punderous'],
  
  // Robots
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

  // OpenGraph
  openGraph: {
    title: 'Punderous™ - The Pun-A-Day Word Game!',
    description: 'Play Punderous™ - the pun-a-day word game!',
    url: `https://${DOMAIN}`,
    siteName: 'Punderous™',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: `/images/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: 'Punderous™ - The Pun-A-Day Word Game!',
    }],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Punderous™ - The Pun-A-Day Word Game!',
    description: 'Play Punderous™ - the pun-a-day word game!',
    creator: '@PunderousGame',
    images: [{
      url: `/images/twitter-image.jpg`,
      width: 1200,
      height: 630,
      alt: 'Punderous™ - The Pun-A-Day Word Game!',
    }],
  },

  // Other
  manifest: '/site.webmanifest',
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/images/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon-96x96.png', type: 'image/png' }],
  },

  other: {
    'fb:app_id': '462159136491139'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
} 