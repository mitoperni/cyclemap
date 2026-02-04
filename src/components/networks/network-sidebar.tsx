'use client';

import { NetworkFilters } from './network-filters';
import { NetworkList } from './network-list';
import { NetworksIntro } from './networks-intro';
import { useFilteredNetworks } from '@/contexts';

interface NetworkSidebarProps {
  countries: string[];
}

export function NetworkSidebar({ countries }: NetworkSidebarProps) {
  const { filteredNetworks } = useFilteredNetworks();

  return (
    <div className="flex flex-col gap-6">
      <NetworksIntro />
      <NetworkFilters countries={countries} />
      <NetworkList networks={filteredNetworks} />
    </div>
  );
}
