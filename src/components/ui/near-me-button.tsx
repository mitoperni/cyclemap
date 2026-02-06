'use client';

import { useEffect, useCallback } from 'react';
import { Locate, Loader2, X } from 'lucide-react';
import type { MapRef } from 'react-map-gl/mapbox';
import { useGeolocation } from '@/hooks/use-geolocation';
import { GEOLOCATION_CONFIG, MAP_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface NearMeButtonProps {
  mapRef: React.RefObject<MapRef | null>;
  zoom?: number;
  className?: string;
}

export function NearMeButton({ mapRef, zoom, className }: NearMeButtonProps) {
  const { position, isLoading, error, errorMessage, requestLocation, clearError } =
    useGeolocation();

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !position) return;

    map.flyTo({
      center: [position.longitude, position.latitude],
      zoom: zoom ?? GEOLOCATION_CONFIG.NETWORK_ZOOM,
      duration: MAP_CONFIG.ANIMATION_DURATION,
      essential: true,
    });
  }, [mapRef, position, zoom]);

  const handleClick = useCallback(() => {
    if (error) {
      clearError();
    }
    requestLocation();
  }, [error, clearError, requestLocation]);

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
