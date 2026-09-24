import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ placed?: string }> }) {
  const session = await auth();
  const params = await searchParams;
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const orders = userId
    ? await prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { items: { include: { product: { select: { slug: true } } } } } })
    : [];

  return (
    <div className="min-h-screen bg-[#eaeded] px-4 py-8">
      <div className="mx-auto max-w-5xl rounded-[4px] border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-medium">Your Orders</h1>
        {session ? (
          <>
            {params.placed && <div className="mt-4 rounded border border-green-300 bg-green-50 p-4 text-sm text-green-800">Order placed successfully. Your payment was accepted.</div>}
            {orders.length > 0 ? (
              <div className="mt-6 space-y-5">
                {orders.map((order) => (
                  <article key={order.id} className="overflow-hidden rounded border border-gray-300">
                    <div className="flex flex-wrap gap-x-8 gap-y-2 bg-gray-100 px-4 py-3 text-xs text-gray-700">
                      <span>ORDER PLACED<br /><b>{order.createdAt.toLocaleDateString()}</b></span>
                      <span>ORDER #<br /><b>{order.id.slice(0, 12).toUpperCase()}</b></span>
                      <span>PAYMENT<br /><b className="text-[#007600]">Received</b></span>
                    </div>
                    <div className="space-y-3 p-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between gap-4 text-sm">
                          <Link href={`/product/${item.product.slug}`} className="text-[#007185] hover:text-[#c7511f] hover:underline">{item.titleSnapshot}</Link>
                          <span className="shrink-0 text-gray-700">Qty {item.quantity} · ${Number(item.priceSnapshot).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-3 text-right font-bold">Order total: ${Number(order.total).toFixed(2)}</div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-700">You have not placed any orders yet.</p>
            )}
          </>
        ) : (
          <><p className="mt-4 text-sm text-gray-700">Sign in to view your orders.</p><Link href="/auth/signin?callbackUrl=/orders" className="mt-5 inline-block rounded-full bg-[#ffd814] px-6 py-2 text-sm font-bold shadow-sm hover:bg-[#f7ca00]">Sign in</Link></>
        )}
      </div>
    </div>
  );
}
