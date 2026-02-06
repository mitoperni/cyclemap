import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NearMeButton } from '../../ui/near-me-button';
import { useGeolocationContext } from '@/contexts';
import { GEOLOCATION_CONFIG } from '@/lib/constants';

// Mock the useGeolocationContext hook
vi.mock('@/contexts', async () => {
  const actual = await vi.importActual('@/contexts');
  return {
    ...actual,
    useGeolocationContext: vi.fn(),
  };
});

const mockUseGeolocationContext = useGeolocationContext as ReturnType<typeof vi.fn>;

const createMockMapRef = () => ({
  current: {
    flyTo: vi.fn(),
  },
});

describe('NearMeButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('default state', () => {
    it('should render location button', () => {
      mockUseGeolocationContext.mockReturnValue({
        position: null,
        isLoading: false,
        error: null,
        errorMessage: null,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      render(<NearMeButton mapRef={createMockMapRef() as never} />);

      const button = screen.getByRole('button', { name: /center map on my location/i });
      expect(button).toBeInTheDocument();
    });

    it('should call requestLocation when clicked', () => {
      const requestLocation = vi.fn();
      mockUseGeolocationContext.mockReturnValue({
        position: null,
        isLoading: false,
        error: null,
        errorMessage: null,
        requestLocation,
        clearError: vi.fn(),
      });

      render(<NearMeButton mapRef={createMockMapRef() as never} />);

      fireEvent.click(screen.getByRole('button'));

      expect(requestLocation).toHaveBeenCalledTimes(1);
    });
  });

  describe('loading state', () => {
    it('should show loading spinner when isLoading is true', () => {
      mockUseGeolocationContext.mockReturnValue({
        position: null,
        isLoading: true,
        error: null,
        errorMessage: null,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      render(<NearMeButton mapRef={createMockMapRef() as never} />);

      const button = screen.getByRole('button', { name: /getting your location/i });
      expect(button).toBeDisabled();
    });
  });

  describe('error state', () => {
    it('should show error state when there is an error', () => {
      mockUseGeolocationContext.mockReturnValue({
        position: null,
        isLoading: false,
        error: 'PERMISSION_DENIED',
        errorMessage: 'Location access was denied.',
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      render(<NearMeButton mapRef={createMockMapRef() as never} />);

      const button = screen.getByRole('button', { name: /retry getting location/i });
      expect(button).toBeInTheDocument();
    });

    it('should clear error and retry when error button is clicked', () => {
      const clearError = vi.fn();
      const requestLocation = vi.fn();
      mockUseGeolocationContext.mockReturnValue({
        position: null,
        isLoading: false,
        error: 'PERMISSION_DENIED',
        errorMessage: 'Location access was denied.',
        requestLocation,
        clearError,
      });

      render(<NearMeButton mapRef={createMockMapRef() as never} />);

      fireEvent.click(screen.getByRole('button'));

      expect(clearError).toHaveBeenCalledTimes(1);
      expect(requestLocation).toHaveBeenCalledTimes(1);
    });
  });

  describe('map integration', () => {
    it('should call flyTo with default zoom when position is received', async () => {
      const mapRef = createMockMapRef();
      const position = { latitude: 40.4168, longitude: -3.7038 };

      mockUseGeolocationContext.mockReturnValue({
        position,
        isLoading: false,
        error: null,
        errorMessage: null,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      render(<NearMeButton mapRef={mapRef as never} />);

      // Click the button to trigger flyTo
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(mapRef.current.flyTo).toHaveBeenCalledWith({
          center: [-3.7038, 40.4168],
          zoom: GEOLOCATION_CONFIG.NETWORK_ZOOM,
          duration: expect.any(Number),
          essential: true,
        });
      });
    });

    it('should call flyTo with custom zoom when zoom prop is provided', async () => {
      const mapRef = createMockMapRef();
      const position = { latitude: 40.4168, longitude: -3.7038 };

      mockUseGeolocationContext.mockReturnValue({
        position,
        isLoading: false,
        error: null,
        errorMessage: null,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      render(<NearMeButton mapRef={mapRef as never} zoom={GEOLOCATION_CONFIG.STATION_ZOOM} />);

      // Click the button to trigger flyTo
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(mapRef.current.flyTo).toHaveBeenCalledWith({
          center: [-3.7038, 40.4168],
          zoom: GEOLOCATION_CONFIG.STATION_ZOOM,
          duration: expect.any(Number),
          essential: true,
        });
      });
    });

    it('should not call flyTo when position is null', () => {
      const mapRef = createMockMapRef();

      mockUseGeolocationContext.mockReturnValue({
        position: null,
        isLoading: false,
        error: null,
        errorMessage: null,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      render(<NearMeButton mapRef={mapRef as never} />);

      expect(mapRef.current.flyTo).not.toHaveBeenCalled();
    });

    it('should not call flyTo when mapRef.current is null', () => {
      const mapRef = { current: null };
      const position = { latitude: 40.4168, longitude: -3.7038 };

      mockUseGeolocationContext.mockReturnValue({
        position,
        isLoading: false,
        error: null,
        errorMessage: null,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      // Should not throw
      expect(() => render(<NearMeButton mapRef={mapRef as never} />)).not.toThrow();
    });
  });

  describe('accessibility', () => {
    it('should have accessible button in default state', () => {
      mockUseGeolocationContext.mockReturnValue({
        position: null,
        isLoading: false,
        error: null,
        errorMessage: null,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      render(<NearMeButton mapRef={createMockMapRef() as never} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAccessibleName();
    });

    it('should have title attribute with error message in error state', () => {
      mockUseGeolocationContext.mockReturnValue({
        position: null,
        isLoading: false,
        error: 'PERMISSION_DENIED',
        errorMessage: 'Location access was denied.',
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      render(<NearMeButton mapRef={createMockMapRef() as never} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Location access was denied.');
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      mockUseGeolocationContext.mockReturnValue({
        position: null,
        isLoading: false,
        error: null,
        errorMessage: null,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      render(<NearMeButton mapRef={createMockMapRef() as never} className="custom-class" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });
});
