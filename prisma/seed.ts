import { PrismaClient } from '@prisma/client'
import categoryMeta from './category-map.json'

const prisma = new PrismaClient()

async function main() {
  const remote = await fetch('https://dummyjson.com/products?limit=194').then((response) => {
    if (!response.ok) throw new Error(`DummyJSON request failed: ${response.status}`)
    return response.json()
  })
  const unmappedCategories = [...new Set(remote.products.map((item: { category: string }) => item.category).filter((category: string) => !categoryMeta[category as keyof typeof categoryMeta]))]
  if (unmappedCategories.length) throw new Error(`Unmapped DummyJSON categories: ${unmappedCategories.join(', ')}`)

  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()

  // Seed Admin and Demo User
  const demo = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: 'seeded-hash', 
      role: 'ADMIN',
    },
  })

  // bcrypt hash for 'Demo@1234'
  await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@example.com',
      passwordHash: '$2b$10$vsd/hge0FkzS.QqpkrRCSu2Wp7bHighb.N4fefpucuzKQh3jqTx2u',
      role: 'USER',
    },
  })

  // Seed Categories
  const categoriesData = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Computers', slug: 'computers' },
    { name: 'Smart Home', slug: 'smart-home' },
    { name: 'Arts & Crafts', slug: 'arts-crafts' },
    { name: 'Automotive', slug: 'automotive' },
    { name: 'Baby', slug: 'baby' },
    { name: 'Beauty & Personal Care', slug: 'beauty' },
    { name: 'Women\'s Fashion', slug: 'womens-fashion' },
    { name: 'Men\'s Fashion', slug: 'mens-fashion' },
    { name: 'Health & Household', slug: 'health' },
    { name: 'Home & Kitchen', slug: 'home-kitchen' },
    { name: 'Industrial & Scientific', slug: 'industrial' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors' },
  ]
  
  const createdCategories = []
  for (const c of categoriesData) {
    createdCategories.push(await prisma.category.create({ data: c }))
  }
  const categoryLookup = new Map(createdCategories.map((category) => [category.name, category]))

  // Seed Products
  for (const [index, item] of remote.products.entries()) {
    const categoryMetaForProduct = categoryMeta[item.category as keyof typeof categoryMeta]
    const category = categoryLookup.get(categoryMetaForProduct.name)!
    const product = await prisma.product.create({
      data: {
        title: item.title,
        slug: `dummy-${item.id}-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        description: item.description,
        bullets: JSON.stringify(item.tags?.length ? item.tags : ['Quality product', 'Fast delivery available']),
        brand: item.brand || categoryMetaForProduct.name,
        price: item.price,
        listPrice: item.discountPercentage ? Number((item.price / (1 - item.discountPercentage / 100)).toFixed(2)) : null,
        stock: item.stock,
        images: JSON.stringify(item.images?.length ? item.images : [item.thumbnail]),
        categoryId: category.id,
        ratingAvg: item.rating,
        ratingCount: Math.max(1, Math.round(item.rating * 1000)),
        isPrime: index % 2 === 0,
      }
    })
    const review = item.reviews?.[0]
    if (review) await prisma.review.create({ data: { productId: product.id, userId: demo.id, rating: Math.max(1, Math.min(5, Math.round(review.rating))), title: 'Verified customer review', body: review.comment, createdAt: new Date(review.date) } })
  }

  console.log('Seeded database successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
