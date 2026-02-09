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
              // unsafe-eval: Required by Mapbox GL JS - uses new Function() internally
              // to compile style expressions (filters, conditional colors).
              // Without it, the map fails to render. See: https://github.com/mapbox/mapbox-gl-js/issues/3773
              // unsafe-inline: Required by Next.js for hydration bootstrap scripts
              // and JSON-LD scripts using dangerouslySetInnerHTML.
              // Alternative: nonce-based approach via middleware (adds complexity).
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.mapbox.com https://vercel.live",
              // unsafe-inline: Required by Mapbox GL JS - injects inline styles
              // to position map elements (markers, popups, controls).
              "style-src 'self' 'unsafe-inline' https://api.mapbox.com https://vercel.live",
              "img-src 'self' data: blob: https://api.mapbox.com https://tiles.mapbox.com https://vercel.live https://vercel.com",
              "font-src 'self' https://vercel.live https://assets.vercel.com",
              "connect-src 'self' https://api.citybik.es https://api.mapbox.com https://tiles.mapbox.com https://events.mapbox.com https://vercel.live wss://ws-us3.pusher.com",
              "worker-src 'self' blob: https://api.mapbox.com",
              "frame-src 'self' https://vercel.live",
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
