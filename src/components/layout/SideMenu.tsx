'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

type Category = { name: string; slug: string };

export default function SideMenu({ categories, userName, signedIn }: { categories: Category[]; userName: string; signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const content = (
    <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} role="dialog" aria-modal="true" aria-hidden={!open}>
      <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" />
      <aside className={`relative flex h-full w-[380px] max-w-[calc(100vw-40px)] flex-col bg-gallery text-black shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-black/10 px-8 py-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center bg-concrete font-bold text-black border border-black/10">{userName.charAt(0).toUpperCase()}</div>
            <span className="text-sm font-bold uppercase tracking-widest truncate max-w-[180px]">Hello, {userName}</span>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="text-black hover:text-oxblood transition-colors" aria-label="Close menu"><X size={24} strokeWidth={1.5} /></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar-hide">
          <MenuSection title="Departments" links={categories.map(c => [c.name, `/category/${c.slug}`])} setOpen={setOpen} />
          <div className="border-t border-black/10" />
          <MenuSection title="Curated Collections" links={[
            ['Today\'s Deals', '/s?deal=1'],
            ['Best Sellers', '/s?sort=bestsellers'],
            ['New Arrivals', '/s?sort=newest'],
          ]} setOpen={setOpen} />
          <div className="border-t border-black/10" />
          <MenuSection title="Account & Support" links={[
            ['Your Account', '/account'],
            ['Order History', '/orders'],
            ['Customer Service', '/help'],
            ...(!signedIn ? [['Sign in', '/auth/signin'] as [string, string]] : []),
          ]} setOpen={setOpen} />
          
          {signedIn && (
            <div className="px-8 pb-12 pt-6">
              <button type="button" onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }); }} className="text-xs font-bold uppercase tracking-widest text-oxblood hover:text-black transition-colors border-b border-oxblood hover:border-black pb-0.5">
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="flex h-10 w-10 items-center justify-center text-black hover:bg-concrete transition-colors rounded-none" aria-label="Open main menu">
        <Menu size={18} strokeWidth={1.5} />
      </button>
      {mounted && createPortal(content, document.body)}
    </>
  );
}

function MenuSection({ title, links, setOpen }: { title: string; links: [string, string][]; setOpen: (open: boolean) => void }) {
  return (
    <section className="px-8 py-8">
      <h2 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-graphite pb-2 border-b border-black/10">{title}</h2>
      <div className="flex flex-col gap-4">
        {links.map(([label, href]) => (
          <Link key={href} href={href} onClick={() => setOpen(false)} className="text-base font-medium text-black hover:text-graphite transition-colors inline-block w-fit">
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
