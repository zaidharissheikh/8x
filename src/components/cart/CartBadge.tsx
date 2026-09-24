'use client';
import { useCartStore } from '@/lib/cart';
import { useSyncExternalStore } from 'react';

export default function CartBadge() {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  if (!mounted) {
    return <span className="absolute top-[2px] right-1/2 translate-x-[6px] text-[#F3A847] font-bold text-[16px] leading-none">0</span>;
  }

  return (
    <span className="absolute top-[2px] right-1/2 translate-x-[6px] text-[#F3A847] font-bold text-[16px] leading-none">
      {totalItems}
    </span>
  );
}
