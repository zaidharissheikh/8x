'use client';

import { useCartStore, CartItemType } from '@/lib/cart';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QuantityStepper from './QuantityStepper';

export default function AddToCartButton({ product }: { product: Omit<CartItemType, 'quantity'> }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const router = useRouter();

  const handleAdd = () => {
    addItem({
      ...product,
      quantity: qty
    });
    router.push('/cart');
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center gap-2 text-sm"><span>Qty:</span><QuantityStepper value={qty} max={Math.min(10, product.stock)} onChange={setQty} /></div>
      <button 
        onClick={handleAdd}
        className="w-full bg-[#FFD814] hover:bg-[#F7CA00] rounded-full py-1.5 text-sm shadow-sm border border-[#FCD200]"
      >
        Add to Cart
      </button>
    </div>
  );
}
