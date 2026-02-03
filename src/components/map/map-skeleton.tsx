import { MapPin } from 'lucide-react';

export function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-torea-bay-50">
      <div className="flex flex-col items-center gap-3 text-torea-bay-400">
        <div className="relative">
          <MapPin className="h-12 w-12 animate-pulse" aria-hidden="true" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-grenadier-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-grenadier-500" />
          </span>
        </div>
        <p className="text-sm font-medium">Loading map...</p>
      </div>
    </div>
  );
}
