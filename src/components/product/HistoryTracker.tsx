'use client';

import { useEffect } from 'react';
import { ViewedProduct } from '@/components/home/RecentlyViewedClient';

export default function HistoryTracker({ product }: { product: ViewedProduct }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      let history: ViewedProduct[] = stored ? JSON.parse(stored) : [];
      
      // Remove if it already exists
      history = history.filter(p => p.id !== product.id);
      
      // Add to front
      history.unshift(product);
      
      // Keep only 6
      if (history.length > 6) {
        history = history.slice(0, 6);
      }
      
      localStorage.setItem('recentlyViewed', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to track history', e);
    }
  }, [product]);

  return null;
}
