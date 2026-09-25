'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FadeReveal } from '@/components/home/HomeAnimations';

export type ViewedProduct = {
  id: string;
  slug: string;
  title: string;
  image: string;
};

export default function RecentlyViewedClient({ signedIn }: { signedIn: boolean }) {
  const [historyItems, setHistoryItems] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    if (signedIn) {
      try {
        const stored = localStorage.getItem('recentlyViewed');
        if (stored) {
          setHistoryItems(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to read recently viewed:', e);
      }
    }
  }, [signedIn]);

  if (!signedIn || historyItems.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto w-full border-t border-black/10">
      <FadeReveal>
        <h2 className="font-heading text-2xl font-bold tracking-tight mb-8">Recently Viewed</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-black/10 border border-black/10">
          {historyItems.map((product) => (
            <Link key={product.id} href={`/product/${product.slug}`} className="bg-gallery group block relative overflow-hidden flex flex-col">
              <div className="aspect-square bg-concrete/20 relative">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="p-4 border-t border-black/5 bg-white">
                <h3 className="text-xs font-medium line-clamp-2 text-graphite group-hover:text-black transition-colors">{product.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </FadeReveal>
    </section>
  );
}
