import { useEffect } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { MAPBOX_CONFIG } from '@/lib/constants';

/**
 * Hook to set Mapbox map labels to a specific language.
 * Uses the @mapbox/mapbox-gl-language plugin.
 * Language is configured via MAPBOX_CONFIG.LANGUAGE in constants.ts
 */
export function useMapLanguage(mapRef: MapRef | null) {
  useEffect(() => {
    if (!mapRef) return;

    const map = mapRef.getMap();
    const languageControl = new MapboxLanguage({
      defaultLanguage: MAPBOX_CONFIG.LANGUAGE,
    });

    map.addControl(languageControl);

    // If style is already loaded, apply language immediately
    if (map.isStyleLoaded()) {
      const style = map.getStyle();
      if (style) {
        map.setStyle(languageControl.setLanguage(style, MAPBOX_CONFIG.LANGUAGE));
      }
    }

    return () => {
      map.removeControl(languageControl);
    };
  }, [mapRef]);
}
