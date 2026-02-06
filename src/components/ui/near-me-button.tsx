'use client';

import { useEffect, useCallback, useRef } from 'react';
import { Locate, Loader2, X } from 'lucide-react';
import type { MapRef } from 'react-map-gl/mapbox';
import { useGeolocationContext } from '@/contexts';
import { GEOLOCATION_CONFIG, MAP_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface NearMeButtonProps {
  mapRef: React.RefObject<MapRef | null>;
  zoom?: number;
  className?: string;
}

export function NearMeButton({ mapRef, zoom, className }: NearMeButtonProps) {
  const { position, isLoading, error, errorMessage, requestLocation, clearError } =
    useGeolocationContext();
  const hasFlownToPositionRef = useRef(false);
  const userClickedRef = useRef(false);

  // Fly to position when it changes, but only if user clicked the button
  // (not on auto-request at page load)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !position) return;

    // Only fly to position if user explicitly clicked the button
    if (!userClickedRef.current) {
      hasFlownToPositionRef.current = true;
      return;
    }

    map.flyTo({
      center: [position.longitude, position.latitude],
      zoom: zoom ?? GEOLOCATION_CONFIG.NETWORK_ZOOM,
      duration: MAP_CONFIG.ANIMATION_DURATION,
      essential: true,
    });
    userClickedRef.current = false;
  }, [mapRef, position, zoom]);

  const handleClick = useCallback(() => {
    userClickedRef.current = true;
    if (error) {
      clearError();
    }
    // If we already have position, fly to it directly
    if (position && !error) {
      const map = mapRef.current;
      if (map) {
        map.flyTo({
          center: [position.longitude, position.latitude],
          zoom: zoom ?? GEOLOCATION_CONFIG.NETWORK_ZOOM,
          duration: MAP_CONFIG.ANIMATION_DURATION,
          essential: true,
        });
      }
    } else {
      requestLocation();
    }
  }, [error, clearError, position, mapRef, zoom, requestLocation]);

  if (error) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'group flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg',
          'transition-all hover:bg-red-600',
          'focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2',
          className
        )}
        aria-label="Retry getting location"
        title={errorMessage || 'Location error'}
      >
        <X className="h-5 w-5" />
      </button>
    );
  }

  if (isLoading) {
    return (
      <button
        disabled
        className={cn(
          'flex h-10 w-10 cursor-wait items-center justify-center rounded-full bg-white shadow-lg',
          className
        )}
        aria-label="Getting your location..."
      >
        <Loader2 className="h-5 w-5 animate-spin text-grenadier-500" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center rounded-full bg-torea-bay-800 text-white shadow-lg py-2 px-4',
        'transition-all hover:scale-105 hover:bg-grenadier-900',
        'focus:outline-none focus:ring-2 focus:ring-grenadier-400 focus:ring-offset-2',
        'active:scale-95',
        className
      )}
      aria-label="Center map on my location"
      title="Find my location"
    >
      <Locate className="h-4 w-4" />
      <span className="ml-2 text-bold text-sm leading-6">Near me</span>
    </button>
  );
}
