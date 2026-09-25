import { cn } from '@/lib/utils';
import { Button } from './Button';

export function EmptyState({ 
  title, 
  description, 
  action, 
  className 
}: { 
  title: string; 
  description?: string; 
  action?: { label: string; onClick: () => void }; 
  className?: string; 
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 px-6 text-center border border-black/10 bg-gallery", className)}>
      <h3 className="font-heading text-2xl font-bold mb-3">{title}</h3>
      {description && <p className="text-graphite mb-8 max-w-md">{description}</p>}
      {action && (
        <Button onClick={action.onClick} variant="outline">{action.label}</Button>
      )}
    </div>
  );
}

export function ErrorState({ 
  title = "Something went wrong", 
  description, 
  onRetry, 
  className 
}: { 
  title?: string; 
  description?: string; 
  onRetry?: () => void; 
  className?: string; 
}) {
  return (
    <div className={cn("flex flex-col items-start p-8 border-l-4 border-oxblood bg-concrete/30", className)}>
      <h3 className="font-heading text-xl font-bold text-oxblood mb-2">{title}</h3>
      {description && <p className="text-black mb-6">{description}</p>}
      {onRetry && (
        <Button onClick={onRetry} variant="accent" size="sm">Try Again</Button>
      )}
    </div>
  );
}
