'use client';

import { Popup } from 'react-map-gl/mapbox';
import { X, Bike, ParkingSquare } from 'lucide-react';
import { cleanStationName, cn } from '@/lib/utils';
import type { MapPopupProps } from '@/types';

export function StationPopup({ station, onClose }: MapPopupProps) {
  const cleanName = cleanStationName(station.name);
  const hasAvailableBikes = station.free_bikes > 0;
  const hasEmptySlots = station.empty_slots !== null && station.empty_slots > 0;

  return (
    <Popup
      longitude={station.longitude}
      latitude={station.latitude}
      anchor="bottom"
      offset={[0, -20]}
      closeButton={false}
      closeOnClick={false}
      onClose={onClose}
      className="station-popup"
    >
      <div className="min-w-[180px] p-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-torea-bay-900 text-sm leading-tight pr-2">
            {cleanName}
          </h3>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-0.5 rounded hover:bg-gray-100 transition-colors"
            aria-label="Close popup"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-3 flex flex-col gap-2">
          {/* Free bikes */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Bike className="h-4 w-4" />
              <span>Free bikes</span>
            </div>
            <span
              className={cn(
                'font-bold text-sm',
                hasAvailableBikes ? 'text-green-600' : 'text-grenadier-600'
              )}
            >
              {station.free_bikes}
            </span>
          </div>

          {/* Empty slots */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ParkingSquare className="h-4 w-4" />
              <span>Empty slots</span>
            </div>
            <span
              className={cn(
                'font-bold text-sm',
                station.empty_slots === null
                  ? 'text-gray-300'
                  : hasEmptySlots
                    ? 'text-torea-bay-600'
                    : 'text-gray-400'
              )}
            >
              {station.empty_slots ?? '-'}
            </span>
          </div>
        </div>
      </div>
    </Popup>
  );
}
