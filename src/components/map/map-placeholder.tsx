'use client';

import { AlertCircle, MapPin } from 'lucide-react';
import type { Network, Station } from '@/types';

interface MapPlaceholderProps {
  networks?: Network[];
  stations?: Station[];
}

export function MapPlaceholder({ networks, stations }: MapPlaceholderProps) {
  const count = networks?.length ?? stations?.length ?? 0;
  const label = networks ? 'networks' : 'stations';

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-torea-bay-50">
      {/* Dev mode indicator */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <AlertCircle className="h-8 w-8 text-amber-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-torea-bay-900">Development Mode</h3>
          <p className="mt-1 max-w-sm text-sm text-torea-bay-600">
            Mapbox is disabled. Set{' '}
            <code className="rounded bg-torea-bay-100 px-1.5 py-0.5 text-xs">
              NEXT_PUBLIC_USE_REAL_MAP=true
            </code>{' '}
            to enable the map.
          </p>
        </div>

        {/* Count indicator */}
        <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
          <MapPin className="h-4 w-4 text-grenadier-500" />
          <span className="text-sm font-medium text-torea-bay-700">
            {count} {label} available
          </span>
        </div>
      </div>
    </div>
  );
}
