import Link from 'next/link';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { Price, Button, Badge } from '@/components/ui';
import HeroCarousel from '@/components/home/HeroCarousel';
import { FadeReveal } from '@/components/home/HomeAnimations';
import RecentlyViewedClient from '@/components/home/RecentlyViewedClient';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const revalidate = 60;

type HomeProduct = {
  id: string;
  slug: string;
  title: string;
  price: unknown;
  listPrice: unknown;
  images: string;
  ratingAvg: number;
  ratingCount: number;
  category: { name: string; slug: string };
};

export default async function Home() {
  const session = await auth();
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
    take: 194,
    include: { category: { select: { name: true, slug: true } } },
  }) as unknown as HomeProduct[];

  const electronics = products.filter((product) => product.category.slug === 'electronics' || product.category.slug === 'computers');
  const beautyProducts = products.filter((product) => product.category.slug === 'beauty-and-personal-care' || product.category.slug === 'beauty' || product.category.slug === 'skin-care' || product.category.slug === 'fragrances');
  const trendingCategoryOrder = ['electronics', 'computers', 'womens-fashion', 'mens-fashion', 'home-kitchen', 'sports-outdoors'];
  const trendingProducts = trendingCategoryOrder
    .map((categorySlug) => products.find((product) => product.category.slug === categorySlug))
    .filter((product): product is HomeProduct => Boolean(product))
    .slice(0, 5);

  return (
    <div className="flex flex-col">
      {/* 1. Cinematic Category Edit */}
      <HeroCarousel />

      {/* 2. Gapless Bento Grid (Deals & Trending) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto w-full">
        <FadeReveal>
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight">Trending Now</h2>
            <Link href="/s" className="hidden md:flex items-center text-sm font-bold uppercase tracking-widest text-graphite hover:text-black transition-colors">
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </FadeReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-flow-dense gap-px bg-black/10 border border-black/10">
          {trendingProducts.map((product, i) => {
            const isFeatured = i === 0;
            return (
              <FadeReveal key={product.id} delay={i * 0.1} className={cn(
                "bg-gallery relative group overflow-hidden flex flex-col",
                isFeatured ? "md:col-span-2 md:row-span-2" : "col-span-1 row-span-1"
              )}>
                <Link href={`/product/${product.slug}`} className="flex flex-col h-full flex-1">
                  <div className={cn("relative w-full bg-concrete/20", isFeatured ? "aspect-square md:aspect-[4/3]" : "aspect-[4/5]")}>
                    <img 
                      src={firstImage(product)} 
                      alt={product.title} 
                      className="absolute inset-0 h-full w-full object-cover mix-blend-multiply transition-transform duration-1000 ease-out group-hover:scale-105" 
                    />
                    {product.listPrice ? (
                      <Badge variant="accent" className="absolute top-4 left-4 shadow-flat">
                        Sale
                      </Badge>
                    ) : null}
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between bg-gallery z-10 border-t border-black/5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-graphite mb-2">{product.category.name}</p>
                      <h3 className={cn("font-medium line-clamp-2", isFeatured ? "text-2xl font-heading" : "text-base")}>{product.title}</h3>
                    </div>
                    <Price 
                      amount={Number(product.price).toFixed(2)} 
                      originalAmount={product.listPrice ? Number(product.listPrice).toFixed(2) : undefined} 
                      className="mt-4"
                    />
                  </div>
                </Link>
              </FadeReveal>
            );
          })}
        </div>
      </section>

      {/* 3. Horizontal Scroll Rail (Beauty & Grooming) */}
      <section className="py-24 border-y border-black/10 bg-concrete/30 overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto w-full">
          <FadeReveal>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-12">Beauty & Grooming</h2>
          </FadeReveal>
          
          <div className="flex overflow-x-auto gap-px bg-black/10 border border-black/10 snap-x snap-mandatory custom-scrollbar-hide pb-1">
            {beautyProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="min-w-[280px] md:min-w-[320px] shrink-0 snap-start bg-gallery group flex flex-col">
                <Link href={`/product/${product.slug}`} className="flex flex-col h-full flex-1">
                  <div className="relative aspect-[3/4] bg-concrete/20 overflow-hidden">
                    <img 
                      src={firstImage(product)} 
                      alt={product.title} 
                      className="absolute inset-0 h-full w-full object-cover mix-blend-multiply transition-transform duration-1000 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-5 border-t border-black/5 flex-1 flex flex-col justify-between">
                    <h3 className="font-medium line-clamp-2 text-base mb-4">{product.title}</h3>
                    <Price amount={Number(product.price).toFixed(2)} />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Editorial Split (Electronics / Modern Living) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <FadeReveal className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-px bg-black/10 border border-black/10">
              {electronics.slice(0, 4).map(product => (
                <Link key={product.id} href={`/product/${product.slug}`} className="bg-gallery group block relative overflow-hidden flex flex-col">
                  <div className="aspect-square bg-concrete/10 relative">
                    <img src={firstImage(product)} alt={product.title} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-4 border-t border-black/5">
                    <h3 className="text-sm font-medium line-clamp-1">{product.title}</h3>
                    <p className="text-sm font-bold mt-1">${Number(product.price).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </FadeReveal>
          
          <FadeReveal className="order-1 lg:order-2 flex flex-col items-start">
            <Badge variant="secondary" className="mb-6">Curated Tech</Badge>
            <h2 className="font-heading text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              ENGINEERED FOR MODERN LIVING
            </h2>
            <p className="text-graphite text-lg mb-10 max-w-md leading-relaxed">
              Discover our curation of high-performance electronics designed to seamlessly integrate into your space.
            </p>
            <Link href="/s?category=electronics">
              <Button size="lg" className="shadow-flat hover:translate-y-px hover:translate-x-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
                Explore Electronics
              </Button>
            </Link>
          </FadeReveal>
        </div>
      </section>

      {/* 5. Recently Viewed / Action */}
      <RecentlyViewedClient signedIn={!!session} />
    </div>
  );
}

function firstImage(product: HomeProduct) {
  const images = JSON.parse(product.images) as string[];
  return images[0];
}
