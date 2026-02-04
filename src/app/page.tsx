import { Suspense } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { MapSkeleton, MapContainer } from '@/components/map';
import { NetworkSidebar, NetworkListSkeleton } from '@/components/networks';
import { FilteredNetworksProvider } from '@/contexts';
import { fetchNetworks } from '@/lib/api/networks';
import { getUniqueCountries } from '@/lib/utils';

function MainContent({ countries }: { countries: string[] }) {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* Sidebar - Network list and filters */}
      <Sidebar>
        <NetworkSidebar countries={countries} />
      </Sidebar>

      {/* Map area - Takes remaining space */}
      <main className="relative min-h-[300px] flex-1 lg:min-h-0">
        <MapContainer />
      </main>
    </div>
  );
}

export default async function Home() {
  const networks = await fetchNetworks();
  const countries = getUniqueCountries(networks);

  return (
    <Suspense
      fallback={
        <div className="flex h-screen flex-col lg:flex-row">
          <Sidebar>
            <NetworkListSkeleton />
          </Sidebar>
          <main className="relative min-h-[300px] flex-1 lg:min-h-0">
            <MapSkeleton />
          </main>
        </div>
      }
    >
      <FilteredNetworksProvider networks={networks}>
        <MainContent countries={countries} />
      </FilteredNetworksProvider>
    </Suspense>
  );
}
