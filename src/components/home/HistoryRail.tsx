'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useHistoryStore } from '@/lib/history';

type HistoryProduct = { id?: string; title: string; name?: string; image: string; link?: string; rating: number; reviews: string; price?: string; originalPrice?: string; unit?: string; badge?: string; amazonChoice?: boolean };

export default function HistoryRail({ title, items }: { title: string; items: HistoryProduct[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const addHistoryItem = useHistoryStore(state => state.addItem);

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeft(scrollRef.current.scrollLeft > 10);
    }
  };

  return (
    <div className="bg-white p-4 pt-6 pb-8 border-b border-gray-200 relative mb-0 group">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[20px] font-bold text-[#0F1111]">{title}</h2>
        <span className="text-[14px] text-gray-500">Page 1 of 7</span>
      </div>
      <div 
        ref={scrollRef} 
        onScroll={handleScroll}
        className="flex space-x-6 overflow-x-hidden pb-4 scroll-smooth"
      >
        {items.map((item, i) => (
          <div key={i} className="flex flex-col min-w-[180px] max-w-[180px]">
            <Link 
              href={item.link || '/s'}
              onClick={() => addHistoryItem({
                id: item.id || `item-${i}`,
                title: item.title || item.name || '',
                image: item.image,
                link: item.link || '/s'
              })}
            >
              <div className="relative h-[180px] bg-white mb-3 cursor-pointer rounded-sm overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-contain" unoptimized />
              </div>
            </Link>
            <Link href={item.link || '/s'} className="text-[14px] text-[#007185] hover:text-[#C7511F] hover:underline line-clamp-3 leading-[1.3] mb-1.5">
              {item.title}
            </Link>
            <div className="flex text-[#FFA41C] text-[14px] mb-2 items-center">
              {'★'.repeat(item.rating)}
              {'☆'.repeat(5 - item.rating)}
              <span className="text-[#007185] text-[14px] ml-1">{item.reviews}</span>
            </div>
            {item.amazonChoice && (
               <div className="bg-[#232F3E] text-white text-[12px] w-max px-1.5 py-0.5 mb-1.5 rounded-[2px] font-bold">Amazon&apos;s <span className="text-[#F3A847]">Choice</span></div>
            )}
            {item.badge && (
               <div className="bg-[#CC0C39] text-white text-[11px] w-max px-2 py-1 mb-1.5 rounded-[3px] font-bold">{item.badge}</div>
            )}
            {item.price && (
              <div className="text-[22px] text-[#B12704] leading-none mb-1 mt-1 font-normal flex items-start">
                <span className="text-[12px] mt-1">$</span>
                <span>{item.price.split('.')[0]}</span>
                <span className="text-[12px] mt-1">{item.price.split('.')[1]}</span>
                {item.unit && <span className="text-gray-500 text-[12px] ml-1 mt-1">({item.unit})</span>}
              </div>
            )}
            {item.originalPrice && (
              <div className="text-[12px] text-gray-500 mb-1">
                Typical: <span className="line-through">${item.originalPrice}</span>
              </div>
            )}
            <div className="text-[12px] text-gray-800 leading-[1.4] mt-2">
              Get it as soon as <span className="font-bold">Tuesday, Sep 29</span><br/>
              FREE Shipping on orders over $35 shipped by Amazon
            </div>
          </div>
        ))}
      </div>
      
      {showLeft && (
        <div 
          onClick={() => scroll(-600)}
          className="absolute left-2 top-[220px] bg-white hover:bg-gray-50 border border-gray-300 rounded-[6px] w-12 h-14 flex items-center justify-center cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.15)] z-10"
        >
          <ChevronLeft size={30} className="text-gray-800" strokeWidth={1.5} />
        </div>
      )}
      <div 
        onClick={() => scroll(600)}
        className="absolute right-2 top-[220px] bg-white hover:bg-gray-50 border border-gray-300 rounded-[6px] w-12 h-14 flex items-center justify-center cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.15)] z-10"
      >
        <ChevronRight size={30} className="text-gray-800" strokeWidth={1.5} />
      </div>
    </div>
  );
}
