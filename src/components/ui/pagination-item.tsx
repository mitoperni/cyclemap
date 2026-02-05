import { cn } from '@/lib/utils';

interface PaginationItemProps {
  item: number | string;
  currentPage: number;
  onPageChange: (page: number) => void;
  isDark: boolean;
}

const PaginationItem = ({ item, currentPage, onPageChange, isDark }: PaginationItemProps) => {
  if (typeof item === 'string') {
    return (
      <span
        key={`dots-${item}`}
        className={cn('px-2 text-sm font-medium', isDark ? 'text-white' : 'text-torea-bay-800')}
      >
        ...
      </span>
    );
  }

  const page = item as number;
  const isCurrent = page === currentPage;

  return (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      aria-label={`Go to page ${page}`}
      aria-current={isCurrent ? 'page' : undefined}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-1',
        isDark ? 'focus:ring-white/50' : 'focus:ring-torea-bay-500',
        isCurrent
          ? isDark
            ? 'bg-torea-bay-50 text-torea-bay-950'
            : 'bg-torea-bay-100 text-torea-bay-800'
          : isDark
            ? 'text-white hover:bg-white/10'
            : 'text-torea-bay-700 hover:bg-torea-bay-100'
      )}
    >
      {page}
    </button>
  );
};

export default PaginationItem;
