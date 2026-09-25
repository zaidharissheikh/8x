import { cn } from '@/lib/utils';

export function ModalBase({ 
  isOpen, 
  onClose, 
  children, 
  className 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode; 
  className?: string; 
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gallery/90 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative z-10 w-full max-w-lg bg-gallery border border-black p-8 shadow-flat checkout-modal", className)}>
        <button onClick={onClose} className="absolute top-4 right-4 text-graphite hover:text-black transition-colors">
          <span className="text-xl leading-none">✕</span>
        </button>
        {children}
      </div>
    </div>
  );
}

export function DrawerBase({ 
  isOpen, 
  onClose, 
  children, 
  side = 'right', 
  className 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode; 
  side?: 'left' | 'right'; 
  className?: string; 
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-gallery/90 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        "relative z-10 h-full w-full max-w-md bg-gallery border-black shadow-flat checkout-panel flex flex-col", 
        side === 'right' ? 'ml-auto border-l' : 'mr-auto border-r',
        className
      )}>
        <button onClick={onClose} className="absolute top-4 right-4 z-20 text-graphite hover:text-black transition-colors bg-gallery p-2">
          <span className="text-xl leading-none">✕</span>
        </button>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
