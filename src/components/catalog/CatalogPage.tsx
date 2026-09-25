import Link from 'next/link';
import { prisma } from '@/lib/db';
import ProductCard, { CatalogProduct } from '@/components/product/ProductCard';
import FilterCheckbox from './FilterCheckbox';
import SortSelect from './SortSelect';
import { Button } from '@/components/ui';

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
    <div className="min-h-screen bg-gallery px-4 py-8 lg:py-12 border-t border-black/10">
      <div className="mx-auto max-w-[1800px]">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/10 pb-6 mb-10 gap-6">
          <div>
            <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-2">
              {title}
            </h1>
            {subtitle && <p className="text-sm text-graphite max-w-2xl">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-4 text-sm font-medium shrink-0">
            <span className="text-graphite">Showing {products.length} results</span>
            <form action="/s" method="get" className="w-48">
              {filters.query && <input type="hidden" name="k" value={filters.query} />}
              {filters.category && <input type="hidden" name="category" value={filters.category} />}
            </form>
          </div>
        </div>

        <form action="/s" method="get">
          {filters.query && <input type="hidden" name="k" value={filters.query} />}
          
          <div className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] items-start">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block space-y-10 sticky top-24">
              <FilterGroup title="Department">
                {categories.map((category) => <FilterCheckbox key={category.slug} type="radio" name="category" value={category.slug} label={category.name} checked={filters.category === category.slug} />)}
              </FilterGroup>
              
              <FilterGroup title="Delivery Options">
                <FilterCheckbox name="prime" value="1" label="Prime Eligible" checked={filters.prime === '1'} />
                <FilterCheckbox name="delivery" value="today" label="Get It Today" checked={filters.delivery === 'today'} />
                <FilterCheckbox name="shipping" value="free" label="Free Shipping" checked={filters.shipping === 'free'} />
              </FilterGroup>

              {brands.length > 0 && (
                <FilterGroup title="Brands">
                  {brands.map((brand) => <FilterCheckbox key={brand} name="brand" value={brand} label={brand} checked={selectedBrands.includes(brand)} />)}
                </FilterGroup>
              )}
              
              <FilterGroup title="Price Range">
                {['Under $20', 'Under $25', '$25 to $50', '$50 to $100', '$100 to $500', '$500 & above'].map((price) => <FilterCheckbox key={price} name="price" value={price} label={price} checked={selectedPrices.includes(price)} />)}
              </FilterGroup>
            </aside>

            {/* Main Product Grid */}
            <main className="min-w-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-4 items-center">
                  {filters.query && (
                    <Link href="/s" className="text-xs font-bold uppercase tracking-widest text-black hover:text-graphite border-b border-black pb-0.5 transition-colors">
                      Clear all filters
                    </Link>
                  )}
                </div>
                <SortSelect defaultValue={filters.sort || 'featured'} />
              </div>
              
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 border-t border-l border-black/10">
                  {products.map((product) => <ProductCard key={product.id} product={product} layout="grid" showAddToCart />)}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 px-4 border border-black/10 bg-white shadow-flat mt-8">
                  <h2 className="font-heading text-2xl font-bold tracking-tight mb-2">No results found</h2>
                  <p className="text-graphite mb-8 text-center max-w-md">We couldn't find anything matching your current filters. Try adjusting your search or browse all products.</p>
                  <Link href="/s">
                    <Button variant="outline" className="border-black text-black rounded-none">Reset Search</Button>
                  </Link>
                </div>
              )}
            </main>
          </div>
        </form>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-black mb-4 pb-2 border-b border-black/10">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function values(value?: string | string[]) {
  return value ? (Array.isArray(value) ? value : [value]) : [];
}
