'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

type Category = { name: string; slug: string };

export default function SideMenu({ categories, userName, signedIn }: { categories: Category[]; userName: string; signedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="header-action flex items-center gap-1.5 font-bold" aria-label="Open main menu">
        <Menu size={24} strokeWidth={2.5} />
        <span>All</span>
      </button>

      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} role="dialog" aria-modal="true" aria-hidden={!open} aria-label="AmazonClone menu">
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/60 transition-opacity duration-300" />
          <aside className={`relative flex h-full w-[365px] max-w-[calc(100vw-40px)] flex-col overflow-y-auto bg-white text-[#111] shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center gap-3 bg-[#232f3e] px-7 py-4 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#232f3e]">A</div>
              <span className="truncate text-lg font-bold">Hello, {userName}</span>
              <button type="button" onClick={() => setOpen(false)} className="ml-auto rounded p-1 hover:bg-white/10" aria-label="Close menu"><X size={28} /></button>
            </div>

            <MenuSection title="Digital content & devices" links={[
              ['Prime Video', '/s?k=prime+video'],
              ['Amazon Music', '/s?k=amazon+music'],
              ['Kindle Books', '/s?k=kindle'],
              ['Alexa', '/s?k=alexa'],
            ]} />
            <div className="border-t border-gray-200" />
            <section className="px-7 py-5">
              <h2 className="mb-3 text-lg font-bold">Shop by category</h2>
              <div className="flex flex-col gap-3 text-sm text-gray-700">
                {categories.map((category) => <Link key={category.slug} href={`/category/${category.slug}`} onClick={() => setOpen(false)} className="menu-link">{category.name}</Link>)}
                <Link href="/s" onClick={() => setOpen(false)} className="menu-link font-medium text-[#007185]">See all categories</Link>
              </div>
            </section>
            <div className="border-t border-gray-200" />
            <MenuSection title="Programs & features" links={[
              ['Today\'s Deals', '/s?deal=1'],
              ['Gift Cards', '/s?k=gift+cards'],
              ['Sell on AmazonClone', '/sell'],
              ['Amazon Assistant', '/s?k=amazon+assistant'],
            ]} />
            <div className="border-t border-gray-200" />
            <MenuSection title="Help & settings" links={[
              ['Your Account', '/account'],
              ['Customer Service', '/help'],
              ...(!signedIn ? [['Sign in', '/auth/signin'] as [string, string]] : []),
            ]} />
            {signedIn && <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className="mx-7 mb-6 mt-[-8px] text-left text-sm text-gray-700 menu-link">Sign out</button>}
          </aside>
      </div>
    </>
  );
}

function MenuSection({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <section className="px-7 py-5">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      <div className="flex flex-col gap-3 text-sm text-gray-700">
        {links.map(([label, href]) => <Link key={href} href={href} className="menu-link">{label}</Link>)}
      </div>
    </section>
  );
}
