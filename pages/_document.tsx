// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta property="og:title" content="Punderous™ - A Pun-Filled Word Game!" />
          <meta property="og:description" content="Play Punderous™ - a pun-filled word game where we ask the questions and you guess the puns!" />
          <meta property="og:url" content="https://punderous.com" />
          <meta property="og:site_name" content="Punderous™" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:image" content="https://punderous.com/og-image.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="Punderous™ - A Pun-Filled Word Game!" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:creator" content="@PunderousGame" />
          <meta name="twitter:title" content="Punderous™ - A Pun-Filled Word Game!" />
          <meta name="twitter:description" content="Play Punderous™ - a pun-filled word game where we ask the questions and you guess the puns!" />
          <meta name="twitter:image" content="https://punderous.com/twitter-image.png" />
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