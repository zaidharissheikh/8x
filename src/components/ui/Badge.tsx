import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent' | 'outline' | 'secondary';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-none border px-2 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none",
        {
          "border-transparent bg-black text-white": variant === 'default',
          "border-transparent bg-oxblood text-white": variant === 'accent',
          "border-transparent bg-concrete text-black": variant === 'secondary',
          "text-black border-black": variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
}
