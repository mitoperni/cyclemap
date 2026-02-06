import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { StationsSyncProvider, useStationsSync } from '../stations-sync-context';
import type { Station } from '@/types';
import type { ReactNode } from 'react';

// Mock mapbox
vi.mock('react-map-gl/mapbox', () => ({
  default: vi.fn(),
}));

const createMockStation = (overrides: Partial<Station> = {}): Station => ({
  id: `station-${Math.random()}`,
  name: 'Test Station',
  latitude: 40.4168,
  longitude: -3.7038,
  free_bikes: 5,
  empty_slots: 10,
  timestamp: '2024-01-01T00:00:00Z',
  ...overrides,
});

const createWrapper = (stations: Station[]) => {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <StationsSyncProvider
        stations={stations}
        initialCenter={{ latitude: 40.4168, longitude: -3.7038 }}
      >
        {children}
      </StationsSyncProvider>
    );
  };
};

describe('StationsSyncContext Sorting', () => {
  describe('handleColumnSort', () => {
    it('should set columnSort to descending on first click', () => {
      const stations = [createMockStation()];
      const { result } = renderHook(() => useStationsSync(), {
        wrapper: createWrapper(stations),
      });

      expect(result.current.columnSort).toBeNull();

      act(() => {
        result.current.handleColumnSort('free_bikes');
      });

      expect(result.current.columnSort).toEqual({
        field: 'free_bikes',
        direction: 'desc',
      });
    });

    it('should toggle to ascending on second click of same column', () => {
      const stations = [createMockStation()];
      const { result } = renderHook(() => useStationsSync(), {
        wrapper: createWrapper(stations),
      });

      act(() => {
        result.current.handleColumnSort('free_bikes');
      });

      expect(result.current.columnSort?.direction).toBe('desc');

      act(() => {
        result.current.handleColumnSort('free_bikes');
      });

      expect(result.current.columnSort).toEqual({
        field: 'free_bikes',
        direction: 'asc',
      });
    });

    it('should reset to null on third click of same column', () => {
      const stations = [createMockStation()];
      const { result } = renderHook(() => useStationsSync(), {
        wrapper: createWrapper(stations),
      });

      act(() => {
        result.current.handleColumnSort('free_bikes');
      });
      act(() => {
        result.current.handleColumnSort('free_bikes');
      });
      act(() => {
        result.current.handleColumnSort('free_bikes');
      });

      expect(result.current.columnSort).toBeNull();
    });

    it('should switch to new column with descending when clicking different column', () => {
      const stations = [createMockStation()];
      const { result } = renderHook(() => useStationsSync(), {
        wrapper: createWrapper(stations),
      });

      act(() => {
        result.current.handleColumnSort('free_bikes');
      });

      expect(result.current.columnSort?.field).toBe('free_bikes');

      act(() => {
        result.current.handleColumnSort('empty_slots');
      });

      expect(result.current.columnSort).toEqual({
        field: 'empty_slots',
        direction: 'desc',
      });
    });

    it('should reset currentPage to 1 when sort changes', () => {
      const stations = Array.from({ length: 25 }, (_, i) =>
        createMockStation({ id: `station-${i}`, free_bikes: i })
      );
      const { result } = renderHook(() => useStationsSync(), {
        wrapper: createWrapper(stations),
      });

      // Go to page 2
      act(() => {
        result.current.setCurrentPage(2);
      });

      expect(result.current.currentPage).toBe(2);

      // Sort should reset to page 1
      act(() => {
        result.current.handleColumnSort('free_bikes');
      });

      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('sortedStations - sorting by free_bikes', () => {
    it('should sort by free_bikes descending (highest first)', () => {
      const stations = [
        createMockStation({ id: '1', name: 'Station A', free_bikes: 5 }),
        createMockStation({ id: '2', name: 'Station B', free_bikes: 10 }),
        createMockStation({ id: '3', name: 'Station C', free_bikes: 2 }),
      ];

      const { result } = renderHook(() => useStationsSync(), {
        wrapper: createWrapper(stations),
      });

      act(() => {
        result.current.handleColumnSort('free_bikes');
      });

      expect(result.current.sortedStations[0].free_bikes).toBe(10);
      expect(result.current.sortedStations[1].free_bikes).toBe(5);
      expect(result.current.sortedStations[2].free_bikes).toBe(2);
    });

    it('should sort by free_bikes ascending (lowest first)', () => {
      const stations = [
        createMockStation({ id: '1', name: 'Station A', free_bikes: 5 }),
        createMockStation({ id: '2', name: 'Station B', free_bikes: 10 }),
        createMockStation({ id: '3', name: 'Station C', free_bikes: 2 }),
      ];

      const { result } = renderHook(() => useStationsSync(), {
        wrapper: createWrapper(stations),
      });

      act(() => {
        result.current.handleColumnSort('free_bikes');
        result.current.handleColumnSort('free_bikes');
      });

      expect(result.current.sortedStations[0].free_bikes).toBe(2);
      expect(result.current.sortedStations[1].free_bikes).toBe(5);
      expect(result.current.sortedStations[2].free_bikes).toBe(10);
    });
  });

  describe('sortedStations - sorting by empty_slots', () => {
    it('should sort by empty_slots descending', () => {
      const stations = [
        createMockStation({ id: '1', empty_slots: 5 }),
        createMockStation({ id: '2', empty_slots: 15 }),
        createMockStation({ id: '3', empty_slots: 8 }),
      ];

      const { result } = renderHook(() => useStationsSync(), {
        wrapper: createWrapper(stations),
      });

      act(() => {
        result.current.handleColumnSort('empty_slots');
      });

      expect(result.current.sortedStations[0].empty_slots).toBe(15);
      expect(result.current.sortedStations[1].empty_slots).toBe(8);
      expect(result.current.sortedStations[2].empty_slots).toBe(5);
    });

    it('should place null empty_slots at the end when sorting descending', () => {
      const stations = [
        createMockStation({ id: '1', empty_slots: 5 }),
        createMockStation({ id: '2', empty_slots: null }),
        createMockStation({ id: '3', empty_slots: 10 }),
      ];

      const { result } = renderHook(() => useStationsSync(), {
        wrapper: createWrapper(stations),
      });

      act(() => {
        result.current.handleColumnSort('empty_slots');
      });

      expect(result.current.sortedStations[0].empty_slots).toBe(10);
      expect(result.current.sortedStations[1].empty_slots).toBe(5);
      expect(result.current.sortedStations[2].empty_slots).toBeNull();
    });

    it('should place null empty_slots at the end when sorting ascending', () => {
      const stations = [
        createMockStation({ id: '1', empty_slots: 5 }),
        createMockStation({ id: '2', empty_slots: null }),
        createMockStation({ id: '3', empty_slots: 10 }),
      ];

      const { result } = renderHook(() => useStationsSync(), {
        wrapper: createWrapper(stations),
      });

      act(() => {
        result.current.handleColumnSort('empty_slots');
        result.current.handleColumnSort('empty_slots');
      });

      expect(result.current.sortedStations[0].empty_slots).toBe(5);
      expect(result.current.sortedStations[1].empty_slots).toBe(10);
      expect(result.current.sortedStations[2].empty_slots).toBeNull();
    });

    it('should handle multiple null empty_slots', () => {
      const stations = [
        createMockStation({ id: '1', empty_slots: null }),
        createMockStation({ id: '2', empty_slots: 5 }),
        createMockStation({ id: '3', empty_slots: null }),
      ];

      const { result } = renderHook(() => useStationsSync(), {
        wrapper: createWrapper(stations),
      });

      act(() => {
        result.current.handleColumnSort('empty_slots');
      });

      // Non-null values first
      expect(result.current.sortedStations[0].empty_slots).toBe(5);
      // Null values at end
      expect(result.current.sortedStations[1].empty_slots).toBeNull();
      expect(result.current.sortedStations[2].empty_slots).toBeNull();
    });
  });

  describe('sortedStations - default sorting (by distance)', () => {
    it('should return to distance-based sorting when columnSort is reset', () => {
      // Create stations at different distances from center (40.4168, -3.7038)
      const stations = [
        createMockStation({ id: '1', name: 'Far', latitude: 41.0, longitude: -3.7, free_bikes: 5 }),
        createMockStation({
          id: '2',
          name: 'Close',
          latitude: 40.42,
          longitude: -3.71,
          free_bikes: 10,
        }),
        createMockStation({
          id: '3',
          name: 'Medium',
          latitude: 40.5,
          longitude: -3.8,
          free_bikes: 2,
        }),
      ];

      const { result } = renderHook(() => useStationsSync(), {
        wrapper: createWrapper(stations),
      });

      // Initially sorted by distance (Close should be first)
      expect(result.current.sortedStations[0].name).toBe('Close');

      // Apply column sort
      act(() => {
        result.current.handleColumnSort('free_bikes');
      });

      // Now sorted by free_bikes desc (Close has 10, highest)
      expect(result.current.sortedStations[0].name).toBe('Close');
      expect(result.current.sortedStations[0].free_bikes).toBe(10);

      // Reset sort (third click)
      act(() => {
        result.current.handleColumnSort('free_bikes');
        result.current.handleColumnSort('free_bikes');
      });

      // Back to distance sorting
      expect(result.current.columnSort).toBeNull();
      expect(result.current.sortedStations[0].name).toBe('Close');
    });
  });
});
