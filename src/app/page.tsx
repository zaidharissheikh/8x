import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import QuadCard from '@/components/home/QuadCard';
import CarouselRail from '@/components/home/CarouselRail';
import HistoryRail from '@/components/home/HistoryRail';
import BrowsingHistory from '@/components/home/BrowsingHistory';
import { auth } from '@/lib/auth';

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
  const homeProducts = products.filter((product) => product.category.slug === 'home-kitchen');
  const beautyProducts = products.filter((product) => product.category.slug === 'beauty-and-personal-care' || product.category.slug === 'beauty' || product.category.slug === 'skin-care' || product.category.slug === 'fragrances');
  const fashionProducts = products.filter((product) => product.category.slug.includes('fashion') || product.category.slug === 'tops');
  const deals = products.filter((product) => product.listPrice !== null).slice(0, 12);
  const fallback = products.slice(0, 4);

  const cardItems = (items: HomeProduct[], options: { badge?: boolean; prices?: boolean } = {}) => (items.length ? items : fallback).slice(0, 4).map((product, index) => ({
    name: product.title,
    price: options.prices === false ? undefined : Number(product.price).toFixed(2),
    image: firstImage(product),
    link: `/product/${product.slug}`,
    badge: options.badge && product.listPrice ? { discount: `${Math.round((1 - Number(product.price) / Number(product.listPrice)) * 100)}% off`, text: 'Limited time deal' } : undefined,
    imageBg: 'bg-white',
    key: `${product.id}-${index}`,
  }));

  const dealItems = (deals.length ? deals : products).map((product) => ({
    id: product.id,
    title: product.title,
    badge: product.listPrice ? { discount: `${Math.round((1 - Number(product.price) / Number(product.listPrice)) * 100)}% off`, text: 'Limited time deal' } : undefined,
    image: firstImage(product),
    link: `/product/${product.slug}`,
  }));

  const historyItems = products.slice(12, 22).map((product) => ({
    id: product.id,
    title: product.title,
    rating: Math.max(1, Math.min(5, Math.round(product.ratingAvg))),
    reviews: product.ratingCount.toLocaleString(),
    price: Number(product.price).toFixed(2),
    originalPrice: product.listPrice ? Number(product.listPrice).toFixed(2) : undefined,
    image: firstImage(product),
    link: `/product/${product.slug}`,
  }));

  const categoryHeading = (items: HomeProduct[], fallbackTitle: string) => items[0]?.category.name || fallbackTitle;

  return (
    <div className="min-w-0 flex-1 bg-[#eaeded]">
      <section className="mx-auto w-full max-w-[1500px] px-3 pt-3 sm:px-4 lg:pt-4">
        <div className="grid auto-rows-[220px] grid-cols-1 gap-3 sm:auto-rows-[250px] lg:grid-cols-3 lg:auto-rows-[242px] lg:gap-4">
          <HeroCard href="/s?deal=1" image="https://m.media-amazon.com/images/I/61i3H2ZHJWL._AC_AIweblab1431263,T1_FMavif_SF1282.5,2052_QL54_.jpg?aicid=homepage-single-creative-card" alt="Prime Big Deals" className="lg:row-span-2" title={<><span className="text-base font-normal sm:text-lg">Exclusively for members</span><br /><span className="mt-2 block text-3xl font-bold leading-[1.05] sm:text-[42px]">Prime Big Deals<br />drop Oct 6-7</span></>} button="Join Prime" />
          <HeroCard href="/s?category=womens-fashion" image="https://m.media-amazon.com/images/W/BW_MEDIAX_AVIF_MEASUREMENT_1306696-T4/images/I/71ZmNPvKB7L._SR854,1368_.jpg" alt="Fall fashion" title="The fall edit" subtitle="Shop premium brands" />
          <HeroCard href="/s?k=halloween+candy" image="https://m.media-amazon.com/images/I/716L5NTE3gL._AC_AIweblab1431263,T1_FMavif_SF1282.5,2052_QL54_.jpg?aicid=homepage-single-creative-card" alt="Halloween candy" title={<>Shop Halloween<br />candy picks</>} />
          <HeroCard href="/s?price=Under%20%2420" image="https://m.media-amazon.com/images/W/BW_MEDIAX_AVIF_MEASUREMENT_1306696-T4/images/I/61JFkRK2ZHL._SX855_.jpg" alt="Customer loved finds" title={<>Customer-loved<br />finds under $20</>} subtitle="Spend less every day" />
          <HeroCard href="/s?category=mens-fashion" image="https://m.media-amazon.com/images/W/BW_MEDIAX_AVIF_MEASUREMENT_1306696-T4/images/I/61z+d7nUuAL._SR427,684_.jpg" alt="Sportswear" title={<>Stay active<br />with sportswear</>} subtitle="New styles and more" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1500px] px-3 py-3 sm:px-4">
        <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.slice(0, 8).map((product) => <Link href={`/product/${product.slug}`} key={product.id} className="group flex min-w-[185px] max-w-[185px] shrink-0 flex-col rounded-[4px] border border-gray-200 bg-white p-3 shadow-sm sm:min-w-[205px] sm:max-w-[205px]"><h2 className="line-clamp-2 min-h-9 text-sm font-bold leading-tight text-[#0f1111] group-hover:text-[#c7511f]">{product.title}</h2><span className="mt-1 text-[11px] text-gray-500">Recommended for you</span><div className="relative mt-2 h-[135px]"><Image src={firstImage(product)} alt={product.title} fill sizes="205px" className="object-contain mix-blend-multiply" unoptimized /></div><span className="mt-2 text-sm font-bold text-[#b12704]">${Number(product.price).toFixed(2)}</span></Link>)}
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-[1500px] min-w-0 flex-col gap-4 px-3 pb-10 sm:px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <QuadCard title="Selected for you" sponsor="Sponsored" items={cardItems(products)} />
          <QuadCard title="Continue browsing" sponsor="Sponsored" items={cardItems(products.slice(4, 8), { badge: true, prices: false })} />
          <QuadCard title={`Keep shopping for ${categoryHeading(electronics, 'electronics').toLowerCase()}`} hasArrow items={cardItems(electronics)} />
          <QuadCard title={`Popular in ${categoryHeading(homeProducts, 'Home & Kitchen')}`} hasArrow items={cardItems(homeProducts.length ? homeProducts : products.slice(8, 12), { badge: true, prices: false })} />
        </div>

        <CarouselRail title="Deals you can't miss" items={dealItems} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <QuadCard title={`Shop ${categoryHeading(fashionProducts, 'fashion').toLowerCase()}`} hasArrow items={cardItems(fashionProducts)} />
          <QuadCard title={`Explore ${categoryHeading(beautyProducts, 'beauty').toLowerCase()}`} hasArrow items={cardItems(beautyProducts, { badge: true, prices: false })} />
          <QuadCard title={`Top picks in ${categoryHeading(homeProducts, 'Home & Kitchen').toLowerCase()}`} hasArrow items={cardItems(homeProducts.slice(4))} />
          <QuadCard title="More products to explore" hasArrow items={cardItems(products.slice(20, 24).length ? products.slice(20, 24) : products.slice(12, 16))} />
        </div>

        {historyItems.length > 0 && <HistoryRail title="Customers who viewed these products also viewed" items={historyItems} />}
        <BrowsingHistory />
        {!session && <section className="flex flex-col items-center border-b border-gray-300 bg-white px-4 py-7 text-center"><h2 className="text-lg font-bold">See personalized recommendations</h2><Link href="/auth/signin" className="mt-3 min-w-[230px] rounded-full border border-[#e6a400] bg-[#ffd814] px-6 py-2 text-sm font-bold shadow-sm hover:bg-[#f7ca00]">Sign in</Link><p className="mt-2 text-xs">New customer? <Link href="/auth/register" className="text-[#007185] hover:text-[#c7511f] hover:underline">Start here.</Link></p></section>}
      </main>
    </div>
  );
}

function firstImage(product: HomeProduct) {
  const images = JSON.parse(product.images) as string[];
  return images[0];
}

function HeroCard({ href, image, alt, title, subtitle, button, className = '' }: { href: string; image: string; alt: string; title: React.ReactNode; subtitle?: string; button?: string; className?: string }) {
  return <Link href={href} className={`group relative overflow-hidden rounded-[4px] bg-gray-800 p-5 shadow-sm sm:p-6 ${className}`}><Image src={image} alt={alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" unoptimized /><div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" /><div className="relative z-10 flex h-full flex-col items-start text-white drop-shadow-md">{subtitle && <span className="text-sm font-medium sm:text-base">{subtitle}</span>}<h1 className="mt-1 text-[27px] font-bold leading-[1.05] sm:text-[32px]">{title}</h1>{button && <span className="mt-5 rounded-full bg-[#ffd814] px-4 py-2 text-xs font-bold text-black shadow-sm group-hover:bg-[#f7ca00]">{button}</span>}{button && <span className="mt-auto text-[11px]">Terms apply.</span>}</div></Link>;
}
