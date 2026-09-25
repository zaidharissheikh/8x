'use client';

import { Select } from '@/components/ui';

export default function SortSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <Select 
      name="sort" 
      defaultValue={defaultValue} 
      onChange={(e) => e.target.form?.requestSubmit()}
      className="bg-transparent border-black/20 focus-visible:border-black text-sm h-10 w-48"
    >
      <option value="featured">Featured</option>
      <option value="bestsellers">Best Sellers</option>
      <option value="newest">Newest Arrivals</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </Select>
  );
}
