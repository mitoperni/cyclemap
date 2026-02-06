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
import type { Station, PaginationInfo, StationSort } from '@/types';
import { MAP_CONFIG, PAGINATION } from '@/lib/constants';
import { calculateDistance, paginateItems } from '@/lib/utils';

interface MapCenter {
  latitude: number;
  longitude: number;
}

interface StationsSyncContextValue {
  stations: Station[];
  sortedStations: Station[];
  paginatedStations: Station[];
  pagination: PaginationInfo;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  selectedStationId: string | null;
  flyToStation: (stationId: string) => void;
  registerMapRef: (ref: MapRef | null) => void;
  updateMapCenter: (center: MapCenter) => void;
  clearSelection: () => void;
  columnSort: StationSort | null;
  handleColumnSort: (field: StationSort['field']) => void;
}

const StationsSyncContext = createContext<StationsSyncContextValue | null>(null);

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
  const [currentPage, setCurrentPage] = useState(1);
  const [columnSort, setColumnSort] = useState<StationSort | null>(null);
  const mapRefInternal = useRef<MapRef | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stationLookup = useMemo(() => {
    const lookup = new Map<string, Station>();
    stations.forEach((s) => lookup.set(s.id, s));
    return lookup;
  }, [stations]);

  const sortedStations = useMemo(() => {
    const sorted = [...stations];

    if (columnSort) {
      sorted.sort((a, b) => {
        const { field, direction } = columnSort;
        const multiplier = direction === 'asc' ? 1 : -1;

        const aVal = a[field];
        const bVal = b[field];
        if (aVal === null && bVal === null) return 0;
        if (aVal === null) return 1;
        if (bVal === null) return -1;

        return multiplier * (aVal - bVal);
      });
    } else {
      sorted.sort((a, b) => {
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
    }

    return sorted;
  }, [stations, mapCenter, columnSort]);

  const { items: paginatedStations, pagination } = useMemo(() => {
    return paginateItems(sortedStations, currentPage, PAGINATION.DEFAULT_PAGE_SIZE);
  }, [sortedStations, currentPage]);

  const registerMapRef = useCallback((ref: MapRef | null) => {
    mapRefInternal.current = ref;
  }, []);

  const updateMapCenter = useCallback((center: MapCenter) => {
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

  const handleColumnSort = useCallback((field: StationSort['field']) => {
    setColumnSort((prev) => {
      if (prev?.field === field) {
        if (prev.direction === 'desc') return { field, direction: 'asc' };
        return null; // Third click = reset to distance sorting
      }
      return { field, direction: 'desc' }; // First click = descending
    });
    setCurrentPage(1); // Reset to page 1 when sort changes
  }, []);

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
      paginatedStations,
      pagination,
      currentPage,
      setCurrentPage,
      selectedStationId,
      flyToStation,
      registerMapRef,
      updateMapCenter,
      clearSelection,
      columnSort,
      handleColumnSort,
    }),
    [
      stations,
      sortedStations,
      paginatedStations,
      pagination,
      currentPage,
      selectedStationId,
      flyToStation,
      registerMapRef,
      updateMapCenter,
      clearSelection,
      columnSort,
      handleColumnSort,
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
