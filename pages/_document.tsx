// pages/_document.tsx
import Document, { Html, Head, Main, NextScript, DocumentProps } from 'next/document';
import { ReactElement } from 'react';

class MyDocument extends Document<DocumentProps> {
  render(): ReactElement {
    return (
      <Html lang="en">
        <Head>
          {/* Base Meta Tags */}
          <meta charSet="utf-8" />
          <meta name="format-detection" content="telephone=no, address=no, email=no" />
          
          {/* Facebook App ID - Keep this here as it's a global configuration */}
          <meta property="fb:app_id" content="462159136491139" />
          
          {/* Favicon Configuration */}
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="icon" href="/images/favicon-16x16.png" sizes="16x16" type="image/png" />
          <link rel="icon" href="/images/favicon-32x32.png" sizes="32x32" type="image/png" />
          <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" sizes="180x180" />
          <link rel="manifest" href="/site.webmanifest" crossOrigin="use-credentials" />

          {/* Preconnect to improve performance */}
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://www.google-analytics.com" />
          
          {/* Remove any other meta tags from here - they should go in app/layout.tsx */}
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