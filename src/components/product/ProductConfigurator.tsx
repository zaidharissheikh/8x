'use client';

import Link from 'next/link';
import { useMemo, useState, useRef } from 'react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import BuyNowButton from '@/components/cart/BuyNowButton';
import type { CartItemType } from '@/lib/cart';
import type { ProductVariantConfig } from '@/lib/productVariants';
import { Rating, Price } from '@/components/ui';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type ProductBase = Omit<CartItemType, 'quantity'>;
type Specification = { label: string; value: string };

export default function ProductConfigurator({ product, variants, title, brand, brandHref, ratingAvg, ratingCount, listPrice, description, bullets, specifications }: { product: ProductBase; variants: ProductVariantConfig; title: string; brand: string; brandHref: string; ratingAvg: number; ratingCount: number; listPrice: number | null; description: string; bullets: string[]; specifications: Specification[] }) {
  const [storageId, setStorageId] = useState(variants?.type === 'storage' ? variants.options[0].id : '');
  const [color, setColor] = useState(variants?.type === 'fashion' ? variants.colors[0] : '');
  const [size, setSize] = useState(variants?.type === 'fashion' ? variants.sizes[0] : '');

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Stagger center details
    gsap.fromTo(
      '.config-detail-item',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out', clearProps: 'all', delay: 0.1 }
    );

    // Sidebar animation
    gsap.fromTo(
      '.config-sidebar',
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', clearProps: 'all', delay: 0.3 }
    );
  }, { scope: containerRef });

  const selected = useMemo(() => {
    if (variants?.type === 'storage') {
      const option = variants.options.find((item) => item.id === storageId) || variants.options[0];
      return { id: option.id, label: option.label, price: option.price };
    }
    if (variants?.type === 'fashion') return { id: `${color}-${size}`.toLowerCase(), label: `${color}, size ${size}`, price: variants.sizePrices[size] };
    return { id: '', label: '', price: product.price };
  }, [color, product.price, size, storageId, variants]);

  const cartProduct: ProductBase = {
    ...product,
    id: selected.id ? `${product.id}:${selected.id}` : product.id,
    productId: product.productId || product.id,
    variantId: selected.id || undefined,
    variantLabel: selected.label || undefined,
    title: selected.label ? `${product.title} (${selected.label})` : product.title,
    price: selected.price,
  };

  return (
    <div ref={containerRef} className="contents">
      {/* Center Details */}
      <section className="lg:col-start-2 lg:row-start-1">
        <Link href={brandHref} className="config-detail-item text-[10px] font-bold uppercase tracking-widest text-graphite hover:text-black transition-colors mb-4 block">
          {brand}
        </Link>
        <h1 className="config-detail-item font-heading text-3xl md:text-5xl font-medium leading-[1.1] text-black tracking-tight mb-6">
          {title}
        </h1>
        
        <div className="config-detail-item flex items-center gap-4 mb-8">
          <Rating value={ratingAvg} />
          <span className="text-sm font-bold text-graphite">({ratingCount.toLocaleString()} reviews)</span>
        </div>

        <div className="config-detail-item border-t border-black/10 pt-8 pb-8">
          {variants?.type === 'storage' && (
            <div key={storageId} className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest">
                Capacity: <span className="text-graphite">{variants.options.find((option) => option.id === storageId)?.label}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {variants.options.map((option) => (
                  <button 
                    key={option.id} 
                    type="button" 
                    onClick={() => setStorageId(option.id)} 
                    className={cn(
                      "min-w-[100px] border px-4 py-3 text-left transition-all duration-200 rounded-none",
                      storageId === option.id ? "border-black bg-black text-white shadow-flat" : "border-black/20 text-black hover:border-black/50"
                    )}
                  >
                    <span className="block text-sm font-bold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {variants?.type === 'fashion' && (
            <div key={`${color}-${size}`} className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-widest">
                  Color: <span className="text-graphite">{color}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {variants.colors.map((option) => (
                    <button 
                      key={option} 
                      type="button" 
                      onClick={() => setColor(option)} 
                      className={cn(
                        "px-6 py-2.5 text-sm font-medium transition-all border rounded-none",
                        color === option ? "border-black bg-black text-white shadow-flat" : "border-black/20 text-black hover:border-black/50"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-widest">
                  Size: <span className="text-graphite">{size}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {variants.sizes.map((option) => (
                    <button 
                      key={option} 
                      type="button" 
                      onClick={() => setSize(option)} 
                      className={cn(
                        "min-w-[4rem] px-3 py-2 text-center transition-all border flex flex-col items-center justify-center rounded-none",
                        size === option ? "border-black bg-black text-white shadow-flat" : "border-black/20 text-black hover:border-black/50"
                      )}
                    >
                      <span className="font-bold text-sm">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-black/10 py-10 space-y-8">
          <p className="config-detail-item text-base leading-relaxed text-black/80">{description}</p>
          
          <div className="config-detail-item space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Highlights</h2>
            <ul className="space-y-3">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex gap-4 items-start text-sm text-black/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-black rotate-45" />
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="config-detail-item space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specifications.map((item) => (
                <div key={item.label} className="flex flex-col gap-1 border border-black/10 p-4 bg-concrete/20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-graphite">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Action Sidebar */}
      <aside className="lg:col-start-3 lg:row-span-2 lg:row-start-1">
        <div className="config-sidebar sticky top-24 bg-white border border-black shadow-flat p-6 lg:p-8">
          <div className="mb-8">
            <Price amount={selected.price.toFixed(2)} originalAmount={listPrice ? listPrice.toFixed(2) : undefined} className="text-4xl font-heading" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-graphite">FREE delivery <span className="text-black">Tomorrow</span></p>
            <p className={cn(
              "mt-2 text-sm font-bold uppercase tracking-widest",
              product.stock > 0 ? "text-black" : "text-oxblood"
            )}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
          
          {product.stock > 0 && (
            <div className="flex flex-col gap-3">
              <AddToCartButton product={cartProduct} />
              <BuyNowButton product={cartProduct} />
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-black/10 space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-graphite font-medium">Ships from</span>
              <span className="font-bold">The Gallery</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-graphite font-medium">Sold by</span>
              <span className="font-bold">The Gallery</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-graphite font-medium">Returns</span>
              <span className="font-bold underline decoration-black/20 underline-offset-4 cursor-pointer hover:decoration-black transition-colors">30-day returns</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
