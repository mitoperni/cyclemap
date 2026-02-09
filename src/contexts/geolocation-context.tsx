'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { GeolocationPosition, GeolocationError } from '@/types';
import { GEOLOCATION_CONFIG } from '@/lib/constants';

interface GeolocationContextValue {
  position: GeolocationPosition | null;
  isLoading: boolean;
  error: GeolocationError | null;
  errorMessage: string | null;
  hasAskedPermission: boolean;
  requestLocation: () => void;
  clearError: () => void;
}

const GeolocationContext = createContext<GeolocationContextValue | null>(null);

export function GeolocationProvider({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [hasAskedPermission, setHasAskedPermission] = useState(false);
  const requestInFlightRef = useRef(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('NOT_SUPPORTED');
      setHasAskedPermission(true);
      return;
    }

    if (requestInFlightRef.current) {
      return;
    }

    requestInFlightRef.current = true;
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
        setIsLoading(false);
        setHasAskedPermission(true);
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
        setHasAskedPermission(true);
        requestInFlightRef.current = false;
      },
      GEOLOCATION_CONFIG.MANUAL_OPTIONS
    );
  }, []);

  return (
    <GeolocationContext.Provider
      value={{
        position,
        isLoading,
        error,
        errorMessage: error ? GEOLOCATION_CONFIG.ERROR_MESSAGES[error] : null,
        hasAskedPermission,
        requestLocation,
        clearError,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocationContext(): GeolocationContextValue {
  const context = useContext(GeolocationContext);

  if (!context) {
    throw new Error('useGeolocationContext must be used within a GeolocationProvider');
  }

  return context;
}
