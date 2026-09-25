import Link from 'next/link';
import { Search, ShoppingBag, User } from 'lucide-react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import CartBadge from '@/components/cart/CartBadge';
import SideMenu from './SideMenu';
import HeaderAnimator from './HeaderAnimator';

export default async function Header() {
  const session = await auth();
  const categories = await prisma.category.findMany({
    where: { products: { some: {} } },
    orderBy: { name: 'asc' },
    take: 6,
    select: { name: true, slug: true },
  });

  return (
    <HeaderAnimator>
      <header className="sticky top-0 z-40 w-full bg-gallery/90 backdrop-blur-md border-b border-black/10">
        <div className="mx-auto flex h-16 w-full max-w-[1800px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Branding & Categories */}
          <div className="flex items-center gap-6 lg:gap-12">
            <div className="flex items-center gap-4">
              <div className="lg:hidden">
                 <SideMenu categories={categories} userName={session?.user?.name || 'Guest'} signedIn={Boolean(session)} />
              </div>
              <Link href="/" className="font-heading text-2xl font-black tracking-tight text-black">
                GALLERY
              </Link>
            </div>
            
            <nav className="hidden lg:flex items-center gap-6">
              {categories.map(cat => (
                <Link key={cat.slug} href={`/s?category=${cat.slug}`} className="text-sm font-medium text-graphite hover:text-black transition-colors">
                  {cat.name}
                </Link>
              ))}
              <Link href="/s" className="text-sm font-medium text-black hover:text-graphite transition-colors">
                All Products
              </Link>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <form action="/s" className="relative hidden md:block w-48 lg:w-64">
              <input 
                type="search" 
                name="k" 
                placeholder="Search..." 
                className="w-full bg-transparent border-b border-black/20 pb-1 text-sm outline-none focus:border-black transition-colors placeholder:text-black/40"
              />
              <button type="submit" className="absolute right-0 top-0 text-black/40 hover:text-black transition-colors">
                <Search size={16} />
              </button>
            </form>

            <Link href={session ? '/account' : '/auth/signin'} className="flex h-10 items-center justify-center gap-2 px-3 text-black hover:bg-concrete transition-colors rounded-none">
              <User size={18} strokeWidth={1.5} />
              <span className="hidden lg:block text-xs font-bold uppercase tracking-widest">
                {session ? 'Account' : 'Sign In'}
              </span>
            </Link>
            
            <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center text-black hover:bg-concrete transition-colors rounded-none">
              <ShoppingBag size={18} strokeWidth={1.5} />
              <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-none bg-oxblood text-[9px] font-bold text-white">
                <CartBadge />
              </div>
            </Link>
          </div>
        </div>
      </header>
    </HeaderAnimator>
  );
}

