'use client';

import { useRef, useCallback, useState } from 'react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import type { MapRef, ErrorEvent, MapMouseEvent } from 'react-map-gl/mapbox';
import type { GeoJSONSource } from 'mapbox-gl';
import { useRouter } from 'next/navigation';
import { ClusterMarkers } from './cluster-markers';
import { MapError } from './map-error';
import { NearMeButton } from './near-me-button';
import { useFitBounds } from '@/hooks/use-fit-bounds';
import { MAP_CONFIG, MAPBOX_CONFIG, CLUSTER_CONFIG, GEOLOCATION_CONFIG } from '@/lib/constants';
import type { Network } from '@/types';

import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  networks: Network[];
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Only cluster layers are interactive (individual markers are React components)
const INTERACTIVE_LAYER_IDS = [...CLUSTER_CONFIG.LAYER_IDS.CLUSTERS];

export function MapboxMap({ networks }: MapboxMapProps) {
  const mapRef = useRef<MapRef>(null);
  const router = useRouter();
  const [mapError, setMapError] = useState<string | null>(null);

  // Auto-fit bounds when networks change
  useFitBounds(mapRef, networks);

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
      router.push(`/network/${networkId}`);
    },
    [router]
  );

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    const map = mapRef.current;
    if (!map) return;

    // Query features at click point (only clusters)
    const features = map.queryRenderedFeatures(e.point, {
      layers: INTERACTIVE_LAYER_IDS,
    });

    if (!features.length) return;

    const feature = features[0];
    const clusterId = feature.properties?.cluster_id;

    if (clusterId === undefined) return;

    const source = map.getSource('networks') as GeoJSONSource;
    if (!source) return;

    // Zoom to expand cluster
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
      onClick={handleMapClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      interactiveLayerIds={INTERACTIVE_LAYER_IDS}
    >
      <NearMeButton
        mapRef={mapRef}
        zoom={GEOLOCATION_CONFIG.NETWORK_ZOOM}
        className="absolute left-8 top-8 z-10 max-lg:left-auto max-lg:right-4 max-lg:top-4"
      />
      <NavigationControl position="bottom-right" showCompass={false} />
      <ClusterMarkers networks={networks} onNetworkClick={handleNetworkClick} />
    </Map>
  );
}
