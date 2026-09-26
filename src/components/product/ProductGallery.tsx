'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? images[0];
  const container = useRef<HTMLElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      mainImageRef.current,
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', clearProps: 'all' }
    );

    gsap.fromTo(
      '.gallery-thumbnail',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'all', delay: 0.2 }
    );
  }, { scope: container });

  return (
    <section ref={container} className="flex min-w-0 flex-col-reverse gap-6 lg:flex-row">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 custom-scrollbar-hide shrink-0">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-label={`View ${title}, image ${index + 1}`}
            aria-pressed={selectedIndex === index}
            className={cn(
              "gallery-thumbnail relative aspect-[4/5] w-20 shrink-0 bg-concrete/20 overflow-hidden transition-all duration-300",
              selectedIndex === index ? "ring-1 ring-black ring-offset-2" : "hover:opacity-70 border border-black/5"
            )}
          >
            <img 
              src={image} 
              alt={`${title} view ${index + 1}`} 
              className="absolute inset-0 h-full w-full object-cover mix-blend-multiply" 
            />
          </button>
        ))}
      </div>
      
      {/* Main Image */}
      <div ref={mainImageRef} className="relative aspect-[4/5] w-full min-w-0 bg-concrete/20 overflow-hidden border border-black/5 flex-1 min-h-[clamp(360px,125vw,500px)]">
        <img 
          key={selectedImage} // forces re-render/fade on change if we want, but CSS transitions are cleaner
          src={selectedImage} 
          alt={title} 
          className="absolute inset-0 h-full w-full object-cover mix-blend-multiply transition-transform duration-700 ease-out hover:scale-[1.03] cursor-crosshair animate-in fade-in zoom-in-95 duration-500" 
        />
      </div>
    </section>
  );
}
