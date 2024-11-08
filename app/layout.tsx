import { Metadata } from 'next'

export const metadata: Metadata = {
  // ... previous metadata
  openGraph: {
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
}

// ... rest of your layout component