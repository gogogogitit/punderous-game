// pages/_document.tsx
import Document, { Html, Head, Main, NextScript, DocumentProps } from 'next/document';
import { ReactElement } from 'react';

class MyDocument extends Document {
  render(): ReactElement {
    return (
      <Html lang="en">
        <Head>
          {/* Base Meta Tags */}
          <meta charSet="utf-8" />
          <meta name="format-detection" content="telephone=no, address=no, email=no" />
          
          {/* Facebook App ID - Keep this here as it's a global configuration */}
          <meta property="fb:app_id" content="462159136491139" />
          
          {/* Remove favicon configuration as it's now in app/layout.tsx */}
          
          {/* Preconnect to improve performance */}
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://www.google-analytics.com" />
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