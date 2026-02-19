'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import type { MapRef, ErrorEvent, MapMouseEvent } from 'react-map-gl/mapbox';
import type { GeoJSONSource } from 'mapbox-gl';
import { useRouter } from 'next/navigation';
import { ClusterMarkers } from './cluster-markers';
import { UserLocationMarker } from './user-location-marker';
import { MapError } from './map-error';
import { useFitBounds } from '@/hooks/use-fit-bounds';
import { useMapLanguage } from '@/hooks/use-map-language';
import { useGeolocationContext, useSidebarContext } from '@/contexts';
import { MAP_CONFIG, MAPBOX_CONFIG, CLUSTER_CONFIG, GEOLOCATION_CONFIG } from '@/lib/constants';
import type { Network } from '@/types';

import { NearMeButton } from '../ui/near-me-button';

interface MapboxMapProps {
  networks: Network[];
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const INTERACTIVE_LAYER_IDS = [...CLUSTER_CONFIG.LAYER_IDS.CLUSTERS];

export function MapboxMap({ networks }: MapboxMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [mapInstance, setMapInstance] = useState<MapRef | null>(null);
  const router = useRouter();
  const [mapError, setMapError] = useState<string | null>(null);
  const { position: userPosition } = useGeolocationContext();
  const { hasMounted } = useSidebarContext();
  const hasAutoFlyRef = useRef(false);

  useFitBounds(mapRef, networks);
  useMapLanguage(mapInstance);

  useEffect(() => {
    if (!mapInstance || !hasMounted) return;
    mapInstance.resize();
  }, [mapInstance, hasMounted]);

  useEffect(() => {
    if (!mapInstance || !userPosition || hasAutoFlyRef.current) return;

    hasAutoFlyRef.current = true;
    mapInstance.flyTo({
      center: [userPosition.longitude, userPosition.latitude],
      zoom: GEOLOCATION_CONFIG.NETWORK_ZOOM,
      duration: MAP_CONFIG.ANIMATION_DURATION,
      essential: true,
    });
  }, [mapInstance, userPosition]);

  const handleMapError = useCallback((e: ErrorEvent) => {
    const errorMessage = e.error?.message || '';
    if (errorMessage.includes('access token')) {
      setMapError('Invalid or missing Mapbox access token. Please check your configuration.');
    } else {
      setMapError(errorMessage || 'Failed to load the map. Please try again.');
    }
  }, []);

  const handleNetworkClick = useCallback(
    (networkId: string) => {
      sessionStorage.setItem('previousPath', window.location.search);
      router.push(`/network/${networkId}`);
    },
    [router]
  );

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    const map = mapRef.current;
    if (!map) return;

    const features = map.queryRenderedFeatures(e.point, {
      layers: INTERACTIVE_LAYER_IDS,
    });

    if (!features.length) return;

    const feature = features[0];
    const clusterId = feature.properties?.cluster_id;

    if (clusterId === undefined) return;

    const source = map.getSource('networks') as GeoJSONSource;
    if (!source) return;

    source.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err || zoom === undefined || zoom === null) return;

      const geometry = feature.geometry as GeoJSON.Point;
      map.easeTo({
        center: geometry.coordinates as [number, number],
        zoom,
        duration: CLUSTER_CONFIG.ZOOM_ANIMATION_DURATION,
      });
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    const map = mapRef.current;
    if (map) {
      map.getCanvas().style.cursor = 'pointer';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const map = mapRef.current;
    if (map) {
      map.getCanvas().style.cursor = '';
    }
  }, []);

  const handleMapLoad = useCallback(() => {
    if (mapRef.current) {
      setMapInstance(mapRef.current);
    }
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
    <div
      role="region"
      aria-label="Interactive map showing bicycle sharing networks worldwide. Use mouse or touch to pan and zoom. Click on markers to view network details."
      style={{ width: '100%', height: '100%' }}
    >
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
        onLoad={handleMapLoad}
        onError={handleMapError}
        onClick={handleMapClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        interactiveLayerIds={INTERACTIVE_LAYER_IDS}
      >
        <NearMeButton
          mapRef={mapRef}
          zoom={GEOLOCATION_CONFIG.NETWORK_ZOOM}
          className="absolute left-8 top-8 z-10 max-xl:left-auto max-xl:right-4 max-xl:top-4"
        />
        <NavigationControl position="bottom-right" showCompass={false} />
        <UserLocationMarker />
        <ClusterMarkers networks={networks} onNetworkClick={handleNetworkClick} />
      </Map>
    </div>
  );
}
