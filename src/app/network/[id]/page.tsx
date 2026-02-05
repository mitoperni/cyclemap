import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { StationsHeader } from '@/components/stations/stations-header';
import { StationsTable } from '@/components/stations/stations-table';
import { StationsTableSkeleton } from '@/components/stations/stations-table-skeleton';
import { StationsMapContainer, MapSkeleton } from '@/components/map';
import { fetchNetworkDetail } from '@/lib/api/network-detail';
import { SidebarStation } from '@/components/layout/sidebar-station';

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

async function NetworkContent({ id }: { id: string }) {
  const network = await fetchNetworkDetail(id);

  if (!network) {
    notFound();
  }

  return (
    <>
      <StationsHeader network={network} />
      <StationsTable stations={network.stations} />
    </>
  );
}

async function NetworkMap({ id }: { id: string }) {
  const network = await fetchNetworkDetail(id);

  if (!network) {
    return null;
  }

  return (
    <StationsMapContainer
      stations={network.stations}
      center={{
        latitude: network.location.latitude,
        longitude: network.location.longitude,
      }}
    />
  );
}

export default async function NetworkDetailPage({ params }: NetworkDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <SidebarStation>
        <Suspense fallback={<StationsTableSkeleton />}>
          <NetworkContent id={id} />
        </Suspense>
      </SidebarStation>

      <main className="relative min-h-[300px] flex-1 lg:min-h-0">
        <Suspense fallback={<MapSkeleton />}>
          <NetworkMap id={id} />
        </Suspense>
      </main>
    </div>
  );
}
