import { Sidebar } from '@/components/layout/sidebar';
import { NetworkListSkeleton } from '@/components/networks/network-list-skeleton';
import { MapSkeleton } from '@/components/map/map-skeleton';

export default function Loading() {
  return (
    <div className="flex h-screen">
      <Sidebar variant="networks">
        <NetworkListSkeleton />
      </Sidebar>
      <main className="relative flex-1">
        <MapSkeleton />
      </main>
    </div>
  );
}
