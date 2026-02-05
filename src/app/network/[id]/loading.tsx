import { Sidebar } from '@/components/layout/sidebar';
import { StationsTableSkeleton } from '@/components/stations/stations-table-skeleton';

export default function NetworkDetailLoading() {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <Sidebar>
        <StationsTableSkeleton />
      </Sidebar>

      <main className="relative min-h-[300px] flex-1 lg:min-h-0">
        <div className="flex h-full items-center justify-center bg-torea-bay-50">
          <div className="animate-pulse text-torea-bay-400">Loading map...</div>
        </div>
      </main>
    </div>
  );
}
