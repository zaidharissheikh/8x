'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuantityStepper({ value, max, onChange, className }: { value: number; max: number; onChange: (value: number) => void, className?: string }) {
  return (
    <div className={cn("inline-flex items-stretch border border-black/20 bg-gallery h-11", className)} aria-label="Quantity selector">
      <button 
        type="button" 
        onClick={() => onChange(Math.max(1, value - 1))} 
        disabled={value <= 1} 
        className="flex w-10 items-center justify-center border-r border-black/10 text-black hover:bg-concrete disabled:cursor-not-allowed disabled:opacity-40 transition-colors" 
        aria-label="Decrease quantity"
      >
        <Minus size={15} />
      </button>
      <span className="flex min-w-[2.5rem] items-center justify-center px-2 text-sm font-bold" aria-live="polite">
        {value}
      </span>
      <button 
        type="button" 
        onClick={() => onChange(Math.min(max, value + 1))} 
        disabled={value >= max} 
        className="flex w-10 items-center justify-center border-l border-black/10 text-black hover:bg-concrete disabled:cursor-not-allowed disabled:opacity-40 transition-colors" 
        aria-label="Increase quantity"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
