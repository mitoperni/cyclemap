import { SidebarStation } from '@/components/layout/sidebar-station';
import { StationsTableSkeleton } from '@/components/stations/stations-table-skeleton';
import { MapSkeleton } from '@/components/map/map-skeleton';

export default function NetworkDetailLoading() {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <SidebarStation>
        <StationsTableSkeleton />
      </SidebarStation>

      <main className="relative min-h-[300px] flex-1 lg:min-h-0">
        <MapSkeleton />
      </main>
    </div>
  );
}
