import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group relative flex flex-col bg-gallery rounded-none border border-black/10 transition-colors hover:border-black/30",
        className
      )}
      {...props}
    />
  );
}

export function CardImage({ className, src, alt, aspect = 'square' }: { className?: string; src: string; alt: string; aspect?: 'square' | 'video' | 'portrait' }) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-concrete/30",
        {
          'aspect-square': aspect === 'square',
          'aspect-video': aspect === 'video',
          'aspect-[3/4]': aspect === 'portrait',
        },
        className
      )}
    >
      {/* GSAP-friendly scaling target */}
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
        <img 
          src={src} 
          alt={alt} 
          className="h-full w-full object-cover mix-blend-multiply" 
          loading="lazy"
        />
      </div>
    </div>
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col p-4", className)} {...props} />;
}
