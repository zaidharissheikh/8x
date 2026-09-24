import Link from 'next/link';
import { UserCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getProductImages } from '@/lib/catalog';
import { getProductVariantConfig } from '@/lib/productVariants';
import ProductCard from '@/components/product/ProductCard';
import ProductGallery from '@/components/product/ProductGallery';
import ProductConfigurator from '@/components/product/ProductConfigurator';

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
    <div className="min-h-screen bg-white px-4 pb-12 pt-4">
      <div className="mx-auto max-w-[1500px]">
        <nav className="mb-4 text-xs text-[#007185]"><Link href="/">Home</Link><span className="mx-2 text-gray-400">›</span><Link href={`/category/${product.category.slug}`}>{product.category.name}</Link><span className="mx-2 text-gray-400">›</span><span className="text-gray-600">{product.title}</span></nav>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(360px,5fr)_minmax(330px,4fr)_310px]">
          <ProductGallery images={images} title={product.title} />

          <ProductConfigurator product={productForCart} variants={variants} title={product.title} brand={product.brand} brandHref={`/s?brand=${encodeURIComponent(product.brand)}`} ratingAvg={product.ratingAvg} ratingCount={product.ratingCount} listPrice={product.listPrice ? Number(product.listPrice) : null} description={product.description} bullets={bullets} specifications={specifications} />
        </div>

        {related.length > 0 && <section className="mt-12 border-t border-gray-300 pt-6"><h2 className="text-2xl font-bold">Products related to this item</h2><div className="custom-scrollbar-hide mt-5 flex gap-5 overflow-x-auto pb-2">{related.map((item) => <ProductCard key={item.id} layout="related" product={{ id: item.id, slug: item.slug, title: item.title, price: Number(item.price), listPrice: item.listPrice ? Number(item.listPrice) : null, images: getProductImages(item.images), ratingAvg: item.ratingAvg, ratingCount: item.ratingCount, isPrime: item.isPrime, stock: item.stock }} />)}</div></section>}

        <section className="mt-12 border-t border-gray-300 pt-6"><h2 className="text-2xl font-bold">Customer reviews</h2><div className="mt-5 grid gap-10 lg:grid-cols-[330px_1fr]"><div><div className="text-3xl font-medium">{product.ratingAvg.toFixed(1)} <span className="text-[#f08804]">★</span> <span className="text-base font-normal text-gray-800">out of 5</span></div><p className="mt-1 text-sm text-gray-600">{product.ratingCount.toLocaleString()} global ratings</p><div className="mt-5 space-y-2">{ratingDistribution.map((rating) => <div key={rating.stars} className="grid grid-cols-[56px_1fr_38px] items-center gap-2 text-sm"><span className="text-[#007185]">{rating.stars} star</span><div className="h-5 overflow-hidden rounded border border-gray-300 bg-[#eef0f0]"><div className="h-full bg-[#f0a400]" style={{ width: `${rating.percent}%` }} /></div><span className="text-[#007185]">{rating.percent}%</span></div>)}</div></div><div><h3 className="text-2xl font-bold">Top reviews from the United States</h3><div className="mt-5 space-y-6">{product.reviews.length ? product.reviews.map((review) => <article key={review.id} className="border-b border-gray-200 pb-5"><div className="flex items-center gap-2"><UserCircle size={31} strokeWidth={1.5} className="text-gray-500" /><span className="text-sm font-medium">{review.user.name || 'Amazon Customer'}</span></div><div className="mt-3 text-[#f08804]">{review.rating.toFixed(1)} {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} <span className="ml-2 text-sm font-bold text-[#111]">{review.title}</span></div><p className="mt-2 text-sm text-gray-600">Reviewed in the United States on {review.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p><p className="mt-2 text-sm font-bold text-[#c45500]">Verified Purchase</p><p className="mt-2 text-sm leading-6 text-gray-700">{review.body}</p></article>) : <p className="text-sm text-gray-600">There are no reviews for this product yet.</p>}</div></div></div></section>
      </div>
    </div>
  );
}

function getProductSpecifications(id: string, categorySlug: string, brand: string) {
  const seed = [...id].reduce((total, character) => total + character.charCodeAt(0), 0);
  const fashion = categorySlug.includes('fashion');
  return [
    { label: 'Brand', value: brand },
    { label: 'SKU', value: `AMZ-${id.slice(-8).toUpperCase()}` },
    { label: 'Item weight', value: `${(fashion ? 0.4 + (seed % 20) / 10 : 1.2 + (seed % 70) / 10).toFixed(1)} lb` },
    { label: 'Dimensions', value: fashion ? '12 x 8 x 2 inches' : `${8 + seed % 8} x ${6 + seed % 6} x ${2 + seed % 4} inches` },
  ];
}

function getRatingDistribution(rating: number) {
  const weights = [5, 4, 3, 2, 1].map((stars) => Math.max(0.02, 1 - Math.abs(stars - rating) * 0.65));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return [5, 4, 3, 2, 1].map((stars, index) => ({ stars, percent: Math.max(1, Math.round((weights[index] / total) * 100)) }));
}
