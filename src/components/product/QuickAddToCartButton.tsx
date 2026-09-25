'use client';

import { useState } from 'react';
import { useCartStore, type CartItemType } from '@/lib/cart';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function QuickAddToCartButton({ product, className = '', wide = false }: { product: Omit<CartItemType, 'quantity'>; className?: string; wide?: boolean }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  function addToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({ ...product, quantity: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <Button 
      type="button" 
      onClick={addToCart} 
      variant={added ? 'outline' : 'primary'}
      className={cn(wide ? 'w-full' : 'w-max min-w-[120px]', 'mt-4', className)}
    >
      {added ? 'Added to Cart' : 'Add to Cart'}
    </Button>
  );
}
