'use client';

import { useCartStore, CartItemType } from '@/lib/cart';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QuantityStepper from './QuantityStepper';
import { Button } from '@/components/ui';

export default function AddToCartButton({ product }: { product: Omit<CartItemType, 'quantity'> }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const router = useRouter();

  const handleAdd = () => {
    addItem({ ...product, quantity: qty });
    router.push('/cart');
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-graphite mb-2">
        <span>Qty</span>
        <QuantityStepper value={qty} max={Math.min(10, product.stock)} onChange={setQty} />
      </div>
      <Button 
        onClick={handleAdd}
        size="lg"
        className="w-full text-base"
      >
        Add to Cart
      </Button>
    </div>
  );
}
