import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getProductImages } from '@/lib/catalog';
import { isBestSellerProduct } from '@/lib/bestSellers';
import CatalogPage from '@/components/catalog/CatalogPage';

export const dynamic = 'force-dynamic';

type SearchParams = { k?: string; category?: string; brand?: string | string[]; deal?: string; rating?: string | string[]; price?: string | string[]; prime?: string; delivery?: string; shipping?: string; sort?: string };

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = params.k?.trim() || '';
  const category = params.category && params.category !== 'all' ? params.category : undefined;
  const brandValues = values(params.brand);
  const ratingValues = values(params.rating).map(Number).filter(Number.isFinite);
  const priceRange = getPriceRange(values(params.price)[0]);
  const isBestSellers = params.sort === 'bestsellers';
  const commonConditions: Prisma.ProductWhereInput[] = [
    ...(query ? [{ OR: [{ title: { contains: query } }, { brand: { contains: query } }, { description: { contains: query } }] }] : []),
  ];
  const commonWhere: Prisma.ProductWhereInput = {
    AND: commonConditions,
    ...(params.deal === '1' ? { listPrice: { not: null } } : {}),
    ...(ratingValues.length ? { ratingAvg: { gte: Math.min(...ratingValues) } } : {}),
    ...(priceRange ? { price: priceRange } : {}),
    ...(params.prime === '1' ? { isPrime: true } : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(isBestSellers ? { ratingAvg: { gte: 4.5 }, ratingCount: { gte: 4000 } } : {}),
  };
  const productWhere: Prisma.ProductWhereInput = {
    ...commonWhere,
    AND: [
      ...commonConditions,
      ...(brandValues.length ? [{ OR: brandValues.map((brand) => ({ brand: { contains: brand } })) }] : []),
    ],
  };
  const [products, brandRows] = await Promise.all([
    prisma.product.findMany({
      where: productWhere,
      orderBy: isBestSellers ? [{ ratingCount: 'desc' }, { ratingAvg: 'desc' }, { createdAt: 'desc' }] : query ? { title: 'asc' } : { createdAt: 'desc' },
      take: 48,
    }),
    prisma.product.findMany({
      where: commonWhere,
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    }),
  ]);
  const availableBrands = [...new Set([...brandValues, ...brandRows.map((product) => product.brand)])];

  return <CatalogPage title={isBestSellers ? 'Best Sellers' : query ? `Results for "${query}"` : params.deal === '1' ? "Today's Deals" : 'Explore products'} subtitle={isBestSellers ? 'Top-rated products customers buy again and again.' : 'Shop popular categories and discover something new.'} filters={{ ...params, query }} availableBrands={availableBrands} products={products.map((product, index) => toCatalogProduct(product, index, isBestSellers || isBestSellerProduct(product)))} />;
}

function toCatalogProduct(product: { id: string; slug: string; title: string; price: unknown; listPrice: unknown; images: string; ratingAvg: number; ratingCount: number; isPrime: boolean; stock: number; brand: string; description: string }, index: number, isBestSeller = false) {
  return { ...product, price: Number(product.price), listPrice: product.listPrice ? Number(product.listPrice) : null, images: getProductImages(product.images, index), isBestSeller };
}

function getPriceRange(value?: string) {
  if (value === 'Under $20') return { lt: 20 };
  if (value === 'Under $25') return { lt: 25 };
  if (value === '$25 to $50') return { gte: 25, lte: 50 };
  if (value === '$50 to $100') return { gte: 50, lte: 100 };
  if (value === '$100 to $500') return { gte: 100, lte: 500 };
  if (value === '$500 & above') return { gte: 500 };
  return undefined;
}

function values(value?: string | string[]) {
  return value ? (Array.isArray(value) ? value : [value]) : [];
}
