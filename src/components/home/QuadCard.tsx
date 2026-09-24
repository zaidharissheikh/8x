import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type QuadItem = { name?: string; price?: string; image: string; imageBg?: string; link?: string; badge?: { discount: string; text: string } };

export default function QuadCard({ title, sponsor, items, hasArrow }: { title: string; sponsor?: string; items: QuadItem[]; hasArrow?: boolean }) {
  return (
    <div className="flex h-full min-h-[390px] w-full flex-col rounded-[4px] border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-[20px] font-bold leading-[1.2] text-[#0F1111] line-clamp-2">{title}</h2>
          {sponsor && <span className="text-[11px] text-gray-500 font-normal mt-[2px] block leading-none">{sponsor} <span className="text-[9px]">ⓘ</span></span>}
        </div>
        {hasArrow && <ChevronRight size={20} className="text-gray-800 mt-[2px]" strokeWidth={2} />}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 flex-1 mt-2 content-start">
        {items.map((item, i) => (
          <Link href={item.link || '/s'} key={i} className="group flex min-w-0 flex-col cursor-pointer">
            <div className={`relative mb-2 aspect-square w-full overflow-hidden rounded-[4px] ${item.imageBg || ''}`}>
              <Image src={item.image} alt={item.name || ''} fill className="object-contain p-2 mix-blend-multiply" unoptimized />
            </div>
            {item.badge && (
              <div className="flex items-center text-[12px] mb-1 leading-none mt-1">
                <span className="bg-[#CC0C39] text-white px-1.5 py-1 rounded-[3px] font-bold mr-1.5">{item.badge.discount}</span>
                <span className="text-[#CC0C39] font-bold">{item.badge.text}</span>
              </div>
            )}
            {item.name && <span className="text-[13px] text-[#0F1111] leading-[1.3] line-clamp-2 mt-1">{item.name}</span>}
            {item.price && (
              <span className="text-[#0F1111] mt-1 flex items-start">
                <span className="text-[11px] mt-[3px]">$</span>
                <span className="text-[20px] font-normal leading-none">{item.price.split('.')[0]}</span>
                <span className="text-[11px] mt-[3px] leading-none">{item.price.split('.')[1] || '00'}</span>
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
