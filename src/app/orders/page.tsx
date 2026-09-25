import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ placed?: string }> }) {
  const session = await auth();
  const params = await searchParams;
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const orders = userId
    ? await prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { items: { include: { product: { select: { slug: true } } } } } })
    : [];

  return (
    <div className="min-h-screen bg-gallery px-4 py-8 lg:py-16 border-t border-black/10">
      <div className="mx-auto max-w-[1000px]">
        <div className="flex items-end justify-between mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">Your Orders</h1>
          {session && <span className="text-sm font-bold uppercase tracking-widest text-graphite hidden sm:inline-block">({orders.length} Total)</span>}
        </div>

        {session ? (
          <>
            {params.placed && (
              <div className="mb-12 border border-black bg-white p-6 shadow-flat flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-xl font-bold mb-1">Order Confirmed</h3>
                  <p className="text-sm text-graphite">Your payment was accepted and your order is being processed.</p>
                </div>
                <div className="h-10 w-10 bg-black text-white flex items-center justify-center font-bold text-xl rounded-none shrink-0">✓</div>
              </div>
            )}
            
            {orders.length > 0 ? (
              <div className="space-y-12">
                {orders.map((order) => (
                  <article key={order.id} className="border border-black bg-white shadow-flat transition-transform hover:-translate-y-1 duration-300">
                    <div className="flex flex-wrap gap-x-12 gap-y-6 border-b border-black/10 bg-concrete/20 px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-graphite">Order Placed</span>
                        <span className="font-bold">{order.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-graphite">Order #</span>
                        <span className="font-bold">{order.id.slice(0, 12).toUpperCase()}</span>
                      </div>
                      <div className="flex flex-col gap-1 ml-auto text-right">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-graphite">Status</span>
                        <span className="font-bold text-black flex items-center gap-2 justify-end">
                          <span className="h-2 w-2 bg-black inline-block animate-pulse"></span> Processing
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="space-y-6">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between gap-8 items-start border-b border-black/10 pb-6 last:border-0 last:pb-0">
                            <Link href={`/product/${item.product.slug}`} className="group flex-1">
                              <h3 className="text-base font-bold text-black group-hover:text-graphite transition-colors mb-2 line-clamp-2">{item.titleSnapshot}</h3>
                              <p className="text-sm font-bold uppercase tracking-widest text-graphite">Qty: {item.quantity}</p>
                            </Link>
                            <span className="shrink-0 font-bold text-lg">${Number(item.priceSnapshot).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 pt-6 border-t border-black flex justify-between items-end">
                        <span className="text-xs font-bold uppercase tracking-widest text-graphite">Total</span>
                        <span className="font-heading text-3xl font-bold">${Number(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="border border-black/10 bg-white p-12 text-center shadow-flat">
                <p className="font-heading text-2xl font-bold mb-6">No orders yet</p>
                <Link href="/">
                  <Button variant="outline" className="border-black text-black">Start Exploring</Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="border border-black/10 bg-white p-12 text-center shadow-flat">
            <h2 className="font-heading text-3xl font-bold mb-4">Sign In Required</h2>
            <p className="text-sm text-graphite mb-8 max-w-md mx-auto">Please sign in to view your complete order history and tracking information.</p>
            <Link href="/auth/signin?callbackUrl=/orders">
              <Button size="lg" className="w-full sm:w-auto px-12">Sign In</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
