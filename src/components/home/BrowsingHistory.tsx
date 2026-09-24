'use client';
import { useHistoryStore } from '@/lib/history';
import Link from 'next/link';
import Image from 'next/image';

export default function BrowsingHistory() {
  const { items } = useHistoryStore();

  if (items.length === 0) return null;

  return (
    <div className="bg-white p-4 pb-12 rounded-b-md relative mt-[-20px] pt-6">
      <h2 className="text-[18px] font-bold mb-4 text-[#0F1111] flex items-center">
        Your Browsing History 
        <Link href="/account" className="text-[14px] font-normal text-[#007185] hover:text-[#C7511F] hover:underline ml-2">
          View or edit your browsing history
        </Link>
      </h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar">
         {items.map((item, i) => (
           <Link href={item.link} key={i} className="flex-shrink-0">
             <div className="relative w-[150px] h-[150px] bg-white border border-gray-100 shadow-sm p-1 hover:shadow-md">
               <Image src={item.image} alt={item.title} fill className="object-contain p-2" unoptimized />
             </div>
           </Link>
         ))}
      </div>
    </div>
  );
}
