import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MapMarkers } from '../map-markers';
import type { Network } from '@/types';

// Mock react-map-gl/mapbox
vi.mock('react-map-gl/mapbox', () => ({
  Marker: ({
    children,
    onClick,
    longitude,
    latitude,
  }: {
    children: React.ReactNode;
    onClick?: (e: { originalEvent: { stopPropagation: () => void } }) => void;
    longitude: number;
    latitude: number;
  }) => (
    <div
      data-testid="marker"
      data-longitude={longitude}
      data-latitude={latitude}
      onClick={() => onClick?.({ originalEvent: { stopPropagation: vi.fn() } })}
    >
      {children}
    </div>
  ),
}));

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
];

describe('MapMarkers', () => {
  const mockOnMarkerClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render a marker for each network', () => {
      render(<MapMarkers networks={mockNetworks} onMarkerClick={mockOnMarkerClick} />);

      const markers = screen.getAllByTestId('marker');
      expect(markers).toHaveLength(2);
    });

    it('should render markers with correct coordinates', () => {
      render(<MapMarkers networks={mockNetworks} onMarkerClick={mockOnMarkerClick} />);

      const markers = screen.getAllByTestId('marker');

      expect(markers[0]).toHaveAttribute('data-longitude', '2.1734');
      expect(markers[0]).toHaveAttribute('data-latitude', '41.3851');
      expect(markers[1]).toHaveAttribute('data-longitude', '2.3522');
      expect(markers[1]).toHaveAttribute('data-latitude', '48.8566');
    });

    it('should render accessible buttons with aria-labels', () => {
      render(<MapMarkers networks={mockNetworks} onMarkerClick={mockOnMarkerClick} />);

      expect(screen.getByLabelText('View Bicing network in Barcelona')).toBeInTheDocument();
      expect(screen.getByLabelText('View Velib network in Paris')).toBeInTheDocument();
    });

    it('should handle empty networks array', () => {
      render(<MapMarkers networks={[]} onMarkerClick={mockOnMarkerClick} />);

      const markers = screen.queryAllByTestId('marker');
      expect(markers).toHaveLength(0);
    });
  });

  describe('interactions', () => {
    it('should call onMarkerClick with correct network id', () => {
      render(<MapMarkers networks={mockNetworks} onMarkerClick={mockOnMarkerClick} />);

      const markers = screen.getAllByTestId('marker');
      fireEvent.click(markers[0]);

      expect(mockOnMarkerClick).toHaveBeenCalledWith('network-1');
    });

    it('should call onMarkerClick for second marker', () => {
      render(<MapMarkers networks={mockNetworks} onMarkerClick={mockOnMarkerClick} />);

      const markers = screen.getAllByTestId('marker');
      fireEvent.click(markers[1]);

      expect(mockOnMarkerClick).toHaveBeenCalledWith('network-2');
    });

    it('should only call onMarkerClick once per click', () => {
      render(<MapMarkers networks={mockNetworks} onMarkerClick={mockOnMarkerClick} />);

      const markers = screen.getAllByTestId('marker');
      fireEvent.click(markers[0]);

      expect(mockOnMarkerClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('memoization', () => {
    it('should render same output for same networks', () => {
      const { rerender } = render(
        <MapMarkers networks={mockNetworks} onMarkerClick={mockOnMarkerClick} />
      );

      const markersBeforeRerender = screen.getAllByTestId('marker');

      // Rerender with same props
      rerender(<MapMarkers networks={mockNetworks} onMarkerClick={mockOnMarkerClick} />);

      const markersAfterRerender = screen.getAllByTestId('marker');

      expect(markersBeforeRerender.length).toBe(markersAfterRerender.length);
    });
  });
});
