'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { StationsHeader } from '@/components/stations/stations-header';
import { StationsTable } from '@/components/stations/stations-table';
import { StationsMapContainer } from '@/components/map';
import { StationsSyncProvider } from '@/contexts/stations-sync-context';
import { SidebarProvider } from '@/contexts/sidebar-context';
import type { NetworkWithStations } from '@/types';
import { SidebarOpenButton } from '@/components/ui/sidebar-open-button';

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
      <SidebarProvider>
        <div className="h-screen lg:flex lg:flex-row">
          <Sidebar variant="stations">
            <StationsHeader network={network} />
            <StationsTable />
          </Sidebar>

          <main className="absolute inset-0 lg:relative lg:flex-1">
            <SidebarOpenButton className="absolute left-4 top-4 z-20" variant="dark" />
            <StationsMapContainer center={center} />
          </main>
        </div>
      </SidebarProvider>
    </StationsSyncProvider>
  );
}
