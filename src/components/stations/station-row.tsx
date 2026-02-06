'use client';

import { memo } from 'react';
import { cn, cleanStationName } from '@/lib/utils';
import type { Station } from '@/types';

interface StationRowProps {
  station: Station;
  isSelected?: boolean;
  onClick?: () => void;
}

export const StationRow = memo(function StationRow({
  station,
  isSelected = false,
  onClick,
}: StationRowProps) {
  const { name, free_bikes, empty_slots } = station;

  const hasAvailableBikes = free_bikes > 0;
  const hasEmptySlots = empty_slots !== null && empty_slots > 0;
  const cleanName = cleanStationName(name);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <tr
      className={cn(
        'group border-b border-white/50 border-dashed text-sm hover:bg-white/10 duration-300 transition-colors',
        onClick && 'cursor-pointer',
        isSelected && 'bg-white/20'
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
    >
      <td
        className="ps-2 py-[18px] font-normal text-base leading-7 text-white transition-[padding] duration-300 ease-out group-hover:ps-4 max-w-[180px] truncate"
        title={cleanName}
      >
        {cleanName}
      </td>

      <td
        className={cn(
          'py-[18px] text-center font-bold text-base leading-7 w-[130.5px]',
          hasAvailableBikes ? 'text-white' : 'text-grenadier-600'
        )}
      >
        {free_bikes}
      </td>

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
});
