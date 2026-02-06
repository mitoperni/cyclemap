import { cache } from 'react';
import { notFound } from 'next/navigation';
import { fetchNetworkDetail } from '@/lib/api/network-detail';
import { NetworkDetailClient } from './network-detail-client';
import { GeolocationProvider } from '@/contexts';

interface NetworkDetailPageProps {
  params: Promise<{ id: string }>;
}

const getNetworkDetail = cache(async (id: string) => {
  return fetchNetworkDetail(id);
});

export async function generateMetadata({ params }: NetworkDetailPageProps) {
  const { id } = await params;

  try {
    const network = await getNetworkDetail(id);
    return {
      title: `${network.name} | CycleMap`,
      description: `View stations for ${network.name} in ${network.location.city}, ${network.location.country}`,
    };
  } catch {
    return {
      title: 'Network Not Found | CycleMap',
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
      <NetworkDetailClient network={network} />
    </GeolocationProvider>
  );
}
