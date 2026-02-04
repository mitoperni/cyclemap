import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NetworkPin } from '../network-pin';

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

describe('NetworkPin', () => {
  const defaultProps = {
    id: 'network-1',
    name: 'Bicing',
    city: 'Barcelona',
    longitude: 2.1734,
    latitude: 41.3851,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render a marker with correct coordinates', () => {
      render(<NetworkPin {...defaultProps} />);

      const marker = screen.getByTestId('marker');
      expect(marker).toHaveAttribute('data-longitude', '2.1734');
      expect(marker).toHaveAttribute('data-latitude', '41.3851');
    });

    it('should render accessible button with aria-label', () => {
      render(<NetworkPin {...defaultProps} />);

      expect(screen.getByLabelText('View Bicing network in Barcelona')).toBeInTheDocument();
    });

    it('should not show tooltip by default', () => {
      render(<NetworkPin {...defaultProps} />);

      expect(screen.queryByText('Bicing')).not.toBeInTheDocument();
    });
  });

  describe('tooltip interactions', () => {
    it('should show tooltip on mouse enter', () => {
      render(<NetworkPin {...defaultProps} />);

      // The hover container is the div with class "relative" that wraps button
      const hoverContainer = screen.getByTestId('marker').querySelector('.relative');
      fireEvent.mouseEnter(hoverContainer!);

      expect(screen.getByText('Bicing')).toBeInTheDocument();
      expect(screen.getByText('Barcelona')).toBeInTheDocument();
    });

    it('should hide tooltip on mouse leave', () => {
      render(<NetworkPin {...defaultProps} />);

      const hoverContainer = screen.getByTestId('marker').querySelector('.relative');
      fireEvent.mouseEnter(hoverContainer!);
      expect(screen.getByText('Bicing')).toBeInTheDocument();

      fireEvent.mouseLeave(hoverContainer!);
      expect(screen.queryByText('Bicing')).not.toBeInTheDocument();
    });
  });

  describe('click interactions', () => {
    it('should call onClick with network id when marker is clicked', () => {
      const onClick = vi.fn();
      render(<NetworkPin {...defaultProps} onClick={onClick} />);

      const marker = screen.getByTestId('marker');
      fireEvent.click(marker);

      expect(onClick).toHaveBeenCalledWith('network-1');
    });

    it('should only call onClick once per click', () => {
      const onClick = vi.fn();
      render(<NetworkPin {...defaultProps} onClick={onClick} />);

      const marker = screen.getByTestId('marker');
      fireEvent.click(marker);

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('different network data', () => {
    it('should render with different network data', () => {
      render(
        <NetworkPin
          id="network-2"
          name="Velib"
          city="Paris"
          longitude={2.3522}
          latitude={48.8566}
          onClick={vi.fn()}
        />
      );

      expect(screen.getByLabelText('View Velib network in Paris')).toBeInTheDocument();

      const marker = screen.getByTestId('marker');
      expect(marker).toHaveAttribute('data-longitude', '2.3522');
      expect(marker).toHaveAttribute('data-latitude', '48.8566');
    });
  });
});
