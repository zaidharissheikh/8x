import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-none border border-black/20 bg-gallery px-3 py-2 text-sm text-black transition-colors",
          "focus-visible:outline-none focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "placeholder:text-graphite",
          error && "border-oxblood focus-visible:border-oxblood focus-visible:ring-oxblood",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
