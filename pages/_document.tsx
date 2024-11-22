// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Standard Meta Tags */}
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5" />
          <meta name="description" content="Play Punderous™ - a pun-filled word game where we ask the questions and you guess the puns!" />
          <meta name="keywords" content="pun game, word game, puzzle game, brain teaser, Punderous" />
          <meta name="author" content="MJKUltra" />
          <meta name="theme-color" content="#00B4D8" />
          
          {/* Open Graph Tags */}
          <meta property="fb:app_id" content="462159136491139" />
          <meta property="og:title" content="Punderous™ - A Pun-Filled Word Game!" />
          <meta property="og:description" content="Play Punderous™ - a pun-filled word game where we ask the questions and you guess the puns!" />
          <meta property="og:url" content="https://punderous.com" />
          <meta property="og:site_name" content="Punderous™" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:image" content="https://punderous.com/images/og-image.jpg" />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="Punderous™ - A Pun-Filled Word Game!" />
          <meta property="og:type" content="website" />

          {/* Twitter Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:creator" content="@PunderousGame" />
          <meta name="twitter:title" content="Punderous™ - A Pun-Filled Word Game!" />
          <meta name="twitter:description" content="Play Punderous™ - a pun-filled word game where we ask the questions and you guess the puns!" />
          <meta name="twitter:image" content="https://punderous.com/images/twitter-image.jpg" />
          
          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "Punderous™",
                "description": "Play Punderous™ - a pun-filled word game where we ask the questions and you guess the puns!",
                "url": "https://punderous.com",
                "image": {
                  "@type": "ImageObject",
                  "url": "https://punderous.com/images/og-image.jpg",
                  "width": "1200",
                  "height": "630"
                },
                "applicationCategory": "Game",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "author": {
                  "@type": "Organization",
                  "name": "MJKUltra",
                  "url": "https://punderous.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://punderous.com/punderous-logo.png",
                    "width": "512",
                    "height": "512"
                  }
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "MJKUltra",
                  "url": "https://punderous.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://punderous.com/punderous-logo.png",
                    "width": "512",
                    "height": "512"
                  }
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "5",
                  "ratingCount": "1",
                  "bestRating": "5",
                  "worstRating": "1"
                },
                "gamePlatform": ["Web Browser"],
                "genre": "Puzzle Game",
                "isFamilyFriendly": true,
                "inLanguage": "en-US",
                "interactionStatistic": {
                  "@type": "InteractionCounter",
                  "interactionType": "https://schema.org/PlayGameAction",
                  "userInteractionCount": "1000+"
                }
              })
            }}
          />

          {/* SEO Tags */}
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
          <link rel="canonical" href="https://punderous.com" />
          
          {/* Favicon and App Icons */}
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="icon" href="/images/favicon-16x16.png" sizes="16x16" type="image/png" />
          <link rel="icon" href="/images/favicon-32x32.png" sizes="32x32" type="image/png" />
          <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" sizes="180x180" />
          <link rel="manifest" href="/site.webmanifest" crossOrigin="use-credentials" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;