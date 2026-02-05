'use client';

import { useState, useCallback, useRef } from 'react';
import type { GeolocationPosition, GeolocationError } from '@/types';
import { GEOLOCATION_CONFIG } from '@/lib/constants';

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

interface UseGeolocationReturn {
  position: GeolocationPosition | null;
  isLoading: boolean;
  error: GeolocationError | null;
  errorMessage: string | null;
  requestLocation: () => void;
  clearError: () => void;
}

const ERROR_MESSAGES: Record<GeolocationError, string> = {
  PERMISSION_DENIED:
    'Location access was denied. Please enable location permissions in your browser settings.',
  POSITION_UNAVAILABLE: 'Unable to determine your location. Please try again.',
  TIMEOUT: 'Location request timed out. Please try again.',
  NOT_SUPPORTED: 'Geolocation is not supported by your browser.',
};

export function useGeolocation(options: GeolocationOptions = {}): UseGeolocationReturn {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GeolocationError | null>(null);

  const requestInFlightRef = useRef(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('NOT_SUPPORTED');
      return;
    }

    if (requestInFlightRef.current) {
      return;
    }

    requestInFlightRef.current = true;
    setIsLoading(true);
    setError(null);

    const mergedOptions: PositionOptions = {
      ...GEOLOCATION_CONFIG.DEFAULT_OPTIONS,
      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
        setIsLoading(false);
        requestInFlightRef.current = false;
      },
      (err) => {
        let errorType: GeolocationError;

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorType = 'PERMISSION_DENIED';
            break;
          case err.POSITION_UNAVAILABLE:
            errorType = 'POSITION_UNAVAILABLE';
            break;
          case err.TIMEOUT:
            errorType = 'TIMEOUT';
            break;
          default:
            errorType = 'POSITION_UNAVAILABLE';
        }

        setError(errorType);
        setIsLoading(false);
        requestInFlightRef.current = false;
      },
      mergedOptions
    );
  }, [options]);

  return {
    position,
    isLoading,
    error,
    errorMessage: error ? ERROR_MESSAGES[error] : null,
    requestLocation,
    clearError,
  };
}
