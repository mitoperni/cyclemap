import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NextPaginationProps {
  canGoNext: boolean;
  isDark: boolean;
  onClick: () => void;
  className?: string;
}

const NextPagination = ({ canGoNext, isDark, onClick }: NextPaginationProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!canGoNext}
      aria-label="Go to next page"
      className={cn(
        'flex items-center justify-center rounded-md transition-colors px-4 py-[10px]',
        canGoNext
          ? isDark
            ? 'text-torea-bay-50 hover:bg-torea-bay-50 hover:text-torea-bay-950'
            : 'text-torea-bay-950 hover:bg-torea-bay-100'
          : isDark
            ? 'text-torea-bay-400 cursor-not-allowed'
            : 'text-torea-bay-200 cursor-not-allowed'
      )}
    >
      <span className="mr-1">Next</span>
      <ChevronRight className="h-4 w-4" />
    </button>
  );
};

export default NextPagination;
