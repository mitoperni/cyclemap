import type { MetadataRoute } from 'next';
import { fetchNetworks } from '@/lib/api/networks';
import { BASE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const networks = await fetchNetworks();

  const networkUrls: MetadataRoute.Sitemap = networks.map((network) => ({
    url: `${BASE_URL}/network/${network.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...networkUrls,
  ];
}
