import Image from 'next/image';
import Link from 'next/link';
import QuickAddToCartButton from './QuickAddToCartButton';

export type CatalogProduct = {
  id: string;
  slug: string;
  title: string;
  price: number;
  listPrice: number | null;
  images: string[];
  ratingAvg: number;
  ratingCount: number;
  isPrime: boolean;
  stock?: number;
  brand?: string;
  description?: string;
  isBestSeller?: boolean;
};

export default function ProductCard({ product, showAddToCart = false, layout = 'list' }: { product: CatalogProduct; showAddToCart?: boolean; layout?: 'list' | 'related' }) {
  if (layout === 'related') return <RelatedProductCard product={product} />;

  const priceParts = product.price.toFixed(2).split('.');

  return (
    <article className="flex flex-col gap-5 border-b border-gray-200 bg-white p-4 sm:flex-row lg:min-h-[350px]">
      <Link href={`/product/${product.slug}`} className="group block shrink-0">
        <div className="relative h-[260px] w-full bg-[#f7f7f7] sm:h-[330px] sm:w-[300px]">{product.isBestSeller && <span className="absolute left-0 top-0 z-10 rounded-br bg-[#c45500] px-2 py-1 text-xs font-bold text-white">Best Seller</span>}<Image src={product.images[0]} alt={product.title} fill sizes="300px" className="object-contain transition group-hover:scale-105" unoptimized /></div>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs text-gray-600">Sponsored</span>
        <Link href={`/product/${product.slug}`} className="mt-1 text-xl leading-7 text-[#111] hover:text-[#c7511f] hover:underline">{product.title}</Link>
        <div className="mt-2 flex items-center text-sm"><span>{product.ratingAvg.toFixed(1)}</span><span className="ml-1 text-[#f08804]">{'★'.repeat(Math.round(product.ratingAvg))}{'☆'.repeat(Math.max(0, 5 - Math.round(product.ratingAvg)))}</span><span className="ml-1 text-[#007185]">({formatCount(product.ratingCount)})</span></div>
        <p className="mt-2 text-base text-gray-700">{product.ratingCount > 5000 ? '10K+' : '800+'} bought in past month</p>
        {product.description && <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-5 text-gray-700">{product.description}</p>}
        <div className="mt-3 grid max-w-3xl grid-cols-2 gap-x-10 gap-y-2 text-sm md:grid-cols-3"><div><span className="text-gray-600">Brand</span><br /><b>{product.brand || 'Amazon'}</b></div><div><span className="text-gray-600">Availability</span><br /><b>{product.stock && product.stock > 0 ? 'In Stock' : 'Out of Stock'}</b></div><div><span className="text-gray-600">Delivery</span><br /><b>FREE delivery</b></div></div>
        <div className="mt-auto pt-4"><div className="flex items-start text-[#111]"><span className="mt-1 text-sm">$</span><span className="text-3xl">{priceParts[0]}</span><sup className="mt-1 text-sm">{priceParts[1]}</sup>{product.listPrice && <span className="ml-3 mt-2 text-sm text-gray-500">Typical price: <span className="line-through">${product.listPrice.toFixed(2)}</span></span>}</div>{product.isPrime && <div className="mt-1 text-sm font-bold italic text-[#147eb3]">✓prime</div>}<p className="mt-1 text-sm">FREE delivery <b>Tomorrow</b></p>{product.stock !== undefined && product.stock < 15 && product.stock > 0 && <p className="mt-1 text-sm text-[#c40000]">Only {product.stock} left in stock - order soon.</p>}{showAddToCart && (product.stock === undefined || product.stock > 0) && <div className="w-[304px] max-w-full"><QuickAddToCartButton product={{ id: product.id, slug: product.slug, title: product.title, price: product.price, image: product.images[0], stock: product.stock || 1 }} wide /></div>}</div>
      </div>
    </article>
  );
}

function RelatedProductCard({ product }: { product: CatalogProduct }) {
  const priceParts = product.price.toFixed(2).split('.');
  return <article className="flex w-[225px] shrink-0 flex-col bg-white"><Link href={`/product/${product.slug}`} className="group"><div className="relative h-[225px] w-full rounded-sm bg-[#f7f7f7]"><Image src={product.images[0]} alt={product.title} fill sizes="225px" className="object-contain transition group-hover:scale-105" unoptimized /></div><h2 className="mt-4 line-clamp-1 text-base text-[#007185] group-hover:text-[#c7511f] group-hover:underline">{product.title}</h2></Link><div className="mt-3 flex items-center text-sm text-[#f08804]"><span>{product.ratingAvg.toFixed(1)}</span><span className="ml-1">{'★'.repeat(Math.round(product.ratingAvg))}{'☆'.repeat(Math.max(0, 5 - Math.round(product.ratingAvg)))}</span><span className="ml-1 text-[#007185]">({formatCount(product.ratingCount)})</span></div><div className="mt-2 flex items-start text-[#111]"><span className="mt-1 text-sm">$</span><span className="text-2xl">{priceParts[0]}</span><sup className="mt-1 text-sm">{priceParts[1]}</sup></div></article>;
}

function formatCount(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  return value.toLocaleString();
}
