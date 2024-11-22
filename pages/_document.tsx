// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://punderous.com';
    
    return (
      <Html lang="en">
        <Head>
          {/* Standard Meta Tags */}
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5" />
          <meta name="description" content="Play Punderous™ - a pun-filled word game where we ask the questions and you guess the puns!" />
          <meta name="keywords" content="pun game, word game, puzzle game, brain teaser, Punderous" />
          <meta name="author" content="MJKUltra" />
          
          {/* Open Graph Tags */}
          <meta property="fb:app_id" content="462159136491139" />
          <meta property="og:title" content="Punderous™ - A Pun-Filled Word Game!" />
          <meta property="og:description" content="Play Punderous™ - a pun-filled word game where we ask the questions and you guess the puns!" />
          <meta property="og:url" content={domain} />
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
          <meta property="twitter:image" content="https://punderous.com/images/twitter-image.jpg" />
          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": ["WebApplication", "Game"],
                "name": "Punderous™",
                "description": "Play Punderous™ - a pun-filled word game where we ask the questions and you guess the puns!",
                "url": domain,
                "image": `${domain}/images/og-image.jpg`,
                "screenshot": `${domain}/images/og-image.jpg`,
                "applicationCategory": "GameApplication",
                "gameType": "Word Game",
                "genre": "Puzzle",
                "inLanguage": "en-US",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "author": {
                  "@type": "Organization",
                  "name": "MJKUltra"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "MJKUltra"
                }
              })
            }}
          />

          {/* SEO Tags */}
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
          <link rel="canonical" href={domain} />
          <meta name="format-detection" content="telephone=no, address=no, email=no" />

          {/* Favicon and App Icons */}
          <link rel="icon" href="/favicon.ico" sizes="32x32" />
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