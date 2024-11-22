import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, './'),
    outputFileTracingIncludes: {
      '/*': ['./public/**/*']
    }
  },
  output: 'standalone',
  images: {
    domains: ['www.punderous.com', 'punderous.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 0,
    remotePatterns: [
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
    ]
  }
};

export default nextConfig;