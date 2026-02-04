import { useEffect, useRef } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import type { LngLatBoundsLike } from 'mapbox-gl';
import { MAP_CONFIG } from '@/lib/constants';
import type { Network } from '@/types';

export function useFitBounds(mapRef: React.RefObject<MapRef | null>, networks: Network[]) {
  // Track previous networks to avoid unnecessary fits
  const prevNetworkIdsRef = useRef<string>('');

  useEffect(() => {
    const map = mapRef.current;
    if (!map || networks.length === 0) return;

    // Create a stable identifier for the current networks
    const networkIds = networks
      .map((n) => n.id)
      .sort()
      .join(',');

    // Skip if networks haven't changed
    if (networkIds === prevNetworkIdsRef.current) return;
    prevNetworkIdsRef.current = networkIds;

    // Handle single marker - fly to it
    if (networks.length === 1) {
      map.flyTo({
        center: [networks[0].location.longitude, networks[0].location.latitude],
        zoom: MAP_CONFIG.DETAIL_ZOOM,
        duration: MAP_CONFIG.ANIMATION_DURATION,
        essential: true,
      });
      return;
    }

    // Calculate bounds for multiple markers
    const lngs = networks.map((n) => n.location.longitude);
    const lats = networks.map((n) => n.location.latitude);

    const bounds: [[number, number], [number, number]] = [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    ];

    map.fitBounds(bounds as LngLatBoundsLike, {
      padding: MAP_CONFIG.FIT_BOUNDS_PADDING,
      duration: MAP_CONFIG.ANIMATION_DURATION,
      maxZoom: MAP_CONFIG.FIT_BOUNDS_MAX_ZOOM,
      essential: true,
    });
  }, [mapRef, networks]);
}
