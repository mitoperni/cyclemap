import { StationsTableSkeleton } from '@/components/stations/stations-table-skeleton';
import { MapSkeleton } from '@/components/map/map-skeleton';

export default function NetworkDetailLoading() {
  return (
    <div className="h-screen lg:flex lg:flex-row">
      {/* Skeleton del sidebar - visible solo en desktop */}
      <aside className="hidden bg-torea-bay-800 lg:flex lg:h-full lg:w-(--sidebar-width) lg:flex-col">
        <StationsTableSkeleton />
      </aside>

      {/* Mapa skeleton - ocupa toda la pantalla en mobile */}
      <main className="absolute inset-0 lg:relative lg:flex-1">
        <MapSkeleton />
      </main>
    </div>
  );
}
