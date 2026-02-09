'use client';

import { useCallback } from 'react';
import { StationRow } from './station-row';
import { Pagination } from '@/components/ui/pagination';
import { SortIcon } from '@/components/ui/sort-icon';
import { useStationsSync } from '@/contexts/stations-sync-context';
import { useSidebarContext } from '@/contexts/sidebar-context';
import { STATIONS_SCROLL_CONTAINER_ID } from '@/lib/constants';
import { getAriaSort } from '@/lib/utils';

export function StationsTable() {
  const {
    sortedStations,
    paginatedStations,
    pagination,
    setCurrentPage,
    flyToStation,
    selectedStationId,
    columnSort,
    handleColumnSort,
  } = useStationsSync();
  const { close: closeSidebar, isLargeScreen } = useSidebarContext();

  const handleStationClick = useCallback(
    (stationId: string) => {
      flyToStation(stationId);
      if (!isLargeScreen) {
        closeSidebar();
      }
    },
    [flyToStation, isLargeScreen, closeSidebar]
  );

  if (sortedStations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-torea-bay-800">No stations available</p>
        <p className="mt-1 text-[14px] font-normal leading-[14px] text-muted-foreground px-1.5 py-1 rounded-sm border">
          This network doesn&apos;t have any stations at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="px-10 pt-2 flex flex-col">
      {/* Stats */}
      <div className="mt-2 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white">
            All{' '}
            <span className="text-sm border border-grenadier-400 rounded-[2px] mx-2 px-1 py-0.5 text-grenadier-400">
              {sortedStations.length}
            </span>
            stations
          </span>
        </div>
      </div>

      <table className="mt-3 w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-sm font-medium text-white">
            <th className="p-2 pe-0 h-9 text-left">
              <span className="leading-5">STATION NAME</span>
            </th>
            <th
              className="py-2 h-9 w-[130.5px] text-center font-medium cursor-pointer hover:text-grenadier-300 transition-colors"
              onClick={() => handleColumnSort('free_bikes')}
              onKeyDown={(e) =>
                (e.key === 'Enter' || e.key === ' ') && handleColumnSort('free_bikes')
              }
              tabIndex={0}
              role="columnheader"
              aria-sort={getAriaSort(columnSort, 'free_bikes')}
            >
              <span className="inline-flex items-center justify-center leading-5">
                FREE BIKES
                <SortIcon field="free_bikes" columnSort={columnSort} />
              </span>
            </th>
            <th
              className="p-2 ps-0 h-9 w-[138.5px] text-center font-medium cursor-pointer hover:text-grenadier-300 transition-colors"
              onClick={() => handleColumnSort('empty_slots')}
              onKeyDown={(e) =>
                (e.key === 'Enter' || e.key === ' ') && handleColumnSort('empty_slots')
              }
              tabIndex={0}
              role="columnheader"
              aria-sort={getAriaSort(columnSort, 'empty_slots')}
            >
              <span className="inline-flex items-center justify-center leading-5">
                EMPTY SLOTS
                <SortIcon field="empty_slots" columnSort={columnSort} />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedStations.map((station) => (
            <StationRow
              key={station.id}
              station={station}
              isSelected={selectedStationId === station.id}
              onClick={() => handleStationClick(station.id)}
            />
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          onPageChange={setCurrentPage}
          variant="dark"
          className="mt-4 pb-4"
          scrollContainerId={STATIONS_SCROLL_CONTAINER_ID}
        />
      )}
    </div>
  );
}
