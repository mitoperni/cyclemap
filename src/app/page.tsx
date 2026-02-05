import { Sidebar } from '@/components/layout/sidebar';
import { MapContainer } from '@/components/map';
import { NetworkSidebar } from '@/components/networks';
import { FilteredNetworksProvider } from '@/contexts';
import { fetchNetworks } from '@/lib/api/networks';
import { getUniqueCountries } from '@/lib/utils';

export default async function Home() {
  const networks = await fetchNetworks();
  const countries = getUniqueCountries(networks);

  return (
    <FilteredNetworksProvider networks={networks}>
      <div className="flex h-screen flex-col lg:flex-row">
        <Sidebar>
          <NetworkSidebar countries={countries} />
        </Sidebar>

        <main className="relative min-h-[300px] flex-1 lg:min-h-0">
          <MapContainer />
        </main>
      </div>
    </FilteredNetworksProvider>
  );
}
