import type { MetadataRoute } from 'next';
import { fetchNetworks } from '@/lib/api/networks';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const networks = await fetchNetworks();

  const networkUrls: MetadataRoute.Sitemap = networks.map((network) => ({
    url: `${baseUrl}/network/${network.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...networkUrls,
  ];
}
