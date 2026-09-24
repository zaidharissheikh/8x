import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';

const prisma = new PrismaClient();
const categoryMeta = JSON.parse(readFileSync(new URL('../prisma/category-map.json', import.meta.url), 'utf8'));

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function main() {
  const response = await fetch('https://dummyjson.com/products?limit=194');
  if (!response.ok) throw new Error(`DummyJSON request failed: ${response.status}`);
  const remote = await response.json();
  const demo = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
  if (!demo) throw new Error('The demo user is missing.');

  const categoryCache = new Map();
  for (const category of await prisma.category.findMany()) categoryCache.set(category.slug, category);
  await prisma.review.deleteMany({ where: { userId: demo.id } });

  for (let index = 0; index < remote.products.length; index += 1) {
    const item = remote.products[index];
    const mapping = categoryMeta[item.category];
    if (!mapping) throw new Error(`Unmapped DummyJSON category: ${item.category}`);
    const { name: categoryName, slug: categorySlug } = mapping;
    const category = categoryCache.get(categorySlug) || await prisma.category.create({ data: { name: categoryName, slug: categorySlug } });
    categoryCache.set(categorySlug, category);
    const listPrice = item.discountPercentage ? Number((item.price / (1 - item.discountPercentage / 100)).toFixed(2)) : null;
    const data = {
      title: item.title,
      slug: `dummy-${item.id}-${slugify(item.title)}`,
      description: item.description,
      bullets: JSON.stringify(item.tags?.length ? item.tags : ['Quality product', 'Fast delivery available']),
      brand: item.brand || categoryName,
      price: item.price,
      listPrice,
      stock: item.stock,
      images: JSON.stringify(item.images?.length ? item.images : [item.thumbnail]),
      categoryId: category.id,
      ratingAvg: item.rating,
      ratingCount: Math.max(1, Math.round(item.rating * 1000)),
      isPrime: index % 2 === 0,
    };
    const existing = await prisma.product.findFirst({ where: { slug: { startsWith: `dummy-${item.id}-` } } });
    const product = existing ? await prisma.product.update({ where: { id: existing.id }, data }) : await prisma.product.create({ data });
    const review = item.reviews?.[0];
    if (review) await prisma.review.create({ data: { productId: product.id, userId: demo.id, rating: Math.max(1, Math.min(5, Math.round(review.rating))), title: 'Verified customer review', body: review.comment, createdAt: new Date(review.date) } });
  }
  console.log(`Updated ${remote.products.length} unique DummyJSON products.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
