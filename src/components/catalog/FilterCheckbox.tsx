'use client';

import { cn } from '@/lib/utils';

export default function FilterCheckbox({ name, value, label, checked, type = 'checkbox', className = '' }: { name: string; value: string; label: React.ReactNode; checked: boolean; type?: 'checkbox' | 'radio'; className?: string }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 group text-sm", className)}>
      <div className="relative flex items-center justify-center mt-0.5">
        <input 
          type={type} 
          name={name} 
          value={value} 
          checked={checked} 
          onChange={(event) => event.currentTarget.form?.requestSubmit()} 
          className="peer h-4 w-4 appearance-none border border-black/30 bg-transparent checked:bg-black checked:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors rounded-none" 
        />
        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="text-graphite group-hover:text-black transition-colors leading-tight">{label}</span>
    </label>
  );
}
