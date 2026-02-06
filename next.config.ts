import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Limit concurrent page generation to avoid API rate limits
    staticGenerationMaxConcurrency: 3,
  },
};

export default nextConfig;
