'use client';

import { memo, useMemo } from 'react';
import { Marker } from 'react-map-gl/mapbox';
import { MapPin } from 'lucide-react';
import type { Network } from '@/types';

interface MapMarkersProps {
  networks: Network[];
  onMarkerClick: (networkId: string) => void;
}

export const MapMarkers = memo(function MapMarkers({ networks, onMarkerClick }: MapMarkersProps) {
  // Memoize marker data transformation
  const markers = useMemo(
    () =>
      networks.map((network) => ({
        id: network.id,
        longitude: network.location.longitude,
        latitude: network.location.latitude,
        name: network.name,
        city: network.location.city,
      })),
    [networks]
  );

  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          longitude={marker.longitude}
          latitude={marker.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onMarkerClick(marker.id);
          }}
        >
          <button
            className="group flex flex-col items-center focus:outline-none"
            aria-label={`View ${marker.name} network in ${marker.city}`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-grenadier-500 shadow-lg transition-transform group-hover:scale-110 group-focus:scale-110">
              <MapPin className="h-5 w-5 text-white" />
            </div>
          </button>
        </Marker>
      ))}
    </>
  );
});
