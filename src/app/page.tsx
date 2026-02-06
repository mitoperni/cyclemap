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
          <div className="h-screen lg:flex lg:flex-row">
            <Sidebar>
              <NetworkSidebar countries={countries} />
            </Sidebar>

            <main className="absolute inset-0 lg:relative lg:flex-1">
              {/* Botón hamburguesa - solo visible en mobile */}
              <SidebarOpenButton className="absolute left-4 top-4 z-20" variant="light" />
              <MapContainer />
            </main>
          </div>
        </SidebarProvider>
      </FilteredNetworksProvider>
    </GeolocationProvider>
  );
}
