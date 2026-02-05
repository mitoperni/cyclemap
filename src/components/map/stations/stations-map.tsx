'use client';

import { useRef, useCallback, useState } from 'react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import type { MapRef, ErrorEvent } from 'react-map-gl/mapbox';
import { StationClusterMarkers } from './station-cluster-markers';
import { StationPopup } from './station-popup';
import { MapError } from '../map-error';
import { MAP_CONFIG, MAPBOX_CONFIG } from '@/lib/constants';
import type { Station } from '@/types';

import 'mapbox-gl/dist/mapbox-gl.css';

interface StationsMapProps {
  stations: Station[];
  center: { latitude: number; longitude: number };
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function StationsMap({ stations, center }: StationsMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const handleMapError = useCallback((e: ErrorEvent) => {
    const errorMessage = e.error?.message || '';
    if (errorMessage.includes('access token')) {
      setMapError('Invalid or missing Mapbox access token. Please check your configuration.');
    } else {
      setMapError(errorMessage || 'Failed to load the map. Please try again.');
    }
  }, []);

  const handleStationClick = useCallback((station: Station) => {
    setSelectedStation(station);
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedStation(null);
  }, []);

  const handleMapClick = useCallback(() => {
    // Close popup when clicking on the map (not on a marker)
    setSelectedStation(null);
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
        longitude: center.longitude,
        latitude: center.latitude,
        zoom: MAP_CONFIG.DETAIL_ZOOM,
      }}
      minZoom={MAP_CONFIG.MIN_ZOOM}
      maxZoom={MAP_CONFIG.MAX_ZOOM}
      mapStyle={MAPBOX_CONFIG.STYLE}
      projection="mercator"
      style={{ width: '100%', height: '100%' }}
      onError={handleMapError}
      onClick={handleMapClick}
    >
      <NavigationControl position="bottom-right" showCompass={false} />

      {/* Station cluster markers */}
      <StationClusterMarkers
        stations={stations}
        selectedStation={selectedStation}
        onStationClick={handleStationClick}
      />

      {/* Popup for selected station */}
      {selectedStation && <StationPopup station={selectedStation} onClose={handleClosePopup} />}
    </Map>
  );
}
