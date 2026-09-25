import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Breadcrumbs({ items, className }: { items: { label: string; href: string }[]; className?: string }) {
  return (
    <nav className={cn("flex items-center text-sm font-medium text-graphite space-x-2", className)}>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <Link href={item.href} className="hover:text-black transition-colors">{item.label}</Link>
          {index < items.length - 1 && <span className="mx-2 text-black/20">/</span>}
        </div>
      ))}
    </nav>
  );
}

export function Pagination({ currentPage, totalPages, className }: { currentPage: number; totalPages: number; className?: string }) {
  return (
    <div className={cn("flex items-center space-x-2 font-heading", className)}>
      <button 
        disabled={currentPage <= 1} 
        className="px-4 py-2 border border-black/10 disabled:opacity-30 hover:bg-black hover:text-white transition-colors"
      >
        Prev
      </button>
      <span className="px-4 text-base font-bold">{currentPage} <span className="text-graphite font-normal mx-1">of</span> {totalPages}</span>
      <button 
        disabled={currentPage >= totalPages} 
        className="px-4 py-2 border border-black/10 disabled:opacity-30 hover:bg-black hover:text-white transition-colors"
      >
        Next
      </button>
    </div>
  );
}
