import { forwardRef, type SelectHTMLAttributes } from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  showLocationIcon?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, showLocationIcon = false, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex justify-between h-12 w-[114px] items-center rounded-full border border-torea-bay-200 bg-white px-4',
          className
        )}
      >
        {showLocationIcon && <MapPin className="h-4 w-4 shrink-0 text-torea-bay-800" />}
        <select
          className="w-full appearance-none bg-transparent text-base text-torea-bay-800 text-end"
          ref={ref}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
