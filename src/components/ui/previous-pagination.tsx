import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreviousPaginationProps {
  canGoPrevious: boolean;
  isDark: boolean;
  onClick: () => void;
  className?: string;
}

const PreviousPagination = ({ canGoPrevious, isDark, onClick }: PreviousPaginationProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!canGoPrevious}
      aria-label="Go to previous page"
      className={cn(
        'flex items-center justify-center rounded-md transition-colors px-4 py-[10px]',
        canGoPrevious
          ? isDark
            ? 'text-torea-bay-50 hover:bg-torea-bay-50 hover:text-torea-bay-950'
            : 'text-torea-bay-950 hover:bg-torea-bay-100'
          : isDark
            ? 'text-torea-bay-400 cursor-not-allowed'
            : 'text-torea-bay-200 cursor-not-allowed'
      )}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="ml-1">Previous</span>
    </button>
  );
};

export default PreviousPagination;
