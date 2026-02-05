import { notFound } from 'next/navigation';
import { fetchNetworkDetail } from '@/lib/api/network-detail';
import { NetworkDetailClient } from './network-detail-client';

interface NetworkDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NetworkDetailPageProps) {
  const { id } = await params;

  try {
    const network = await fetchNetworkDetail(id);
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
  const network = await fetchNetworkDetail(id);

  if (!network) {
    notFound();
  }

  return <NetworkDetailClient network={network} />;
}
