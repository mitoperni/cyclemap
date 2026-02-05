'use client';

import { SidebarStation } from '@/components/layout/sidebar-station';
import { StationsHeader } from '@/components/stations/stations-header';
import { StationsTable } from '@/components/stations/stations-table';
import { StationsMapContainer } from '@/components/map';
import { StationsSyncProvider } from '@/contexts/stations-sync-context';
import type { NetworkWithStations } from '@/types';

interface NetworkDetailClientProps {
  network: NetworkWithStations;
}

export function NetworkDetailClient({ network }: NetworkDetailClientProps) {
  const center = {
    latitude: network.location.latitude,
    longitude: network.location.longitude,
  };

  return (
    <StationsSyncProvider stations={network.stations} initialCenter={center}>
      <div className="flex h-screen flex-col lg:flex-row">
        <SidebarStation>
          <StationsHeader network={network} />
          <StationsTable />
        </SidebarStation>

        <main className="relative min-h-[300px] flex-1 lg:min-h-0">
          <StationsMapContainer center={center} />
        </main>
      </div>
    </StationsSyncProvider>
  );
}
