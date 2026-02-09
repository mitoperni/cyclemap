import { NetworkListSkeleton } from '@/components/networks/network-list-skeleton';
import { MapSkeleton } from '@/components/map/map-skeleton';

export default function Loading() {
  return (
    <div className="flex h-screen">
      <aside className="hidden bg-white xl:flex xl:h-full xl:w-(--sidebar-width) xl:flex-col xl:px-[40px] xl:pt-[40px]">
        <NetworkListSkeleton />
      </aside>

      <main className="absolute inset-0 xl:relative xl:flex-1">
        <MapSkeleton />
      </main>
    </div>
  );
}
