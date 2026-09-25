import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-11 w-full appearance-none rounded-none border border-black/20 bg-gallery px-3 py-2 pr-8 text-sm text-black transition-colors",
            "focus-visible:outline-none focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-oxblood focus-visible:border-oxblood focus-visible:ring-oxblood",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-graphite text-[10px]">
          ▼
        </span>
      </div>
    );
  }
);
Select.displayName = 'Select';
