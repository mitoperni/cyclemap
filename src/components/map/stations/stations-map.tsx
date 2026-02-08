'use client';

import { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import type { MapRef, ErrorEvent } from 'react-map-gl/mapbox';
import type { Map as MapboxMap } from 'mapbox-gl';
import { StationClusterMarkers } from './station-cluster-markers';
import { StationPopup } from './station-popup';
import { MapError } from '../map-error';
import { NearMeButton } from '@/components/ui/near-me-button';
import { useStationsSync } from '@/contexts/stations-sync-context';
import { useMapLanguage } from '@/hooks/use-map-language';
import { MAP_CONFIG, MAPBOX_CONFIG, GEOLOCATION_CONFIG } from '@/lib/constants';
import type { Station } from '@/types';
import 'mapbox-gl/dist/mapbox-gl.css';

interface StationsMapProps {
  center: { latitude: number; longitude: number };
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function StationsMap({ center }: StationsMapProps) {
  const { stations, registerMapRef, updateMapCenter, selectedStationId, clearSelection } =
    useStationsSync();

  const [mapInstance, setMapInstance] = useState<MapRef | null>(null);
  const [mapClickedStationId, setMapClickedStationId] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const nearMeMapRef = useRef<MapRef | null>(null);
  const stationClickedRef = useRef(false);

  useMapLanguage(mapInstance);

  const mapRefCallback = useCallback(
    (ref: MapRef | null) => {
      if (ref) {
        setMapInstance(ref);
        registerMapRef(ref);
        nearMeMapRef.current = ref;
      }
    },
    [registerMapRef]
  );

  const stationLookup = useMemo(() => {
    const lookup = new globalThis.Map<string, Station>();
    stations.forEach((s) => lookup.set(s.id, s));
    return lookup;
  }, [stations]);

  const selectedStation = useMemo(() => {
    const idToUse = selectedStationId || mapClickedStationId;
    if (!idToUse) return null;
    return stationLookup.get(idToUse) || null;
  }, [selectedStationId, mapClickedStationId, stationLookup]);

  useEffect(() => {
    if (!mapInstance) return;

    const handleMoveEnd = () => {
      const mapCenter = mapInstance.getCenter();
      updateMapCenter({
        latitude: mapCenter.lat,
        longitude: mapCenter.lng,
      });
    };

    mapInstance.on('moveend', handleMoveEnd);
    return () => {
      mapInstance.off('moveend', handleMoveEnd);
    };
  }, [mapInstance, updateMapCenter]);

  const handleMapError = useCallback((e: ErrorEvent) => {
    const errorMessage = e.error?.message || '';
    if (errorMessage.includes('access token')) {
      setMapError('Invalid or missing Mapbox access token. Please check your configuration.');
    } else {
      setMapError(errorMessage || 'Failed to load the map. Please try again.');
    }
  }, []);

  const handleStationClick = useCallback(
    (station: Station) => {
      stationClickedRef.current = true;
      clearSelection();
      setMapClickedStationId(station.id);
    },
    [clearSelection]
  );

  const handleClosePopup = useCallback(() => {
    setMapClickedStationId(null);
    clearSelection();
  }, [clearSelection]);

  const handleMapClick = useCallback(() => {
    if (stationClickedRef.current) {
      stationClickedRef.current = false;
      return;
    }
    setMapClickedStationId(null);
    clearSelection();
  }, [clearSelection]);

  const handleMapLoad = useCallback((e: { target: MapboxMap }) => {
    e.target.resize();
  }, []);

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
      ref={mapRefCallback}
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
      onLoad={handleMapLoad}
      onError={handleMapError}
      onClick={handleMapClick}
    >
      <NearMeButton
        mapRef={nearMeMapRef}
        zoom={GEOLOCATION_CONFIG.STATION_ZOOM}
        className="absolute left-8 top-8 z-10 max-xl:left-auto max-xl:right-4 max-xl:top-4"
      />
      <NavigationControl position="bottom-right" showCompass={false} />

      <StationClusterMarkers
        stations={stations}
        selectedStation={selectedStation}
        onStationClick={handleStationClick}
      />

      {selectedStation && <StationPopup station={selectedStation} onClose={handleClosePopup} />}
    </Map>
  );
}
