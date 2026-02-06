'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
  const hasAutoRequestedRef = useRef(false);

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

        // Only store if permission was denied - to avoid asking again this session
        if (errorType === 'PERMISSION_DENIED') {
          try {
            sessionStorage.setItem(GEOLOCATION_CONFIG.STORAGE_KEY, 'denied');
          } catch {
            // Ignore storage errors
          }
        }
      },
      GEOLOCATION_CONFIG.DEFAULT_OPTIONS
    );
  }, []);

  // Auto-request location on first load
  useEffect(() => {
    if (hasAutoRequestedRef.current) return;
    hasAutoRequestedRef.current = true;

    // Check if user previously denied permission - don't ask again in this session
    try {
      const previouslyDenied = sessionStorage.getItem(GEOLOCATION_CONFIG.STORAGE_KEY) === 'denied';
      if (previouslyDenied) {
        setHasAskedPermission(true);
        setError('PERMISSION_DENIED');
        return;
      }
    } catch {
      // Ignore storage errors
    }

    // Always request location (will be silent if permission was already granted)
    requestLocation();
  }, [requestLocation]);

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
