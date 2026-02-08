'use client';

import { Marker } from 'react-map-gl/mapbox';
import { useGeolocationContext } from '@/contexts';

export function UserLocationMarker() {
  const { position } = useGeolocationContext();

  if (!position) return null;

  return (
    <Marker
      longitude={position.longitude}
      latitude={position.latitude}
      anchor="center"
      className="user-location-marker"
    >
      <div
        role="img"
        aria-label="Your location"
        className="relative flex items-center justify-center"
      >
        <div className="absolute h-6 w-6 animate-ping rounded-full bg-torea-bay-500/20" />
        <div className="absolute h-6 w-6 rounded-full bg-torea-bay-500/20" />
        <div className="h-3 w-3 rounded-full border-2 border-white bg-torea-bay-500 shadow-md" />
      </div>
    </Marker>
  );
}
