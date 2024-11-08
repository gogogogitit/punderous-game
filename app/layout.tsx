import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Punderful - The Pun Word Game',
  description: 'Challenge your wit with Punderful, the ultimate pun word game!'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  )
}