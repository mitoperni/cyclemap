'use client';

import { useRef, useCallback, useState } from 'react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import type { MapRef, ErrorEvent } from 'react-map-gl/mapbox';
import { useRouter } from 'next/navigation';
import { MapMarkers } from './map-markers';
import { MapError } from './map-error';
import { useFitBounds } from '@/hooks/use-fit-bounds';
import { MAP_CONFIG, MAPBOX_CONFIG } from '@/lib/constants';
import type { Network } from '@/types';

import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  networks: Network[];
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function MapboxMap({ networks }: MapboxMapProps) {
  const mapRef = useRef<MapRef>(null);
  const router = useRouter();
  const [mapError, setMapError] = useState<string | null>(null);

  // Auto-fit bounds when networks change
  useFitBounds(mapRef, networks);

  const handleMarkerClick = useCallback(
    (networkId: string) => {
      router.push(`/network/${networkId}`);
    },
    [router]
  );

  const handleMapError = useCallback((e: ErrorEvent) => {
    const errorMessage = e.error?.message || '';
    if (errorMessage.includes('access token')) {
      setMapError('Invalid or missing Mapbox access token. Please check your configuration.');
    } else {
      setMapError(errorMessage || 'Failed to load the map. Please try again.');
    }
  }, []);

  // Validate token before rendering
  if (!MAPBOX_TOKEN) {
    return (
      <MapError
        title="Configuration Error"
        message="Mapbox access token is not configured. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your environment variables."
      />
    );
  }

  if (mapError) {
    return <MapError message={mapError} onRetry={() => setMapError(null)} />;
  }

  return (
    <Map
      ref={mapRef}
      reuseMaps={true}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude: MAP_CONFIG.DEFAULT_CENTER.lng,
        latitude: MAP_CONFIG.DEFAULT_CENTER.lat,
        zoom: MAP_CONFIG.DEFAULT_ZOOM,
      }}
      minZoom={MAP_CONFIG.MIN_ZOOM}
      maxZoom={MAP_CONFIG.MAX_ZOOM}
      mapStyle={MAPBOX_CONFIG.STYLE}
      projection="mercator"
      style={{ width: '100%', height: '100%' }}
      onError={handleMapError}
    >
      <NavigationControl position="bottom-right" showCompass={false} />
      <MapMarkers networks={networks} onMarkerClick={handleMarkerClick} />
    </Map>
  );
}
