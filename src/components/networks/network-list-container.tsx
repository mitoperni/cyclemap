import { NetworkList } from './network-list';
import { filterNetworks } from '@/lib/api/networks';
import type { Network, NetworkFilters } from '@/types';

interface NetworkListContainerProps {
  networks: Network[];
  filters?: NetworkFilters;
}

export function NetworkListContainer({ networks, filters = {} }: NetworkListContainerProps) {
  const filteredNetworks = filterNetworks(networks, filters);

  return <NetworkList networks={filteredNetworks} />;
}
