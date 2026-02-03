import { NetworkList } from './network-list';
import { fetchNetworks } from '@/lib/api/networks';

export async function NetworkListContainer() {
  const networks = await fetchNetworks();

  return <NetworkList networks={networks} />;
}
