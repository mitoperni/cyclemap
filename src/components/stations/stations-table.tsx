import { StationRow } from './station-row';
import type { Station } from '@/types';

interface StationsTableProps {
  stations: Station[];
}

export function StationsTable({ stations }: StationsTableProps) {
  if (stations.length === 0) {
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
              {stations.length}
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
            <th className="py-2 h-9 w-[130.5px] text-center font-medium">
              <span className="leading-5">FREE BIKES</span>
            </th>
            <th className="p-2 ps-0 h-9 w-[138.5px] text-center font-medium">
              <span className="leading-5">EMPTY SLOTS</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <StationRow key={station.id} station={station} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
