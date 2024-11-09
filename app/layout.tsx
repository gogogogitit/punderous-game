import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Punderful - The Ultimate Pun-Filled Word Game',
  description: 'Lettuce Play.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}