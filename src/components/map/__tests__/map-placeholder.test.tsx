import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MapPlaceholder } from '../map-placeholder';
import type { Network, Station } from '@/types';

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

describe('MapPlaceholder', () => {
  describe('rendering', () => {
    it('should render development mode title', () => {
      render(<MapPlaceholder networks={mockNetworks} />);

      expect(screen.getByText('Development Mode')).toBeInTheDocument();
    });

    it('should render instruction to enable map', () => {
      render(<MapPlaceholder networks={mockNetworks} />);

      expect(screen.getByText(/Mapbox is disabled/)).toBeInTheDocument();
      expect(screen.getByText('NEXT_PUBLIC_USE_REAL_MAP=true')).toBeInTheDocument();
    });

    it('should render network count', () => {
      render(<MapPlaceholder networks={mockNetworks} />);

      expect(screen.getByText('3 networks available')).toBeInTheDocument();
    });

    it('should render alert icon', () => {
      render(<MapPlaceholder networks={mockNetworks} />);

      const iconContainer = document.querySelector('.bg-amber-100');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('with different network counts', () => {
    it('should show correct count for single network', () => {
      render(<MapPlaceholder networks={[mockNetworks[0]]} />);

      expect(screen.getByText('1 networks available')).toBeInTheDocument();
    });

    it('should show zero for empty networks array', () => {
      render(<MapPlaceholder networks={[]} />);

      expect(screen.getByText('0 networks available')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<MapPlaceholder networks={mockNetworks} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Development Mode');
    });
  });

  describe('with stations', () => {
    const mockStations: Station[] = [
      {
        id: 'station-1',
        name: 'Station A',
        latitude: 41.3851,
        longitude: 2.1734,
        free_bikes: 5,
        empty_slots: 10,
        timestamp: '2024-01-01T00:00:00Z',
      },
      {
        id: 'station-2',
        name: 'Station B',
        latitude: 41.3861,
        longitude: 2.1744,
        free_bikes: 3,
        empty_slots: 12,
        timestamp: '2024-01-01T00:00:00Z',
      },
    ];

    it('should render station count', () => {
      render(<MapPlaceholder stations={mockStations} />);

      expect(screen.getByText('2 stations available')).toBeInTheDocument();
    });

    it('should show zero for empty stations array', () => {
      render(<MapPlaceholder stations={[]} />);

      expect(screen.getByText('0 stations available')).toBeInTheDocument();
    });
  });
});
