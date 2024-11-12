import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Punderous™ - A Pun-Filled Word Game',
  description: 'Play Punderous, a fun word game where we ask the questions and you guess the puns!',
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