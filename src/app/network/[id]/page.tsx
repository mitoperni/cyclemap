import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { StationsTableSkeleton } from '@/components/stations/stations-table-skeleton';
import { MapSkeleton } from '@/components/map';
import { fetchNetworkDetail } from '@/lib/api/network-detail';
import { SidebarStation } from '@/components/layout/sidebar-station';
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

async function NetworkData({ id }: { id: string }) {
  const network = await fetchNetworkDetail(id);

  if (!network) {
    notFound();
  }

  return <NetworkDetailClient network={network} />;
}

export default async function NetworkDetailPage({ params }: NetworkDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <Suspense
        fallback={
          <>
            <SidebarStation>
              <StationsTableSkeleton />
            </SidebarStation>
            <main className="relative min-h-[300px] flex-1 lg:min-h-0">
              <MapSkeleton />
            </main>
          </>
        }
      >
        <NetworkData id={id} />
      </Suspense>
    </div>
  );
}
