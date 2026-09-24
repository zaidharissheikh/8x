import Link from 'next/link';
import { prisma } from '@/lib/db';
import ProductCard, { CatalogProduct } from '@/components/product/ProductCard';
import FilterCheckbox from './FilterCheckbox';

export type CatalogFilters = {
  query?: string;
  category?: string;
  brand?: string | string[];
  rating?: string | string[];
  price?: string | string[];
  deal?: string;
  prime?: string;
  delivery?: string;
  shipping?: string;
  sort?: string;
};

export default async function CatalogPage({ title, subtitle, products, filters = {}, availableBrands }: { title: string; subtitle?: string; products: CatalogProduct[]; filters?: CatalogFilters; availableBrands?: string[] }) {
  const categories = await prisma.category.findMany({ where: { products: { some: {} } }, orderBy: { name: 'asc' }, select: { name: true, slug: true } });
  const selectedBrands = values(filters.brand);
  const brands = [...new Set([...selectedBrands, ...(availableBrands || products.map((product) => product.brand).filter(Boolean))])].slice(0, 8) as string[];
  const selectedRatings = values(filters.rating);
  const selectedPrices = values(filters.price);

  return (
    <div className="min-h-screen bg-white px-3 py-3 sm:px-4">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center justify-between border-b border-gray-300 pb-2 text-sm"><span>1-{products.length} of more than 900,000 results</span><span className="rounded-md border border-gray-400 bg-white px-3 py-1.5">Sort by: Featured⌄</span></div>
        <form action="/s" method="get">
          {filters.query && <input type="hidden" name="k" value={filters.query} />}
          {filters.sort && <input type="hidden" name="sort" value={filters.sort} />}
          <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
            <aside className="hidden border-r border-gray-200 pr-5 pt-5 lg:block">
              <FilterGroup title="Prime Delivery"><FilterCheckbox name="prime" value="1" label="Prime eligible" checked={filters.prime === '1'} /></FilterGroup>
              <FilterGroup title="Delivery Day"><FilterCheckbox name="delivery" value="today" label="Get It Today" checked={filters.delivery === 'today'} /><FilterCheckbox name="delivery" value="tomorrow" label="Get It by Tomorrow" checked={filters.delivery === 'tomorrow'} /></FilterGroup>
              <FilterGroup title="Free Shipping Eligible"><FilterCheckbox name="shipping" value="free" label="Free Shipping" checked={filters.shipping === 'free'} /></FilterGroup>
              <FilterGroup title="Department"><div className="space-y-2 pl-1">{categories.map((category) => <FilterCheckbox key={category.slug} type="radio" name="category" value={category.slug} label={category.name} checked={filters.category === category.slug} />)}</div></FilterGroup>
              <FilterGroup title="Customer Reviews"><FilterCheckbox name="rating" value="4" label={<span className="text-[#f08804]">★★★★☆ <span className="text-[#111]">&amp; Up</span></span>} checked={selectedRatings.includes('4')} /><FilterCheckbox name="rating" value="3" label={<span className="text-[#f08804]">★★★☆☆ <span className="text-[#111]">&amp; Up</span></span>} checked={selectedRatings.includes('3')} /></FilterGroup>
              {brands.length > 0 && <FilterGroup title="Brands">{brands.map((brand) => <FilterCheckbox key={brand} name="brand" value={brand} label={brand} checked={selectedBrands.includes(brand)} />)}</FilterGroup>}
              <FilterGroup title="Price">{['Under $20', 'Under $25', '$25 to $50', '$50 to $100', '$100 to $500', '$500 & above'].map((price) => <FilterCheckbox key={price} name="price" value={price} label={price} checked={selectedPrices.includes(price)} />)}</FilterGroup>
              <FilterGroup title="Deals & Discounts"><FilterCheckbox name="deal" value="1" label="Today\'s Deals" checked={filters.deal === '1'} /></FilterGroup>
            </aside>
            <main className="min-w-0"><div className="py-5"><h1 className="text-2xl font-bold text-[#111]">Results</h1>{subtitle && <p className="mt-1 text-sm text-gray-600">{title} · {subtitle}</p>}{filters.query && <Link href="/s" className="mt-1 inline-block text-sm text-[#007185] hover:underline">Clear filters</Link>}</div>{products.length > 0 ? <div className="border-t border-gray-200">{products.map((product) => <ProductCard key={product.id} product={product} layout="list" showAddToCart />)}</div> : <div className="rounded border border-gray-300 p-8 text-center"><h2 className="text-xl font-medium">No products found</h2><p className="mt-2 text-sm text-gray-600">Try another search or browse all products.</p><Link href="/s" className="mt-4 inline-block text-sm text-[#007185] hover:underline">Browse all products</Link></div>}</main>
          </div>
        </form>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mb-7"><h2 className="mb-3 font-bold">{title}</h2><div className="space-y-2 text-sm">{children}</div></section>;
}

function values(value?: string | string[]) {
  return value ? (Array.isArray(value) ? value : [value]) : [];
}
