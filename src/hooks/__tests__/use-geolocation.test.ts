import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGeolocation } from '../use-geolocation';

const createMockGeolocation = () => ({
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
});

describe('useGeolocation', () => {
  let mockGeolocation: ReturnType<typeof createMockGeolocation>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGeolocation = createMockGeolocation();
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should start with null position, not loading, and no error', () => {
      const { result } = renderHook(() => useGeolocation());

      expect(result.current.position).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.errorMessage).toBeNull();
    });
  });

  describe('successful location request', () => {
    it('should set loading to true when requesting location', () => {
      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.requestLocation();
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should return position on success', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 40.4168,
            longitude: -3.7038,
            accuracy: 10,
          },
          timestamp: 1234567890,
        });
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.requestLocation();
      });

      await waitFor(() => {
        expect(result.current.position).toEqual({
          latitude: 40.4168,
          longitude: -3.7038,
          accuracy: 10,
          timestamp: 1234567890,
        });
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('error handling', () => {
    it('should handle PERMISSION_DENIED error', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
        error({ code: 1, message: 'Permission denied', PERMISSION_DENIED: 1 });
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.requestLocation();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('PERMISSION_DENIED');
        expect(result.current.errorMessage).toContain('denied');
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle POSITION_UNAVAILABLE error', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
        error({ code: 2, message: 'Position unavailable', POSITION_UNAVAILABLE: 2 });
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.requestLocation();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('POSITION_UNAVAILABLE');
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle TIMEOUT error', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
        error({ code: 3, message: 'Timeout', TIMEOUT: 3 });
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.requestLocation();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('TIMEOUT');
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle browser not supporting geolocation', () => {
      Object.defineProperty(navigator, 'geolocation', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.requestLocation();
      });

      expect(result.current.error).toBe('NOT_SUPPORTED');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error when called', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
        error({ code: 1, message: 'Permission denied', PERMISSION_DENIED: 1 });
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.requestLocation();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('PERMISSION_DENIED');
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.errorMessage).toBeNull();
    });
  });

  describe('duplicate request prevention', () => {
    it('should not make duplicate requests while one is in flight', () => {
      mockGeolocation.getCurrentPosition.mockImplementation(() => {
        // Do nothing - simulates pending request
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.requestLocation();
        result.current.requestLocation();
        result.current.requestLocation();
      });

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
    });
  });

  describe('custom options', () => {
    it('should pass custom options to geolocation API', () => {
      const customOptions = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      };

      const { result } = renderHook(() => useGeolocation(customOptions));

      act(() => {
        result.current.requestLocation();
      });

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        expect.objectContaining(customOptions)
      );
    });
  });
});
