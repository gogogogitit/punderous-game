// components/JsonLd.tsx
'use client';

const DOMAIN = 'punderous-game-h1n1m3v71-mjkultra.vercel.app'

export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Punderous™",
    "applicationCategory": "GameApplication",
    "operatingSystem": "Any",
    "description": "Play Punderous™ - the Pun-A-Day Word Game!",
    "url": "https://punderous.com",
    "image": "https://punderous.com/images/og-image.jpg",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "http://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1",
      "bestRating": "5",
      "worstRating": "1",
      "reviewCount": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      id="schema-jsonld"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}