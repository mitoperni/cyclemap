'use client';

import dynamic from 'next/dynamic';
import { MapSkeleton } from '../map-skeleton';
import { MapPlaceholder } from '../map-placeholder';
import { useStationsSync } from '@/contexts/stations-sync-context';

const StationsMap = dynamic(
  () => import('./stations-map').then((mod) => ({ default: mod.StationsMap })),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);

const USE_REAL_MAP = process.env.NEXT_PUBLIC_USE_REAL_MAP === 'true';

interface StationsMapContainerProps {
  center: { latitude: number; longitude: number };
}

export function StationsMapContainer({ center }: StationsMapContainerProps) {
  const { stations } = useStationsSync();

  if (!USE_REAL_MAP) {
    return <MapPlaceholder stations={stations} />;
  }

  return (
    <div className="absolute inset-0">
      <StationsMap center={center} />
    </div>
  );
}
