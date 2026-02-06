import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchNetworkDetail } from '@/lib/api/network-detail';
import { NetworkDetailClient } from './network-detail-client';
import { GeolocationProvider } from '@/contexts';
import { JsonLd } from '@/components/seo/json-ld';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
        url: `${baseUrl}/network/${id}`,
        siteName: 'CycleMap',
        images: ['/stations_header.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/stations_header.jpg'],
      },
      alternates: {
        canonical: `${baseUrl}/network/${id}`,
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
