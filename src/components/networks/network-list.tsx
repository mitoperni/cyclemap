import { NetworkCard } from './network-card';
import type { Network } from '@/types';

interface NetworkListProps {
  networks: Network[];
}

export function NetworkList({ networks }: NetworkListProps) {
  if (networks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-gray-500">No networks found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {networks.map((network) => (
        <NetworkCard key={network.id} network={network} />
      ))}
    </div>
  );
}
