'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import BuyNowButton from '@/components/cart/BuyNowButton';
import type { CartItemType } from '@/lib/cart';
import type { ProductVariantConfig } from '@/lib/productVariants';

type ProductBase = Omit<CartItemType, 'quantity'>;
type Specification = { label: string; value: string };

export default function ProductConfigurator({ product, variants, title, brand, brandHref, ratingAvg, ratingCount, listPrice, description, bullets, specifications }: { product: ProductBase; variants: ProductVariantConfig; title: string; brand: string; brandHref: string; ratingAvg: number; ratingCount: number; listPrice: number | null; description: string; bullets: string[]; specifications: Specification[] }) {
  const [storageId, setStorageId] = useState(variants?.type === 'storage' ? variants.options[0].id : '');
  const [color, setColor] = useState(variants?.type === 'fashion' ? variants.colors[0] : '');
  const [size, setSize] = useState(variants?.type === 'fashion' ? variants.sizes[0] : '');

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
    <>
      <section className="lg:col-start-2 lg:row-start-1">
        <h1 className="text-2xl font-medium leading-tight text-[#0f1111]">{title}</h1>
        <Link href={brandHref} className="mt-2 inline-block text-sm text-[#007185] hover:text-[#c7511f] hover:underline">Visit the {brand} store</Link>
        <div className="mt-2 flex items-center border-b border-gray-300 pb-3 text-sm"><span className="text-[#f08804]">{'★'.repeat(Math.round(ratingAvg))}{'☆'.repeat(Math.max(0, 5 - Math.round(ratingAvg)))}</span><span className="ml-2 text-[#007185]">{ratingCount.toLocaleString()} ratings</span></div>
        <div className="mt-4 flex items-start text-[#b12704]"><span className="mt-1 text-sm">$</span><span className="text-4xl">{Math.floor(Number(product.price))}</span><span className="mt-1 text-lg">{(Number(product.price) % 1).toFixed(2).slice(2)}</span></div>
        {listPrice && <div className="mt-1 text-sm text-gray-600">List Price: <span className="line-through">${listPrice.toFixed(2)}</span></div>}

        {variants?.type === 'storage' && <div key={storageId} className="variant-selection mt-5"><p className="text-base">Capacity: <b>{variants.options.find((option) => option.id === storageId)?.label}</b></p><div className="mt-2 flex flex-wrap gap-2">{variants.options.map((option) => <button key={option.id} type="button" onClick={() => setStorageId(option.id)} className={`min-w-[96px] rounded-xl border px-3 py-2 text-left text-sm transition-all duration-200 ${storageId === option.id ? 'border-4 border-[#007185] p-[5px]' : 'border-gray-400'}`}><span className="block font-bold">{option.label}</span><span className="mt-0.5 block">${option.price.toFixed(2)}</span></button>)}</div></div>}
        {variants?.type === 'fashion' && <div key={`${color}-${size}`} className="variant-selection mt-5 space-y-3"><div><p className="text-base">Color: <b>{color}</b></p><div className="mt-2 flex flex-wrap gap-2">{variants.colors.map((option) => <button key={option} type="button" onClick={() => setColor(option)} className={`rounded-md border px-3 py-1.5 text-sm transition-all duration-200 ${color === option ? 'border-2 border-[#007185] font-bold' : 'border-gray-400'}`}>{option}</button>)}</div></div><div><p className="text-base">Size: <b>{size}</b></p><div className="mt-2 flex flex-wrap gap-2">{variants.sizes.map((option) => <button key={option} type="button" onClick={() => setSize(option)} className={`min-w-12 rounded-md border px-3 py-1.5 text-sm transition-all duration-200 ${size === option ? 'border-2 border-[#007185] font-bold' : 'border-gray-400'}`}>{option}<span className="mt-0.5 block text-xs font-normal">${variants.sizePrices[option].toFixed(2)}</span></button>)}</div></div></div>}

        <div className="mt-5 border-y border-gray-200 py-3 text-sm"><h2 className="text-base font-bold">Product details</h2>{specifications.map((item) => <div key={item.label} className="flex gap-3 border-b border-gray-100 py-2 last:border-0"><span className="w-36 shrink-0 font-bold">{item.label}</span><span className="text-gray-700">{item.value}</span></div>)}</div>
        <p className="mt-4 text-sm leading-6 text-gray-700">{description}</p>
        <h2 className="mt-5 text-lg font-bold">About this item</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-5 text-gray-800">{bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
      </section>

      <aside className="h-max rounded-lg border border-gray-300 p-3 shadow-sm lg:col-start-3 lg:row-span-2 lg:row-start-1">
        <div key={selected.id} className="variant-price text-xl text-[#b12704]">${selected.price.toFixed(2)}</div>
        <p className="mt-2 text-sm">FREE delivery <b>Tomorrow</b></p>
        <p className={`mt-3 text-base ${product.stock > 0 ? 'text-[#007600]' : 'text-[#b12704]'}`}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
        {product.stock > 0 && <><AddToCartButton product={cartProduct} /><BuyNowButton product={cartProduct} /></>}
        <div className="mt-4 space-y-2 border-t border-gray-200 pt-3 text-xs text-gray-600"><div className="flex justify-between"><span>Ships from</span><b>Amazon</b></div><div className="flex justify-between"><span>Sold by</span><b>Amazon</b></div><div className="flex justify-between"><span>Returns</span><span className="text-[#007185]">30-day returns</span></div></div>
      </aside>
    </>
  );
}
