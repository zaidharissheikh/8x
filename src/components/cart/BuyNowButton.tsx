'use client';

import { useRouter } from 'next/navigation';
import { useCartStore, CartItemType } from '@/lib/cart';
import { Button } from '@/components/ui';

export default function BuyNowButton({ product }: { product: Omit<CartItemType, 'quantity'> }) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  function buyNow() {
    addItem({ ...product, quantity: 1 });
    router.push('/checkout');
  }

  return (
    <Button 
      type="button" 
      onClick={buyNow} 
      variant="outline"
      size="lg"
      className="w-full mt-3 text-base border-black text-black bg-transparent hover:bg-black hover:text-white"
    >
      Buy Now
    </Button>
  );
}
