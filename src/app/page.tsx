import { Suspense } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { MapSkeleton } from '@/components/map/map-skeleton';
import { NetworkListContainer, NetworkListSkeleton, NetworksIntro } from '@/components/networks';

export default function Home() {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* Sidebar - Network list and filters */}
      <Sidebar>
        <div className="flex flex-col gap-6">
          <NetworksIntro />
          {/* Search and filters will go here */}
          <Suspense fallback={<NetworkListSkeleton />}>
            <NetworkListContainer />
          </Suspense>
        </div>
      </Sidebar>

      {/* Map area - Takes remaining space */}
      <main className="relative min-h-[300px] flex-1 lg:min-h-0">
        <MapSkeleton />
      </main>
    </div>
  );
}
