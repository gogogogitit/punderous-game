// components/JsonLd.tsx
'use client';

export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Punderous™",
    "applicationCategory": "GameApplication",
    "operatingSystem": "Any",
    "description": "Play Punderous™ - a pun-filled word game where we ask the questions and you guess the puns!",
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
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
      id="schema-jsonld"
    />
  );
}