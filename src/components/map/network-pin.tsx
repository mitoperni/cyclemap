'use client';

import { useState, useCallback } from 'react';
import { Marker } from 'react-map-gl/mapbox';
import { MapPin } from 'lucide-react';

interface NetworkPinProps {
  id: string;
  name: string;
  city: string;
  longitude: number;
  latitude: number;
  onClick: (id: string) => void;
}

export function NetworkPin({ id, name, city, longitude, latitude, onClick }: NetworkPinProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = useCallback(
    (e: { originalEvent: MouseEvent }) => {
      e.originalEvent.stopPropagation();
      onClick(id);
    },
    [id, onClick]
  );

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      onClick={handleClick}
      style={{ zIndex: showTooltip ? 50 : 1 }}
    >
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        {showTooltip && (
          <div
            role="tooltip"
            aria-live="polite"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap z-10"
          >
            <div className="bg-grenadier-900 text-white text-xs px-3 py-2 rounded shadow-lg">
              <p className="font-medium text-white mb-1">{name}</p>
              <p className="font-medium text-white/80">{city}</p>
            </div>
            {/* Tooltip arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-grenadier-900 rotate-45" />
          </div>
        )}

        {/* Pin marker */}
        <button
          className="group flex flex-col items-center focus:outline-none cursor-pointer"
          aria-label={`View ${name} network in ${city}`}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
        >
          <div className="relative">
            {/* Pin head */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-torea-bay-950 shadow-lg transition-all duration-200 group-hover:scale-110 group-hover:bg-grenadier-600 group-focus:scale-110 group-focus:bg-grenadier-600">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            {/* Pin point/needle */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-torea-bay-950 group-hover:border-t-grenadier-600 group-focus:border-t-grenadier-600 transition-colors duration-200" />
          </div>
        </button>
      </div>
    </Marker>
  );
}
