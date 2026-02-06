import { ArrowDownUp, ArrowDown, ArrowUp } from 'lucide-react';
import type { StationSort } from '@/types';

interface SortIconProps {
  field: StationSort['field'];
  columnSort: StationSort | null;
}

export function SortIcon({ field, columnSort }: SortIconProps) {
  if (columnSort?.field !== field) {
    return <ArrowDownUp className="ml-2 h-3 w-3" />;
  }
  return columnSort.direction === 'desc' ? (
    <ArrowDown className="ml-1 h-4 w-4 text-grenadier-400" />
  ) : (
    <ArrowUp className="ml-1 h-4 w-4 text-grenadier-400" />
  );
}
