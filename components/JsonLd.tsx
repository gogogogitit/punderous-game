// components/JsonLd.tsx
'use client';

interface JsonLdProps {
  baseUrl: string
}

export default function JsonLd({ baseUrl }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      id="schema-jsonld"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Punderous™",
          "applicationCategory": "GameApplication",
          "operatingSystem": "Any",
          "description": "Play Punderous™ - the Pun-A-Day Word Game!",
          "url": baseUrl,
          "image": `${baseUrl}/images/og-image.jpg`,
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
        })
      }}
    />
  );
}