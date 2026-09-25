import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getProductImages } from '@/lib/catalog';
import { isBestSellerProduct } from '@/lib/bestSellers';
import CatalogPage from '@/components/catalog/CatalogPage';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return notFound();
  const products = await prisma.product.findMany({ where: { categoryId: category.id }, orderBy: { createdAt: 'desc' } });
  return <CatalogPage title={category.name} subtitle={`Shop the best of ${category.name.toLowerCase()}.`} filters={{ category: slug }} products={products.map((product, index) => toCatalogProduct(product, index))} />;
}

function toCatalogProduct(product: { id: string; slug: string; title: string; price: unknown; listPrice: unknown; images: string; ratingAvg: number; ratingCount: number; isPrime: boolean; stock: number; brand: string; description: string }, index: number) {
  return { ...product, price: Number(product.price), listPrice: product.listPrice ? Number(product.listPrice) : null, images: getProductImages(product.images, index), isBestSeller: isBestSellerProduct(product) };
}
