const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, './'),
    outputFileTracingIncludes: {
      '/': ['./public/**/*']
    }
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'punderous.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'www.punderous.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'v0.dev',
        pathname: '/placeholder.svg/**'
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**'
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 0,
    unoptimized: true
  }
};

module.exports = nextConfig;