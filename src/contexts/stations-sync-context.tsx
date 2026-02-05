'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import type { Station } from '@/types';
import { MAP_CONFIG } from '@/lib/constants';

interface MapCenter {
  latitude: number;
  longitude: number;
}

interface StationsSyncContextValue {
  stations: Station[];
  sortedStations: Station[];
  selectedStationId: string | null;
  flyToStation: (stationId: string) => void;
  registerMapRef: (ref: MapRef | null) => void;
  updateMapCenter: (center: MapCenter) => void;
  clearSelection: () => void;
}

const StationsSyncContext = createContext<StationsSyncContextValue | null>(null);

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in kilometers
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface StationsSyncProviderProps {
  stations: Station[];
  initialCenter: MapCenter;
  children: ReactNode;
}

export function StationsSyncProvider({
  stations,
  initialCenter,
  children,
}: StationsSyncProviderProps) {
  const [mapCenter, setMapCenter] = useState<MapCenter>(initialCenter);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const mapRefInternal = useRef<MapRef | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Create station lookup for O(1) access
  const stationLookup = useMemo(() => {
    const lookup = new Map<string, Station>();
    stations.forEach((s) => lookup.set(s.id, s));
    return lookup;
  }, [stations]);

  // Sort stations by distance to map center
  const sortedStations = useMemo(() => {
    return [...stations].sort((a, b) => {
      const distA = calculateDistance(
        mapCenter.latitude,
        mapCenter.longitude,
        a.latitude,
        a.longitude
      );
      const distB = calculateDistance(
        mapCenter.latitude,
        mapCenter.longitude,
        b.latitude,
        b.longitude
      );
      return distA - distB;
    });
  }, [stations, mapCenter]);

  const registerMapRef = useCallback((ref: MapRef | null) => {
    mapRefInternal.current = ref;
  }, []);

  const updateMapCenter = useCallback((center: MapCenter) => {
    // Debounce updates to avoid excessive re-sorting during pan
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setMapCenter(center);
    }, 150);
  }, []);

  const flyToStation = useCallback(
    (stationId: string) => {
      const station = stationLookup.get(stationId);
      const map = mapRefInternal.current;

      if (!station || !map) return;

      setSelectedStationId(stationId);

      map.flyTo({
        center: [station.longitude, station.latitude],
        zoom: MAP_CONFIG.MAX_ZOOM - 2, // Zoom in close (16)
        duration: MAP_CONFIG.ANIMATION_DURATION,
        essential: true,
      });
    },
    [stationLookup]
  );

  const clearSelection = useCallback(() => {
    setSelectedStationId(null);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      stations,
      sortedStations,
      selectedStationId,
      flyToStation,
      registerMapRef,
      updateMapCenter,
      clearSelection,
    }),
    [
      stations,
      sortedStations,
      selectedStationId,
      flyToStation,
      registerMapRef,
      updateMapCenter,
      clearSelection,
    ]
  );

  return <StationsSyncContext.Provider value={value}>{children}</StationsSyncContext.Provider>;
}

export function useStationsSync(): StationsSyncContextValue {
  const context = useContext(StationsSyncContext);

  if (!context) {
    throw new Error('useStationsSync must be used within a StationsSyncProvider');
  }

  return context;
}
