'use client';

import { memo, useState, useCallback } from 'react';
import { Marker } from 'react-map-gl/mapbox';
import { Bike } from 'lucide-react';
import { cn, cleanStationName } from '@/lib/utils';
import type { Station } from '@/types';

interface StationPinProps {
  station: Station;
  isSelected: boolean;
  onClick: (station: Station) => void;
}

export const StationPin = memo(
  function StationPin({ station, isSelected, onClick }: StationPinProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const cleanName = cleanStationName(station.name);

    const handleClick = useCallback(
      (e: { originalEvent: MouseEvent }) => {
        e.originalEvent.stopPropagation();
        onClick(station);
      },
      [station, onClick]
    );

    return (
      <Marker
        longitude={station.longitude}
        latitude={station.latitude}
        anchor="bottom"
        onClick={handleClick}
        style={{ zIndex: showTooltip || isSelected ? 10 : 1 }}
      >
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* Hover tooltip - only show when not selected (popup will show details) */}
          {showTooltip && !isSelected && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap z-10">
              <div className="bg-white text-xs px-2 py-1.5 rounded shadow-lg border border-torea-bay-100">
                <p className="font-medium text-torea-bay-900">{cleanName}</p>
              </div>
              {/* Tooltip arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-white border-b border-r border-torea-bay-100 rotate-45" />
            </div>
          )}

          {/* Pin marker */}
          <button
            className="group flex flex-col items-center focus:outline-none cursor-pointer"
            aria-label={`View station ${cleanName}`}
          >
            <div className="relative">
              {/* Pin head */}
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full shadow-lg transition-all duration-200',
                  isSelected
                    ? 'bg-grenadier-500 scale-125'
                    : 'bg-torea-bay-600 group-hover:scale-110 group-hover:bg-grenadier-500 group-focus:scale-110 group-focus:bg-grenadier-500'
                )}
              >
                <Bike className="h-3.5 w-3.5 text-white" />
              </div>
              {/* Pin point/needle */}
              <div
                className={cn(
                  'absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0',
                  'border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px]',
                  'transition-colors duration-200',
                  isSelected
                    ? 'border-t-grenadier-500'
                    : 'border-t-torea-bay-600 group-hover:border-t-grenadier-500 group-focus:border-t-grenadier-500'
                )}
              />
            </div>
          </button>
        </div>
      </Marker>
    );
  },
  (prevProps, nextProps) =>
    prevProps.station.id === nextProps.station.id &&
    prevProps.station.name === nextProps.station.name &&
    prevProps.station.longitude === nextProps.station.longitude &&
    prevProps.station.latitude === nextProps.station.latitude &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.onClick === nextProps.onClick
);
