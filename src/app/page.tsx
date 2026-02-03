import { Sidebar } from '@/components/layout/sidebar';
import { MapSkeleton } from '@/components/map/map-skeleton';
import { NetworkFilters, NetworkListContainer, NetworksIntro } from '@/components/networks';
import { fetchNetworks } from '@/lib/api/networks';
import { getUniqueCountries } from '@/lib/utils';
import type { NetworkFilters as NetworkFiltersType } from '@/types';

interface PageProps {
  searchParams: Promise<{ country?: string; search?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: NetworkFiltersType = {
    country: params.country || undefined,
    search: params.search || undefined,
  };

  const networks = await fetchNetworks();
  const countries = getUniqueCountries(networks);

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* Sidebar - Network list and filters */}
      <Sidebar>
        <div className="flex flex-col gap-6">
          <NetworksIntro />
          <NetworkFilters countries={countries} />
          <NetworkListContainer networks={networks} filters={filters} />
        </div>
      </Sidebar>

      {/* Map area - Takes remaining space */}
      <main className="relative min-h-[300px] flex-1 lg:min-h-0">
        <MapSkeleton />
      </main>
    </div>
  );
}
