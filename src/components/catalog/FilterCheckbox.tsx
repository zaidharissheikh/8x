'use client';

export default function FilterCheckbox({ name, value, label, checked, type = 'checkbox', className = '' }: { name: string; value: string; label: React.ReactNode; checked: boolean; type?: 'checkbox' | 'radio'; className?: string }) {
  return <label className={`flex cursor-pointer items-center gap-2 hover:text-[#c7511f] ${className}`}><input type={type} name={name} value={value} checked={checked} onChange={(event) => event.currentTarget.form?.requestSubmit()} className="h-5 w-5 accent-[#007185]" />{label}</label>;
}
