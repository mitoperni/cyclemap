import { Suspense } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { MapSkeleton } from '@/components/map/map-skeleton';
import { NetworkSidebar, NetworkListSkeleton } from '@/components/networks';
import { fetchNetworks } from '@/lib/api/networks';
import { getUniqueCountries } from '@/lib/utils';

export default async function Home() {
  const networks = await fetchNetworks();
  const countries = getUniqueCountries(networks);

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* Sidebar - Network list and filters */}
      <Sidebar>
        <Suspense fallback={<NetworkListSkeleton />}>
          <NetworkSidebar networks={networks} countries={countries} />
        </Suspense>
      </Sidebar>

      {/* Map area - Takes remaining space */}
      <main className="relative min-h-[300px] flex-1 lg:min-h-0">
        <MapSkeleton />
      </main>
    </div>
  );
}
