'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? images[0];

  return (
    <section className="flex min-w-0 gap-3">
      <div className="flex w-14 shrink-0 flex-col gap-3">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-label={`View ${title}, image ${index + 1}`}
            aria-pressed={selectedIndex === index}
            className={`relative h-14 w-14 rounded border bg-white p-1 focus:outline-none focus:ring-2 focus:ring-[#007185] ${selectedIndex === index ? 'border-[#e77600]' : 'border-gray-300'}`}
          >
            <Image src={image} alt={`${title} view ${index + 1}`} fill sizes="56px" className="object-contain" unoptimized />
          </button>
        ))}
      </div>
      <div className="relative h-[420px] min-w-0 flex-1 sm:h-[520px]">
        <Image src={selectedImage} alt={title} fill sizes="(min-width: 1024px) 480px, 90vw" className="object-contain" unoptimized />
      </div>
    </section>
  );
}
