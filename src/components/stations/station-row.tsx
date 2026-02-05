import { cn, cleanStationName } from '@/lib/utils';
import type { Station } from '@/types';

interface StationRowProps {
  station: Station;
}

export function StationRow({ station }: StationRowProps) {
  const { name, free_bikes, empty_slots } = station;

  // Determine availability status for visual indicators
  const hasAvailableBikes = free_bikes > 0;
  const hasEmptySlots = empty_slots !== null && empty_slots > 0;
  const cleanName = cleanStationName(name);

  return (
    <tr className="group border-b border-white/50 border-dashed text-sm hover:bg-white/10 duration-300 transition-colors">
      {/* Station name */}
      <td
        className="ps-2 py-[18px] font-normal text-base leading-7 text-white transition-[padding] duration-300 ease-out group-hover:ps-4"
        title={cleanName}
      >
        {cleanName}
      </td>

      {/* Free bikes */}
      <td
        className={cn(
          'py-[18px] text-center font-bold text-base leading-7 w-[130.5px]',
          hasAvailableBikes ? 'text-white' : 'text-grenadier-600'
        )}
      >
        {free_bikes}
      </td>

      {/* Empty slots */}
      <td
        className={cn(
          'py-[18px] pe-2 text-center font-bold text-base leading-7 w-[130.5px]',
          empty_slots === null ? 'text-gray-300' : hasEmptySlots ? 'text-white' : 'text-gray-400'
        )}
      >
        {empty_slots ?? '-'}
      </td>
    </tr>
  );
}
