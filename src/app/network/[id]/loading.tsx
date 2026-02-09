import { StationsTableSkeleton } from '@/components/stations/stations-table-skeleton';
import { MapSkeleton } from '@/components/map/map-skeleton';

export default function NetworkDetailLoading() {
  return (
    <div className="h-screen flex">
      {/* Skeleton del sidebar - visible solo en desktop */}
      <aside className="hidden bg-torea-bay-800 xl:flex xl:h-full xl:w-(--sidebar-width) xl:flex-col">
        <StationsTableSkeleton />
      </aside>

      {/* Mapa skeleton - ocupa toda la pantalla en mobile */}
      <main className="absolute inset-0 xl:relative xl:flex-1">
        <MapSkeleton />
      </main>
    </div>
  );
}
