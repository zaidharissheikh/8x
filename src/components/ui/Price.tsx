import { cn } from '@/lib/utils';

export function Price({ 
  amount, 
  currency = '$', 
  originalAmount, 
  className 
}: { 
  amount: number | string; 
  currency?: string; 
  originalAmount?: number | string; 
  className?: string; 
}) {
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className="font-heading text-lg font-bold">
        {currency}{amount}
      </span>
      {originalAmount && (
        <span className="text-sm text-graphite line-through">
          {currency}{originalAmount}
        </span>
      )}
    </div>
  );
}
