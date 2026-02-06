import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CycleMap - Bicycle Sharing Networks',
    short_name: 'CycleMap',
    description: 'Explore bicycle sharing networks around the world',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/logo-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
