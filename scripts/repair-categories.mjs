import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';

const prisma = new PrismaClient();
const categoryMeta = JSON.parse(readFileSync(new URL('../prisma/category-map.json', import.meta.url), 'utf8'));

async function main() {
  const response = await fetch('https://dummyjson.com/products?limit=194');
  if (!response.ok) throw new Error(`DummyJSON request failed: ${response.status}`);
  const remote = await response.json();
  const categories = new Map((await prisma.category.findMany()).map((category) => [category.slug, category]));
  let repaired = 0;
  let missing = 0;

  for (const item of remote.products) {
    const mapping = categoryMeta[item.category];
    if (!mapping) throw new Error(`Unmapped DummyJSON category: ${item.category}`);
    const category = categories.get(mapping.slug);
    if (!category) throw new Error(`Missing database category: ${mapping.slug}`);
    const product = await prisma.product.findFirst({ where: { slug: { startsWith: `dummy-${item.id}-` } }, select: { id: true, categoryId: true } });
    if (!product) {
      missing += 1;
      continue;
    }
    if (product.categoryId !== category.id) {
      await prisma.product.update({ where: { id: product.id }, data: { categoryId: category.id } });
      repaired += 1;
    }
  }

  console.log(`Repaired ${repaired} product category assignments.${missing ? ` ${missing} products were not found.` : ''}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
