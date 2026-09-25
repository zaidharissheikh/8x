import Image from 'next/image';
import Link from 'next/link';
import QuickAddToCartButton from './QuickAddToCartButton';
import { Badge, Price, Rating } from '@/components/ui';
import { cn } from '@/lib/utils';

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

export default function ProductCard({ product, showAddToCart = false, layout = 'list' }: { product: CatalogProduct; showAddToCart?: boolean; layout?: 'list' | 'related' | 'grid' }) {
  if (layout === 'related') return <RelatedProductCard product={product} />;
  
  if (layout === 'grid') {
    return (
      <article className="group flex flex-col bg-gallery relative border-b border-r border-black/10 p-6 sm:p-8 hover:bg-white transition-colors">
        {product.isBestSeller && (
          <Badge variant="default" className="absolute top-6 left-6 z-10 shadow-flat">
            Best Seller
          </Badge>
        )}
        <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] w-full bg-concrete/20 overflow-hidden border border-black/5 mb-6">
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className="absolute inset-0 h-full w-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105" 
          />
        </Link>
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-graphite mb-2">
              {product.brand || 'The Gallery'}
            </p>
            <Link href={`/product/${product.slug}`} className="inline-block mb-3">
              <h2 className="text-base font-medium leading-snug text-black group-hover:text-graphite transition-colors line-clamp-2">
                {product.title}
              </h2>
            </Link>
            <div className="flex items-center gap-2 mb-6">
              <Rating value={product.ratingAvg} />
              <span className="text-[10px] font-bold text-graphite">({formatCount(product.ratingCount)})</span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-4">
            <Price 
              amount={product.price.toFixed(2)} 
              originalAmount={product.listPrice ? product.listPrice.toFixed(2) : undefined} 
            />
            {showAddToCart && (product.stock === undefined || product.stock > 0) && (
              <div className="w-[120px]">
                <QuickAddToCartButton 
                  product={{ id: product.id, slug: product.slug, title: product.title, price: product.price, image: product.images[0], stock: product.stock || 1 }} 
                  wide 
                />
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col md:flex-row gap-8 py-10 border-b border-black/10 bg-white first:pt-4 px-4 md:px-0 hover:bg-concrete/5 transition-colors">
      {/* Image Column */}
      <Link href={`/product/${product.slug}`} className="block shrink-0 w-full md:w-[320px]">
        <div className="relative aspect-[4/5] w-full bg-concrete/20 overflow-hidden border border-black/5">
          {product.isBestSeller && (
            <Badge variant="default" className="absolute top-4 left-4 z-10 shadow-flat">
              Best Seller
            </Badge>
          )}
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className="absolute inset-0 h-full w-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105" 
          />
        </div>
      </Link>
      
      {/* Details Column */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-graphite mb-3">
          {product.brand || 'The Gallery'}
        </p>
        
        <Link href={`/product/${product.slug}`} className="inline-block">
          <h2 className="text-xl md:text-2xl font-medium leading-tight text-black group-hover:text-graphite transition-colors line-clamp-2">
            {product.title}
          </h2>
        </Link>
        
        <div className="mt-4 flex items-center gap-3">
          <Rating value={product.ratingAvg} />
          <span className="text-xs font-bold text-graphite">({formatCount(product.ratingCount)})</span>
        </div>
        
        {product.description && (
          <p className="mt-6 line-clamp-2 text-sm text-graphite leading-relaxed max-w-2xl">
            {product.description}
          </p>
        )}
        
        <div className="mt-auto pt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Price 
              amount={product.price.toFixed(2)} 
              originalAmount={product.listPrice ? product.listPrice.toFixed(2) : undefined} 
              className="text-2xl"
            />
            {product.stock !== undefined && product.stock > 0 && product.stock < 15 && (
              <p className="mt-2 text-[10px] font-bold text-oxblood uppercase tracking-widest">
                Only {product.stock} left
              </p>
            )}
            {product.stock === 0 && (
              <p className="mt-2 text-[10px] font-bold text-graphite uppercase tracking-widest">
                Out of Stock
              </p>
            )}
          </div>
          
          {showAddToCart && (product.stock === undefined || product.stock > 0) && (
            <div className="w-full md:w-auto min-w-[200px]">
              <QuickAddToCartButton 
                product={{ id: product.id, slug: product.slug, title: product.title, price: product.price, image: product.images[0], stock: product.stock || 1 }} 
                wide 
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function RelatedProductCard({ product }: { product: CatalogProduct }) {
  return (
    <article className="flex w-[240px] shrink-0 flex-col group">
      <Link href={`/product/${product.slug}`} className="flex flex-col h-full">
        <div className="relative aspect-[3/4] w-full bg-concrete/20 overflow-hidden border border-black/5">
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className="absolute inset-0 h-full w-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105" 
          />
        </div>
        <div className="pt-4 flex flex-col flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-graphite mb-2 line-clamp-1">{product.brand || 'The Gallery'}</p>
          <h2 className="line-clamp-2 text-sm font-medium text-black group-hover:text-graphite transition-colors">{product.title}</h2>
          <div className="mt-auto pt-4">
            <Price amount={product.price.toFixed(2)} originalAmount={product.listPrice ? product.listPrice.toFixed(2) : undefined} />
          </div>
        </div>
      </Link>
    </article>
  );
}

function formatCount(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  return value.toLocaleString();
}
