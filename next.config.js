/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  images: {
    domains: ['www.punderous.com', 'punderous.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v0.dev',
        port: '',
        pathname: '/placeholder.svg/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Handle trailing slashes for images
      {
        source: '/images/:path*',
        has: [
          {
            type: 'header',
            key: 'x-vercel-ip-country',
          },
        ],
        permanent: true,
        destination: '/images/:path*/',
      },
      // Redirect non-www to www
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'punderous.com',
          },
        ],
        permanent: true,
        destination: 'https://www.punderous.com',
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Handle image file requests
        {
          source: '/og-image.:ext(jpg|png)',
          destination: '/images/og-image.:ext',
        },
        {
          source: '/twitter-image.:ext(jpg|png)',
          destination: '/images/twitter-image.:ext',
        },
      ],
    };
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Link',
            value: '<https://www.punderous.com>; rel="canonical"'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      {
        // Special headers for static assets
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Keep your existing API route headers
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  output: 'standalone',
  
  // Add webpack configuration for debugging
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Print environment information during build
    if (isServer) {
      console.log('\nBuild Environment Information:');
      console.log('- NODE_ENV:', process.env.NODE_ENV);
      console.log('- Database URL exists:', !!process.env.DATABASE_URL);
      console.log('- Is Development:', dev);
      console.log('- Is Server Build:', isServer);
      console.log('- Build ID:', buildId);
      console.log('- Working Directory:', process.cwd());
    }
    return config;
  },
};

// Print config loading confirmation
console.log('Next.js config loaded, environment variables present:', {
  DATABASE_URL: !!process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV
});

export default nextConfig;