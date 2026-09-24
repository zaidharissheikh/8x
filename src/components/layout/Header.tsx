import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, MapPin, Search, ShoppingCart } from 'lucide-react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import CartBadge from '@/components/cart/CartBadge';
import SideMenu from './SideMenu';

export default async function Header() {
  const session = await auth();
  const categories = await prisma.category.findMany({
    where: { products: { some: {} } },
    orderBy: { name: 'asc' },
    take: 12,
    select: { name: true, slug: true },
  });

  return (
    <header className="bg-[#131921] text-white">
      <div className="mx-auto flex min-h-[64px] w-full max-w-[1800px] flex-wrap items-center gap-1 px-2 sm:gap-2 sm:px-3 lg:gap-3 lg:px-4">
        <div className="flex min-w-0 flex-1 items-center md:flex-none md:shrink-0">
          <Link href="/" aria-label="Amazon home" className="header-action flex shrink-0 items-center px-1 py-3 sm:px-2">
            <Image src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" width={92} height={30} className="h-7 w-auto brightness-0 invert sm:h-8" unoptimized />
          </Link>
          <Link href="/account" className="header-action hidden shrink-0 items-end gap-1 px-2 py-2 sm:flex">
            <MapPin size={19} className="mb-0.5" />
            <span className="flex flex-col text-left leading-none"><span className="text-[11px] text-[#ccc]">Deliver to</span><span className="mt-1 text-xs font-bold">United States</span></span>
          </Link>
        </div>

        <form action="/s" className="order-last flex basis-full min-w-0 overflow-hidden rounded-md bg-white ring-[#ff9900] focus-within:ring-2 md:order-none md:mx-1 md:min-w-[300px] md:flex-1 lg:mx-2">
          <label htmlFor="header-search" className="sr-only">Search Amazon</label>
          <span className="relative hidden shrink-0 sm:block">
            <select name="category" defaultValue="all" className="h-full w-[88px] appearance-none truncate border-r border-gray-300 bg-[#f3f3f3] px-2 pr-5 text-xs text-[#111] outline-none">
              <option value="all">All</option>
              {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-gray-600" />
          </span>
          <input id="header-search" type="search" name="k" className="min-w-0 flex-1 px-3 py-2 text-sm text-black outline-none" placeholder="Search Amazon" />
          <button type="submit" className="flex w-12 shrink-0 items-center justify-center bg-[#febd69] text-black hover:bg-[#f3a847]" aria-label="Search"><Search size={22} /></button>
        </form>

        <nav className="flex shrink-0 items-center gap-0.5">
          <span aria-label="United States English" className="hidden items-end gap-1 px-2 py-3 lg:flex"><span className="text-lg">🇺🇸</span><span className="text-xs font-bold">EN</span><ChevronDown size={11} className="text-gray-400" /></span>
          <Link href={session ? '/account' : '/auth/signin'} className="header-action flex max-w-[108px] flex-col px-1.5 py-2 leading-none sm:max-w-[150px] sm:px-2"><span className="truncate text-[10px] sm:text-[11px]">Hello, {session?.user?.name || 'sign in'}</span><span className="mt-1 flex items-center whitespace-nowrap text-[11px] font-bold sm:text-sm">Account &amp; Lists <ChevronDown size={11} className="ml-1 text-gray-400" /></span></Link>
          <Link href="/orders" className="header-action hidden flex-col px-2 py-2 leading-none md:flex"><span className="text-[11px]">Returns</span><span className="mt-1 text-sm font-bold">&amp; Orders</span></Link>
          <Link href="/cart" className="header-action flex shrink-0 items-end gap-1 px-1 py-2 sm:px-2"><span className="relative"><ShoppingCart size={28} strokeWidth={1.8} /><CartBadge /></span><span className="mb-0.5 hidden text-sm font-bold sm:block">Cart</span></Link>
        </nav>
      </div>

      <div className="bg-[#232f3e]">
        <div className="mx-auto flex h-[42px] w-full max-w-[1600px] items-center gap-1 overflow-hidden px-2 text-[13px] sm:px-3 lg:px-4 lg:text-sm">
          <SideMenu categories={categories} userName={session?.user?.name || 'sign in'} signedIn={Boolean(session)} />
          <Link href="/s?deal=1" className="header-action whitespace-nowrap px-2 py-2 font-bold">Today&apos;s Deals</Link>
          <Link href="/s?category=electronics" className="header-action hidden whitespace-nowrap px-2 py-2 sm:block">Electronics</Link>
          <Link href="/s?category=home-kitchen" className="header-action hidden whitespace-nowrap px-2 py-2 sm:block">Home &amp; Kitchen</Link>
          <Link href="/s?category=beauty" className="header-action hidden whitespace-nowrap px-2 py-2 md:block">Beauty &amp; Personal Care</Link>
          <Link href="/s?category=womens-fashion" className="header-action hidden whitespace-nowrap px-2 py-2 lg:block">Women&apos;s Fashion</Link>
          <Link href="/s?category=mens-fashion" className="header-action hidden whitespace-nowrap px-2 py-2 lg:block">Men&apos;s Fashion</Link>
          <Link href="/s?category=sports-outdoors" className="header-action hidden whitespace-nowrap px-2 py-2 xl:block">Sports &amp; Outdoors</Link>
          <Link href="/s?sort=bestsellers" className="header-action hidden whitespace-nowrap px-2 py-2 md:block">Best Sellers</Link>
          <Link href="/s?sort=newest" className="header-action ml-auto hidden whitespace-nowrap px-2 py-2 font-bold lg:block">New Releases</Link>
        </div>
      </div>
    </header>
  );
}
