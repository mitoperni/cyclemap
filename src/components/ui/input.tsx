import { forwardRef, type InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  showSearchIcon?: boolean;
  onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, showSearchIcon = false, onClear, value, ...props }, ref) => {
    const hasValue = value !== undefined && value !== '';

    return (
      <div
        className={cn(
          'flex h-12 flex-1 items-center gap-2 rounded-full border border-torea-bay-200 bg-white px-4',
          className
        )}
      >
        {showSearchIcon && <Search className="h-6 w-6 shrink-0 text-torea-bay-800" />}
        <input
          className="w-full bg-transparent text-base text-torea-bay-800 placeholder:text-torea-bay-800 focus:outline-none"
          ref={ref}
          value={value}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded-full p-1 text-torea-bay-400 hover:bg-torea-bay-100 hover:text-torea-bay-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
