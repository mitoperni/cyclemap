import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Limit concurrent page generation to avoid API rate limits
    staticGenerationMaxConcurrency: 3,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(self), microphone=(), camera=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.mapbox.com",
              "style-src 'self' 'unsafe-inline' https://api.mapbox.com",
              "img-src 'self' data: blob: https://api.mapbox.com https://tiles.mapbox.com",
              "font-src 'self'",
              "connect-src 'self' https://api.citybik.es https://api.mapbox.com https://tiles.mapbox.com https://events.mapbox.com",
              "worker-src 'self' blob: https://api.mapbox.com",
              "frame-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
