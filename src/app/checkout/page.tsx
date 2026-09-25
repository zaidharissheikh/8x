import { auth } from '@/lib/auth';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import Link from 'next/link';

export default async function CheckoutPage() {
  const session = await auth();
  return (
    <div className="min-h-screen bg-gallery px-4 py-8 lg:py-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-12 flex items-center justify-between border-b border-black/10 pb-8">
          <Link href="/" aria-label="Gallery home" className="font-heading text-3xl font-bold tracking-tight">
            THE GALLERY<span className="text-oxblood">.</span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-widest text-graphite flex items-center gap-2">
            <span className="h-2 w-2 bg-black rounded-full inline-block animate-pulse"></span>
            Secure checkout
          </span>
        </div>
        <CheckoutForm authenticated={Boolean(session)} />
      </div>
    </div>
  );
}
