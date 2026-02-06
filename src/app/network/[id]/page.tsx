import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchNetworkDetail } from '@/lib/api/network-detail';
import { BASE_URL, POPULAR_NETWORK_IDS } from '@/lib/constants';
import { NetworkDetailClient } from './network-detail-client';
import { GeolocationProvider } from '@/contexts';
import { JsonLd } from '@/components/seo/json-ld';

export async function generateStaticParams() {
  return POPULAR_NETWORK_IDS.map((id) => ({ id }));
}

export const dynamicParams = true;

interface NetworkDetailPageProps {
  params: Promise<{ id: string }>;
}

const getNetworkDetail = cache(async (id: string) => {
  return fetchNetworkDetail(id);
});

export async function generateMetadata({ params }: NetworkDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const network = await getNetworkDetail(id);
    const title = `${network.name} - Bike Sharing in ${network.location.city}`;
    const description = `Explore ${network.name} bike sharing network in ${network.location.city}, ${network.location.country}. Find ${network.stations?.length || 0} stations, check bike availability, and plan your ride.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${BASE_URL}/network/${id}`,
        siteName: 'CycleMap',
        images: [
          {
            url: `${BASE_URL}/stations_header.jpg`,
            width: 1102,
            height: 734,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${BASE_URL}/stations_header.jpg`],
      },
      alternates: {
        canonical: `${BASE_URL}/network/${id}`,
      },
    };
  } catch {
    return {
      title: 'Network Not Found',
      description: 'The requested bike sharing network could not be found.',
    };
  }
}

export default async function NetworkDetailPage({ params }: NetworkDetailPageProps) {
  const { id } = await params;
  const network = await getNetworkDetail(id);

  if (!network) {
    notFound();
  }

  return (
    <GeolocationProvider>
      <JsonLd network={network} />
      <NetworkDetailClient network={network} />
    </GeolocationProvider>
  );
}
