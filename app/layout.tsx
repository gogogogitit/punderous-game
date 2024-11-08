import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Punderful - The Pun Word Game',
  description: 'Challenge your wit with Punderful, the ultimate pun word game!',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  openGraph: {
    title: 'Punderful - The Pun Word Game',
    description: 'Challenge your wit with Punderful, the ultimate pun word game!',
    url: 'https://punderful-game.vercel.app/',
    siteName: 'Punderful',
    images: [
      {
        url: '/opengraph-image.png', 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}