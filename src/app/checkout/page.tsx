import { auth } from '@/lib/auth';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import Image from 'next/image';
import Link from 'next/link';

export default async function CheckoutPage() {
  const session = await auth();
  return <div className="min-h-screen bg-[#eaeded] px-4 py-6"><div className="mx-auto max-w-6xl"><div className="mb-6 flex items-center justify-between border-b border-gray-300 pb-4"><Link href="/" aria-label="Amazon home"><Image src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" width={120} height={36} className="h-9 w-auto" unoptimized /></Link><span className="text-sm text-gray-600">🔒 Secure checkout</span></div><CheckoutForm authenticated={Boolean(session)} /></div></div>;
}
