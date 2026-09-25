import { cn } from '@/lib/utils';

export function Rating({ 
  value, 
  count, 
  className 
}: { 
  value: number; 
  count?: number; 
  className?: string; 
}) {
  return (
    <div className={cn("flex items-center gap-1.5 text-sm", className)}>
      <div className="flex text-black" aria-label={`Rating: ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={cn("text-[16px] leading-none", star <= value ? "opacity-100" : "opacity-20")}>
            ★
          </span>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-graphite font-medium">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
