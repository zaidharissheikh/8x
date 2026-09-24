'use client';
import { useCartStore } from '@/lib/cart';
import Image from 'next/image';
import Link from 'next/link';
import QuantityStepper from '@/components/cart/QuantityStepper';

export default function CartPage() {
  const { items, savedItems, updateQuantity, removeItem, saveForLater, moveToCart, removeSavedItem, getSubtotal, getTotalItems } = useCartStore();
  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  return (
    <div className="min-h-screen bg-[#EAEDED] p-2 sm:p-4">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Cart Items */}
        <div className="min-w-0 rounded-sm bg-white p-3 sm:p-6 md:col-span-3">
          <h1 className="mb-4 border-b border-gray-300 pb-2 text-2xl font-medium sm:text-3xl">Shopping Cart</h1>
          
          {items.length === 0 ? (
            <div className="py-4">
              <h2 className="text-xl font-medium">Your Amazon Clone Cart is empty.</h2>
              <Link href="/" className="text-[#007185] hover:text-[#C7511F] hover:underline text-sm">Shop today&apos;s deals</Link>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex min-w-0 gap-3 border-b border-gray-200 pb-4 sm:gap-4">
                  <div className="relative h-24 w-24 shrink-0 sm:h-32 sm:w-32">
                    <Image src={item.image} alt={item.title} fill className="object-contain" unoptimized />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                      <h3 className="line-clamp-2 min-w-0 text-base text-[#007185] hover:text-[#C7511F] hover:underline sm:text-lg">
                        <Link href={`/product/${item.slug}`}>{item.title}</Link>
                      </h3>
                      <div className="shrink-0 text-lg font-bold sm:text-xl">${item.price.toFixed(2)}</div>
                    </div>
                    <div className="text-sm text-[#007600] mt-1">In Stock</div>
                    <div className="text-xs text-gray-500 mt-1">Eligible for FREE Shipping & FREE Returns</div>
                    
                    <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-2 text-sm">
                      <QuantityStepper value={item.quantity} max={Math.min(10, item.stock)} onChange={(quantity) => updateQuantity(item.id, quantity)} />
                      <span className="hidden text-gray-300 sm:inline">|</span>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline"
                      >
                        Delete
                      </button>
                      <span className="hidden text-gray-300 sm:inline">|</span>
                      <button
                        onClick={() => saveForLater(item.id)}
                        className="whitespace-nowrap text-sm text-[#007185] hover:text-[#C7511F] hover:underline"
                      >
                        Save for later
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-right text-lg">
                Subtotal ({totalItems} item{totalItems !== 1 && 's'}): <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Subtotal Box */}
        {items.length > 0 && (
          <div className="flex min-w-0 flex-col rounded-sm bg-white p-3 sm:p-4 md:col-span-1 md:self-start">
            <div className="flex items-center text-sm text-[#007600] mb-4">
              <span className="bg-green-100 p-1 rounded-full mr-2">✓</span> 
              Your order qualifies for FREE Shipping.
            </div>
            <div className="text-lg mb-4">
              Subtotal ({totalItems} item{totalItems !== 1 && 's'}): <span className="font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="w-full rounded-lg border border-[#fcd200] bg-[#ffd814] py-2 text-center text-sm shadow-sm hover:bg-[#f7ca00]">
              Proceed to Checkout
            </Link>
          </div>
        )}

      </div>

      {savedItems.length > 0 && (
        <section className="mx-auto mt-6 max-w-[1500px] rounded-sm bg-white p-3 sm:p-6">
          <h2 className="border-b border-gray-300 pb-3 text-2xl font-medium">Saved for later</h2>
          <div className="divide-y divide-gray-200">
            {savedItems.map((item) => (
              <div key={item.id} className="flex min-w-0 gap-3 py-5 sm:gap-4">
                <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
                  <Image src={item.image} alt={item.title} fill className="object-contain" unoptimized />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${item.slug}`} className="line-clamp-2 text-lg text-[#007185] hover:text-[#C7511F] hover:underline">
                    {item.title}
                  </Link>
                  <p className="mt-1 text-xl font-bold">${item.price.toFixed(2)}</p>
                  <p className="mt-1 text-sm text-[#007600]">In Stock</p>
                  <div className="mt-3 flex gap-4 text-sm">
                    <button onClick={() => moveToCart(item.id)} className="text-[#007185] hover:text-[#C7511F] hover:underline">Move to cart</button>
                    <button onClick={() => removeSavedItem(item.id)} className="text-[#007185] hover:text-[#C7511F] hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
