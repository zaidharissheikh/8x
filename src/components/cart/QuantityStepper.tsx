'use client';

import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({ value, max, onChange }: { value: number; max: number; onChange: (value: number) => void }) {
  return <div className="inline-flex items-center overflow-hidden rounded-md border border-gray-400 bg-white shadow-sm" aria-label="Quantity selector"><button type="button" onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} className="flex h-8 w-8 items-center justify-center border-r border-gray-300 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Decrease quantity"><Minus size={15} /></button><span className="flex h-8 min-w-9 items-center justify-center px-2 text-sm font-medium" aria-live="polite">{value}</span><button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="flex h-8 w-8 items-center justify-center border-l border-gray-300 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Increase quantity"><Plus size={15} /></button></div>;
}
