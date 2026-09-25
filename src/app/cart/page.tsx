'use client';
import { useCartStore } from '@/lib/cart';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import QuantityStepper from '@/components/cart/QuantityStepper';
import { Button, Price } from '@/components/ui';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function CartPage() {
  const { items, savedItems, updateQuantity, removeItem, saveForLater, moveToCart, removeSavedItem, getSubtotal, getTotalItems } = useCartStore();
  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || items.length === 0) return;

    gsap.fromTo(
      '.cart-item-anim',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', clearProps: 'all' }
    );
    
    gsap.fromTo(
      '.cart-summary-anim',
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: 'power3.out', clearProps: 'all' }
    );
  }, { scope: containerRef, dependencies: [items.length] });

  return (
    <div ref={containerRef} className="min-h-screen bg-gallery px-4 py-8 lg:py-16">
      <div className="mx-auto max-w-[1600px]">
        <h1 className="font-heading text-4xl md:text-6xl font-medium tracking-tight mb-12">Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-start">
          {/* Cart Items */}
          <div className="min-w-0">
            {items.length === 0 ? (
              <div className="py-24 text-center border border-black/10 bg-white shadow-flat">
                <h2 className="font-heading text-2xl font-bold mb-4">Your bag is empty</h2>
                <Link href="/s">
                  <Button variant="outline" className="border-black text-black">Explore The Gallery</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col border-t border-black/10">
                {items.map(item => (
                  <div key={item.id} className="cart-item-anim flex flex-col sm:flex-row min-w-0 gap-6 sm:gap-10 border-b border-black/10 py-10 bg-white first:pt-4">
                    <Link href={`/product/${item.slug}`} className="relative aspect-[4/5] w-full sm:w-48 shrink-0 bg-concrete/20 overflow-hidden border border-black/5 group block">
                      <Image src={item.image} alt={item.title} fill className="object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105" unoptimized />
                    </Link>
                    
                    <div className="flex min-w-0 flex-1 flex-col py-2">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div>
                          <Link href={`/product/${item.slug}`} className="inline-block mb-1 group">
                            <h3 className="line-clamp-2 text-xl font-medium text-black group-hover:text-graphite transition-colors">
                              {item.title}
                            </h3>
                          </Link>
                          {item.variantLabel && (
                            <p className="text-xs font-bold uppercase tracking-widest text-graphite mt-2">
                              {item.variantLabel}
                            </p>
                          )}
                        </div>
                        <Price amount={item.price.toFixed(2)} className="text-2xl sm:text-3xl shrink-0" />
                      </div>
                      
                      <div className="text-[10px] font-bold uppercase tracking-widest text-black mt-1">In Stock</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-graphite mt-2">Eligible for FREE Shipping & Returns</div>
                      
                      <div className="mt-auto pt-8 flex flex-wrap items-center gap-6 text-sm">
                        <QuantityStepper value={item.quantity} max={Math.min(10, item.stock)} onChange={(quantity) => updateQuantity(item.id, quantity)} />
                        
                        <div className="flex gap-4 items-center h-11">
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-xs font-bold uppercase tracking-widest text-black hover:text-oxblood transition-colors border-b border-transparent hover:border-oxblood pb-0.5"
                          >
                            Remove
                          </button>
                          <span className="text-black/20">|</span>
                          <button
                            onClick={() => saveForLater(item.id)}
                            className="text-xs font-bold uppercase tracking-widest text-graphite hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5"
                          >
                            Save for later
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Summary Sidebar */}
          {items.length > 0 && (
            <div className="cart-summary-anim sticky top-24 flex min-w-0 flex-col bg-white p-8 border border-black shadow-flat">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-black mb-8 pb-4 border-b border-black/10">
                <span className="bg-black text-white h-4 w-4 flex items-center justify-center shrink-0">✓</span> 
                Free Shipping unlocked
              </div>
              
              <h2 className="font-heading text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm font-medium border-b border-black/10 pb-6 mb-6">
                <div className="flex justify-between">
                  <span className="text-graphite">Subtotal ({totalItems} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-graphite">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-graphite">Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-sm font-bold uppercase tracking-widest">Estimated Total</span>
                <Price amount={subtotal.toFixed(2)} className="text-4xl" />
              </div>
              
              <Link href="/checkout" className="w-full">
                <Button size="lg" className="w-full text-base font-bold">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Saved for later */}
        {savedItems.length > 0 && (
          <section className="mt-24 border-t border-black/10 pt-16">
            <h2 className="font-heading text-3xl font-bold tracking-tight mb-8">Saved for later</h2>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {savedItems.map((item) => (
                <div key={item.id} className="flex flex-col bg-white border border-black/10 group">
                  <Link href={`/product/${item.slug}`} className="relative aspect-[4/5] w-full bg-concrete/20 overflow-hidden border-b border-black/10">
                    <Image src={item.image} alt={item.title} fill className="object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105" unoptimized />
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <Link href={`/product/${item.slug}`} className="line-clamp-2 text-base font-medium text-black group-hover:text-graphite transition-colors mb-3">
                      {item.title}
                    </Link>
                    <Price amount={item.price.toFixed(2)} />
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-black">In Stock</p>
                    
                    <div className="mt-auto pt-6 flex gap-4 text-xs font-bold uppercase tracking-widest">
                      <button onClick={() => moveToCart(item.id)} className="text-black hover:text-graphite transition-colors border-b border-black pb-0.5">Move to bag</button>
                      <button onClick={() => removeSavedItem(item.id)} className="text-oxblood hover:text-black transition-colors border-b border-oxblood hover:border-black pb-0.5">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
