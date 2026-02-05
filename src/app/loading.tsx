import { Sidebar } from '@/components/layout/sidebar';
import { NetworkListSkeleton } from '@/components/networks/network-list-skeleton';
import { MapSkeleton } from '@/components/map/map-skeleton';

export default function Loading() {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <Sidebar>
        <NetworkListSkeleton />
      </Sidebar>
      <main className="relative min-h-[300px] flex-1 lg:min-h-0">
        <MapSkeleton />
      </main>
    </div>
  );
}
