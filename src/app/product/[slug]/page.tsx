import Link from 'next/link';
import { UserCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getProductImages } from '@/lib/catalog';
import { getProductVariantConfig } from '@/lib/productVariants';
import ProductCard from '@/components/product/ProductCard';
import ProductGallery from '@/components/product/ProductGallery';
import ProductConfigurator from '@/components/product/ProductConfigurator';
import HistoryTracker from '@/components/product/HistoryTracker';
import { Rating } from '@/components/ui';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { name: true, image: true } } },
      },
    },
  });
  if (!product) return notFound();

  const related = await prisma.product.findMany({ where: { categoryId: product.categoryId, id: { not: product.id } }, orderBy: { ratingAvg: 'desc' }, take: 6 });
  const images = getProductImages(product.images);
  const bullets = JSON.parse(product.bullets) as string[];
  const productForCart = { id: product.id, slug: product.slug, title: product.title, price: Number(product.price), image: images[0], stock: product.stock };
  const variants = getProductVariantConfig(product.category.slug, product.title, Number(product.price));
  const specifications = getProductSpecifications(product.id, product.category.slug, product.brand);
  const ratingDistribution = getRatingDistribution(product.ratingAvg);

  return (
    <div className="min-h-screen bg-gallery px-4 pb-12 pt-8 border-t border-black/10">
      <HistoryTracker product={{ id: product.id, slug: product.slug, title: product.title, image: images[0] }} />
      <div className="mx-auto max-w-[1600px]">
        {/* Breadcrumb */}
        <nav className="mb-10 text-[10px] font-bold uppercase tracking-widest flex flex-wrap items-center gap-2">
          <Link href="/" className="text-graphite hover:text-black transition-colors">Home</Link>
          <span className="text-black/20">/</span>
          <Link href={`/category/${product.category.slug}`} className="text-graphite hover:text-black transition-colors">{product.category.name}</Link>
          <span className="text-black/20">/</span>
          <span className="text-black truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid items-start gap-12 lg:gap-16 lg:grid-cols-[minmax(400px,5fr)_minmax(330px,4fr)_320px]">
          <ProductGallery images={images} title={product.title} />

          <ProductConfigurator 
            product={productForCart} 
            variants={variants} 
            title={product.title} 
            brand={product.brand} 
            brandHref={`/s?brand=${encodeURIComponent(product.brand)}`} 
            ratingAvg={product.ratingAvg} 
            ratingCount={product.ratingCount} 
            listPrice={product.listPrice ? Number(product.listPrice) : null} 
            description={product.description} 
            bullets={bullets} 
            specifications={specifications} 
          />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-black/10 pt-16">
            <h2 className="font-heading text-3xl font-bold tracking-tight mb-8">Related Items</h2>
            <div className="custom-scrollbar-hide flex gap-8 overflow-x-auto pb-4">
              {related.map((item) => (
                <ProductCard 
                  key={item.id} 
                  layout="related" 
                  product={{ 
                    id: item.id, 
                    slug: item.slug, 
                    title: item.title, 
                    price: Number(item.price), 
                    listPrice: item.listPrice ? Number(item.listPrice) : null, 
                    images: getProductImages(item.images), 
                    ratingAvg: item.ratingAvg, 
                    ratingCount: item.ratingCount, 
                    isPrime: item.isPrime, 
                    stock: item.stock 
                  }} 
                />
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="mt-24 border-t border-black/10 pt-16">
          <h2 className="font-heading text-3xl font-bold tracking-tight mb-12">Customer Reviews</h2>
          <div className="grid gap-16 lg:grid-cols-[360px_1fr] items-start">
            <div className="sticky top-24">
              <div className="flex items-end gap-4 mb-4">
                <span className="font-heading text-6xl font-bold leading-none tracking-tighter">{product.ratingAvg.toFixed(1)}</span>
                <div className="pb-1">
                  <Rating value={product.ratingAvg} />
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-graphite">
                    {product.ratingCount.toLocaleString()} ratings
                  </p>
                </div>
              </div>
              <div className="mt-12 space-y-4">
                {ratingDistribution.map((rating) => (
                  <div key={rating.stars} className="grid grid-cols-[48px_1fr_40px] items-center gap-4 text-sm font-bold">
                    <span className="text-graphite">{rating.stars} Star</span>
                    <div className="h-1.5 w-full bg-concrete/50 overflow-hidden">
                      <div className="h-full bg-black" style={{ width: `${rating.percent}%` }} />
                    </div>
                    <span className="text-graphite text-right">{rating.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-8 border-b border-black/10 pb-4">Selected Reviews</h3>
              <div className="space-y-12">
                {product.reviews.length ? product.reviews.map((review) => (
                  <article key={review.id} className="border-b border-black/10 pb-12 last:border-0">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="h-10 w-10 bg-concrete flex items-center justify-center font-bold text-graphite shrink-0">
                        {review.user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <span className="text-sm font-bold block">{review.user.name || 'Anonymous User'}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-graphite">
                          {review.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Rating value={review.rating} />
                      <span className="text-sm font-bold text-black">{review.title}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-oxblood mb-4">Verified Purchase</p>
                    <p className="text-sm leading-relaxed text-black/80">{review.body}</p>
                  </article>
                )) : (
                  <p className="text-sm text-graphite font-bold uppercase tracking-widest">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function getProductSpecifications(id: string, categorySlug: string, brand: string) {
  const seed = [...id].reduce((total, character) => total + character.charCodeAt(0), 0);
  const fashion = categorySlug.includes('fashion');
  return [
    { label: 'Brand', value: brand },
    { label: 'SKU', value: `GLRY-${id.slice(-8).toUpperCase()}` },
    { label: 'Item weight', value: `${(fashion ? 0.4 + (seed % 20) / 10 : 1.2 + (seed % 70) / 10).toFixed(1)} lb` },
    { label: 'Dimensions', value: fashion ? '12 x 8 x 2 inches' : `${8 + seed % 8} x ${6 + seed % 6} x ${2 + seed % 4} inches` },
  ];
}

function getRatingDistribution(rating: number) {
  const weights = [5, 4, 3, 2, 1].map((stars) => Math.max(0.02, 1 - Math.abs(stars - rating) * 0.65));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return [5, 4, 3, 2, 1].map((stars, index) => ({ stars, percent: Math.max(1, Math.round((weights[index] / total) * 100)) }));
}
