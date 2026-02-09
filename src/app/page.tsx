import { Sidebar } from '@/components/layout/sidebar';
import { MapContainer } from '@/components/map';
import { NetworkSidebar } from '@/components/networks';
import { SidebarOpenButton } from '@/components/ui/sidebar-open-button';
import { FilteredNetworksProvider, SidebarProvider, GeolocationProvider } from '@/contexts';
import { fetchNetworks } from '@/lib/api/networks';
import { getUniqueCountries } from '@/lib/utils';

export default async function Home() {
  const networks = await fetchNetworks();
  const countries = getUniqueCountries(networks);

  return (
    <GeolocationProvider>
      <FilteredNetworksProvider networks={networks}>
        <SidebarProvider>
          <div className="h-screen flex">
            <Sidebar variant="networks">
              <NetworkSidebar countries={countries} />
            </Sidebar>

            <main className="absolute inset-0 xl:relative xl:flex-1">
              <SidebarOpenButton className="absolute left-4 top-4 z-20" variant="light" />
              <MapContainer />
            </main>
          </div>
        </SidebarProvider>
      </FilteredNetworksProvider>
    </GeolocationProvider>
  );
}
