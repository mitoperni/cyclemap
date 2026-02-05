'use client';

import dynamic from 'next/dynamic';
import { MapSkeleton } from '../map-skeleton';
import type { Station } from '@/types';
import { MapPlaceholder } from '../map-placeholder';

// Lazy load StationsMap to reduce bundle and avoid SSR issues with Mapbox
const StationsMap = dynamic(
  () => import('./stations-map').then((mod) => ({ default: mod.StationsMap })),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);

const USE_REAL_MAP = process.env.NEXT_PUBLIC_USE_REAL_MAP === 'true';

interface StationsMapContainerProps {
  stations: Station[];
  center: { latitude: number; longitude: number };
}

export function StationsMapContainer({ stations, center }: StationsMapContainerProps) {
  if (!USE_REAL_MAP) {
    return <MapPlaceholder stations={stations} />;
  }

  return <StationsMap stations={stations} center={center} />;
}
