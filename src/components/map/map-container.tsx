'use client';

import dynamic from 'next/dynamic';
import { MapSkeleton } from './map-skeleton';
import { MapPlaceholder } from './map-placeholder';
import { useFilteredNetworks } from '@/contexts';

// Lazy load Mapbox only when needed to reduce bundle and avoid SSR issues
const MapboxMap = dynamic(
  () => import('./mapbox-map').then((mod) => ({ default: mod.MapboxMap })),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);

const USE_REAL_MAP = process.env.NEXT_PUBLIC_USE_REAL_MAP === 'true';

export function MapContainer() {
  const { filteredNetworks } = useFilteredNetworks();

  if (!USE_REAL_MAP) {
    return <MapPlaceholder networks={filteredNetworks} />;
  }

  return <MapboxMap networks={filteredNetworks} />;
}
