import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

type OrderInput = {
  productId: string;
  quantity: number;
  title?: string;
};

export async function POST(request: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: 'Please sign in before placing an order.' }, { status: 401 });

  try {
    const body = await request.json() as { items?: OrderInput[]; address?: Record<string, string>; paymentLast4?: string };
    const inputItems = body.items?.filter((item) => item.productId && Number.isInteger(item.quantity) && item.quantity > 0) ?? [];
    if (inputItems.length === 0 || !body.address || !body.paymentLast4) return NextResponse.json({ error: 'Complete the delivery and payment details.' }, { status: 400 });

    const products = await prisma.product.findMany({ where: { id: { in: inputItems.map((item) => item.productId) } } });
    const productMap = new Map(products.map((product) => [product.id, product]));
    const orderItems = inputItems.flatMap((item) => {
      const product = productMap.get(item.productId);
      if (!product || product.stock < item.quantity) return [];
      return [{ product, quantity: item.quantity, title: item.title || product.title }];
    });
    if (orderItems.length !== inputItems.length) return NextResponse.json({ error: 'One of the items is no longer available.' }, { status: 409 });

    const subtotal = orderItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'PAID',
        subtotal: subtotal.toFixed(2),
        tax: '0.00',
        shipping: '0.00',
        total: subtotal.toFixed(2),
        addressSnapshot: JSON.stringify(body.address),
        paymentIntentId: `demo_card_${body.paymentLast4}`,
        items: { create: orderItems.map(({ product, quantity, title }) => ({ productId: product.id, titleSnapshot: title, priceSnapshot: product.price, quantity })) },
      },
    });

    return NextResponse.json({ ok: true, orderId: order.id });
  } catch {
    return NextResponse.json({ error: 'We could not place your order. Please try again.' }, { status: 500 });
  }
}
