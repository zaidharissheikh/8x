'use client';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useHistoryStore } from '@/lib/history';

type CarouselItem = { id?: string; title?: string; name?: string; image: string; link?: string; price?: string; originalPrice?: string; badge?: { discount: string; text: string } };

export default function CarouselRail({ title, items, hasArrow = true }: { title: string; items: CarouselItem[]; hasArrow?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const addHistoryItem = useHistoryStore(state => state.addItem);

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white p-4 rounded-[8px] shadow-sm border border-gray-200 relative mb-4 group">
      <div className="flex items-center mb-4">
        <h2 className="text-[21px] font-bold text-[#0F1111] mr-2">{title}</h2>
        {hasArrow && <ChevronRight size={20} className="text-gray-800" strokeWidth={2} />}
      </div>
      <div ref={scrollRef} className="flex space-x-6 overflow-x-hidden pb-2 scroll-smooth">
        {items.map((item, i) => (
          <Link 
            href={item.link || '/s'} 
            key={i} 
            className="flex flex-col min-w-[160px] max-w-[160px] cursor-pointer group-hover:opacity-95"
            onClick={() => addHistoryItem({
              id: item.id || `item-${i}`,
              title: item.title || item.name || '',
              image: item.image,
              link: item.link || '#'
            })}
          >
            <div className="relative h-[160px] bg-white border border-gray-100 mb-2 rounded-[8px] overflow-hidden">
              <Image src={item.image} alt="deal" fill className="object-contain p-2 mix-blend-multiply" unoptimized />
            </div>
            {item.badge && (
              <div className="flex items-center text-[12px] mb-1 mt-1">
                <span className="bg-[#CC0C39] text-white px-1.5 py-1 rounded-[3px] font-bold mr-1.5">{item.badge.discount}</span>
                <span className="text-[#CC0C39] font-bold line-clamp-1">{item.badge.text}</span>
              </div>
            )}
            {item.title && <span className="line-clamp-2 min-h-9 text-[13px] leading-[1.3] text-[#007185] hover:text-[#c7511f]">{item.title}</span>}
            {item.price && (
              <div className="flex items-baseline text-[14px] mt-1">
                <span className="text-[20px] text-[#0F1111] leading-none">${item.price}</span>
                {item.originalPrice && <span className="text-gray-500 line-through ml-1">${item.originalPrice}</span>}
              </div>
            )}
          </Link>
        ))}
      </div>
      
      <button type="button"
        onClick={() => scroll(-500)}
        aria-label="Scroll left"
        className="absolute left-2 top-[50%] -translate-y-1/2 bg-white/95 hover:bg-gray-50 border border-gray-300 rounded-[8px] w-12 h-24 flex items-center justify-center cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.15)] opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronLeft size={32} className="text-gray-800" strokeWidth={1.5} />
      </button>
      <button type="button"
        onClick={() => scroll(500)}
        aria-label="Scroll right"
        className="absolute right-2 top-[50%] -translate-y-1/2 bg-white/95 hover:bg-gray-50 border border-gray-300 rounded-[8px] w-12 h-24 flex items-center justify-center cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.15)] opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronRight size={32} className="text-gray-800" strokeWidth={1.5} />
      </button>
    </div>
  );
}
