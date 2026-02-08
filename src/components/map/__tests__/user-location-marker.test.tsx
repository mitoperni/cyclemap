import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserLocationMarker } from '../user-location-marker';
import { useGeolocationContext } from '@/contexts';

// Mock react-map-gl/mapbox
vi.mock('react-map-gl/mapbox', () => ({
  Marker: ({
    children,
    longitude,
    latitude,
    className,
  }: {
    children: React.ReactNode;
    longitude: number;
    latitude: number;
    className?: string;
  }) => (
    <div
      data-testid="marker"
      data-longitude={longitude}
      data-latitude={latitude}
      className={className}
    >
      {children}
    </div>
  ),
}));

// Mock the useGeolocationContext hook
vi.mock('@/contexts', async () => {
  const actual = await vi.importActual('@/contexts');
  return {
    ...actual,
    useGeolocationContext: vi.fn(),
  };
});

const mockUseGeolocationContext = useGeolocationContext as ReturnType<typeof vi.fn>;

describe('UserLocationMarker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when position is null', () => {
    it('should not render anything', () => {
      mockUseGeolocationContext.mockReturnValue({
        position: null,
        isLoading: false,
        error: null,
        errorMessage: null,
        hasAskedPermission: false,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      const { container } = render(<UserLocationMarker />);

      expect(container.innerHTML).toBe('');
      expect(screen.queryByTestId('marker')).not.toBeInTheDocument();
    });

    it('should not render when permission is denied', () => {
      mockUseGeolocationContext.mockReturnValue({
        position: null,
        isLoading: false,
        error: 'PERMISSION_DENIED',
        errorMessage: 'Location access was denied.',
        hasAskedPermission: true,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      const { container } = render(<UserLocationMarker />);

      expect(container.innerHTML).toBe('');
    });

    it('should not render when loading', () => {
      mockUseGeolocationContext.mockReturnValue({
        position: null,
        isLoading: true,
        error: null,
        errorMessage: null,
        hasAskedPermission: true,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      const { container } = render(<UserLocationMarker />);

      expect(container.innerHTML).toBe('');
    });
  });

  describe('when position is available', () => {
    const mockPosition = { latitude: 40.4168, longitude: -3.7038, accuracy: 10 };

    beforeEach(() => {
      mockUseGeolocationContext.mockReturnValue({
        position: mockPosition,
        isLoading: false,
        error: null,
        errorMessage: null,
        hasAskedPermission: true,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });
    });

    it('should render a marker at the user position', () => {
      render(<UserLocationMarker />);

      const marker = screen.getByTestId('marker');
      expect(marker).toBeInTheDocument();
      expect(marker).toHaveAttribute('data-longitude', '-3.7038');
      expect(marker).toHaveAttribute('data-latitude', '40.4168');
    });

    it('should render with role="img" and accessible label', () => {
      render(<UserLocationMarker />);

      const locationIndicator = screen.getByRole('img', { name: 'Your location' });
      expect(locationIndicator).toBeInTheDocument();
    });

    it('should render the pulse ring element', () => {
      render(<UserLocationMarker />);

      const container = screen.getByLabelText('Your location');
      const pulseRing = container.querySelector('.animate-ping');
      expect(pulseRing).toBeInTheDocument();
    });

    it('should render the inner dot element', () => {
      render(<UserLocationMarker />);

      const container = screen.getByLabelText('Your location');
      const innerDot = container.querySelector('.bg-torea-bay-500.rounded-full.border-2');
      expect(innerDot).toBeInTheDocument();
    });

    it('should apply user-location-marker class to Marker for CSS pointer-events override', () => {
      render(<UserLocationMarker />);

      const marker = screen.getByTestId('marker');
      expect(marker).toHaveClass('user-location-marker');
    });
  });

  describe('with different coordinates', () => {
    it('should render at the correct coordinates', () => {
      mockUseGeolocationContext.mockReturnValue({
        position: { latitude: 48.8566, longitude: 2.3522 },
        isLoading: false,
        error: null,
        errorMessage: null,
        hasAskedPermission: true,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      render(<UserLocationMarker />);

      const marker = screen.getByTestId('marker');
      expect(marker).toHaveAttribute('data-longitude', '2.3522');
      expect(marker).toHaveAttribute('data-latitude', '48.8566');
    });
  });
});
