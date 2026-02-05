import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NearMeButton } from '../near-me-button';
import { GEOLOCATION_CONFIG } from '@/lib/constants';

vi.mock('@/hooks/use-geolocation', () => ({
  useGeolocation: vi.fn(),
}));

import { useGeolocation } from '@/hooks/use-geolocation';

const mockUseGeolocation = useGeolocation as ReturnType<typeof vi.fn>;

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
      mockUseGeolocation.mockReturnValue({
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
      mockUseGeolocation.mockReturnValue({
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
      mockUseGeolocation.mockReturnValue({
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
      mockUseGeolocation.mockReturnValue({
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
      mockUseGeolocation.mockReturnValue({
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

      mockUseGeolocation.mockReturnValue({
        position,
        isLoading: false,
        error: null,
        errorMessage: null,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      render(<NearMeButton mapRef={mapRef as never} />);

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

      mockUseGeolocation.mockReturnValue({
        position,
        isLoading: false,
        error: null,
        errorMessage: null,
        requestLocation: vi.fn(),
        clearError: vi.fn(),
      });

      render(<NearMeButton mapRef={mapRef as never} zoom={GEOLOCATION_CONFIG.STATION_ZOOM} />);

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

      mockUseGeolocation.mockReturnValue({
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

      mockUseGeolocation.mockReturnValue({
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
      mockUseGeolocation.mockReturnValue({
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
      mockUseGeolocation.mockReturnValue({
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
      mockUseGeolocation.mockReturnValue({
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
