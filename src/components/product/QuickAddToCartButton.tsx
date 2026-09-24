'use client';

import { useState } from 'react';
import { useCartStore, type CartItemType } from '@/lib/cart';

export default function QuickAddToCartButton({ product, className = '', wide = false }: { product: Omit<CartItemType, 'quantity'>; className?: string; wide?: boolean }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  function addToCart() {
    addItem({ ...product, quantity: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return <button type="button" onClick={addToCart} className={`${wide ? 'w-full' : 'w-max min-w-[120px]'} mt-4 rounded-full border border-[#fcd200] bg-[#ffd814] px-5 py-2 text-sm font-medium hover:bg-[#f7ca00] ${className}`}>{added ? 'Added to cart' : 'Add to cart'}</button>;
}
