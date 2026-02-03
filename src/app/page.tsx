import { Sidebar } from '@/components/layout/sidebar';
import { MapSkeleton } from '@/components/map/map-skeleton';

export default function Home() {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* Sidebar - Network list and filters */}
      <Sidebar>
        <div className="p-4">
          <p className="text-sm text-torea-bay-500">
            Network list and filters will be displayed here
          </p>
        </div>
      </Sidebar>

      {/* Map area - Takes remaining space */}
      <main className="relative min-h-[300px] flex-1 lg:min-h-0">
        <MapSkeleton />
      </main>
    </div>
  );
}
