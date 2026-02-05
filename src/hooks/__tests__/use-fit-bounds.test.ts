import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFitBounds } from '../use-fit-bounds';
import { MAP_CONFIG } from '@/lib/constants';
import type { Network } from '@/types';

const createMockMapRef = () => {
  const flyTo = vi.fn();
  const fitBounds = vi.fn();

  return {
    current: {
      flyTo,
      fitBounds,
    },
    flyTo,
    fitBounds,
  };
};

const mockNetworks: Network[] = [
  {
    id: 'network-1',
    name: 'Bicing',
    href: '/v2/networks/bicing',
    company: ['Company A'],
    location: {
      city: 'Barcelona',
      country: 'ES',
      latitude: 41.3851,
      longitude: 2.1734,
    },
  },
  {
    id: 'network-2',
    name: 'Velib',
    href: '/v2/networks/velib',
    company: ['Company B'],
    location: {
      city: 'Paris',
      country: 'FR',
      latitude: 48.8566,
      longitude: 2.3522,
    },
  },
  {
    id: 'network-3',
    name: 'BiciMad',
    href: '/v2/networks/bicimad',
    company: ['Company C'],
    location: {
      city: 'Madrid',
      country: 'ES',
      latitude: 40.4168,
      longitude: -3.7038,
    },
  },
];

describe('useFitBounds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('with empty networks', () => {
    it('should not call map methods when networks array is empty', () => {
      const mockRef = createMockMapRef();

      renderHook(() => useFitBounds(mockRef as unknown as React.RefObject<null>, []));

      expect(mockRef.flyTo).not.toHaveBeenCalled();
      expect(mockRef.fitBounds).not.toHaveBeenCalled();
    });

    it('should not call map methods when mapRef.current is null', () => {
      const mockRef = { current: null };

      renderHook(() => useFitBounds(mockRef as React.RefObject<null>, mockNetworks));

      // No error should be thrown
      expect(true).toBe(true);
    });
  });

  describe('with single network', () => {
    it('should call flyTo for a single network', () => {
      const mockRef = createMockMapRef();
      const singleNetwork = [mockNetworks[0]];

      renderHook(() => useFitBounds(mockRef as unknown as React.RefObject<null>, singleNetwork));

      expect(mockRef.flyTo).toHaveBeenCalledWith({
        center: [2.1734, 41.3851],
        zoom: MAP_CONFIG.DETAIL_ZOOM,
        duration: MAP_CONFIG.ANIMATION_DURATION,
        essential: true,
      });
      expect(mockRef.fitBounds).not.toHaveBeenCalled();
    });
  });

  describe('with multiple networks', () => {
    it('should call fitBounds for multiple networks', () => {
      const mockRef = createMockMapRef();

      renderHook(() => useFitBounds(mockRef as unknown as React.RefObject<null>, mockNetworks));

      expect(mockRef.fitBounds).toHaveBeenCalledWith(
        [
          [-3.7038, 40.4168], // SW corner (min lng, min lat)
          [2.3522, 48.8566], // NE corner (max lng, max lat)
        ],
        {
          padding: 50, // FIT_BOUNDS_PADDING from constants
          duration: MAP_CONFIG.ANIMATION_DURATION,
          maxZoom: 12, // FIT_BOUNDS_MAX_ZOOM from constants
          essential: true,
        }
      );
      expect(mockRef.flyTo).not.toHaveBeenCalled();
    });
  });

  describe('deduplication', () => {
    it('should not recalculate bounds if networks have not changed', () => {
      const mockRef = createMockMapRef();

      const { rerender } = renderHook(
        ({ networks }) => useFitBounds(mockRef as unknown as React.RefObject<null>, networks),
        { initialProps: { networks: mockNetworks } }
      );

      expect(mockRef.fitBounds).toHaveBeenCalledTimes(1);

      // Rerender with same networks
      rerender({ networks: mockNetworks });

      // Should still be 1 (no additional call)
      expect(mockRef.fitBounds).toHaveBeenCalledTimes(1);
    });

    it('should recalculate bounds when networks change', () => {
      const mockRef = createMockMapRef();

      const { rerender } = renderHook(
        ({ networks }) => useFitBounds(mockRef as unknown as React.RefObject<null>, networks),
        { initialProps: { networks: mockNetworks } }
      );

      expect(mockRef.fitBounds).toHaveBeenCalledTimes(1);

      // Rerender with different networks
      const newNetworks = [mockNetworks[0], mockNetworks[1]];
      rerender({ networks: newNetworks });

      expect(mockRef.fitBounds).toHaveBeenCalledTimes(2);
    });

    it('should use network ids for change detection, not object reference', () => {
      const mockRef = createMockMapRef();

      const { rerender } = renderHook(
        ({ networks }) => useFitBounds(mockRef as unknown as React.RefObject<null>, networks),
        { initialProps: { networks: mockNetworks } }
      );

      expect(mockRef.fitBounds).toHaveBeenCalledTimes(1);

      // Create new array with same content
      const sameNetworksDifferentRef = [...mockNetworks];
      rerender({ networks: sameNetworksDifferentRef });

      // Should still be 1 because network IDs are the same
      expect(mockRef.fitBounds).toHaveBeenCalledTimes(1);
    });
  });

  describe('transition from multiple to single network', () => {
    it('should switch from fitBounds to flyTo when filtering to single network', () => {
      const mockRef = createMockMapRef();

      const { rerender } = renderHook(
        ({ networks }) => useFitBounds(mockRef as unknown as React.RefObject<null>, networks),
        { initialProps: { networks: mockNetworks } }
      );

      expect(mockRef.fitBounds).toHaveBeenCalledTimes(1);
      expect(mockRef.flyTo).not.toHaveBeenCalled();

      // Filter to single network
      rerender({ networks: [mockNetworks[0]] });

      expect(mockRef.flyTo).toHaveBeenCalledTimes(1);
      expect(mockRef.fitBounds).toHaveBeenCalledTimes(1); // Still 1
    });
  });
});
