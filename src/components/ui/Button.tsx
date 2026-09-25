import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          "rounded-none", // Sharp architecture
          {
            'bg-black text-white hover:bg-black/90 active:scale-[0.98]': variant === 'primary',
            'bg-concrete text-black hover:bg-concrete/80': variant === 'secondary',
            'border border-black bg-transparent hover:bg-black hover:text-white': variant === 'outline',
            'hover:bg-concrete hover:text-black': variant === 'ghost',
            'bg-oxblood text-white hover:bg-oxblood/90': variant === 'accent',
            'h-9 px-4': size === 'sm',
            'h-11 px-6': size === 'md',
            'h-14 px-8 text-base': size === 'lg',
            'h-11 w-11': size === 'icon',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
