'use client';

import { useRouter } from 'next/navigation';
import { useCartStore, CartItemType } from '@/lib/cart';

export default function BuyNowButton({ product }: { product: Omit<CartItemType, 'quantity'> }) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  function buyNow() {
    addItem({ ...product, quantity: 1 });
    router.push('/checkout');
  }

  return <button type="button" onClick={buyNow} className="mt-2 w-full rounded-full border border-[#fa8900] bg-[#ffa41c] py-1.5 text-sm shadow-sm hover:bg-[#fa8900]">Buy now</button>;
}
