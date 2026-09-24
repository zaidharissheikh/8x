import Link from 'next/link';
import { auth } from '@/lib/auth';

export default async function AccountPage() {
  const session = await auth();
  return (
    <div className="min-h-screen bg-[#eaeded] px-4 py-8"><div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-medium">Your Account</h1>
      {session ? <p className="mt-2 text-sm text-gray-700">Signed in as {session.user?.name || session.user?.email}.</p> : <p className="mt-2 text-sm text-gray-700">Sign in to see your orders, addresses, and account details.</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {['Your Orders', 'Login & security', 'Your addresses', 'Payment options', 'Contact preferences', 'Help'].map((title) => <Link key={title} href={title === 'Your Orders' ? '/orders' : title === 'Help' ? '/help' : session ? '/account' : '/auth/signin'} className="rounded-[4px] border border-gray-200 bg-white p-5 shadow-sm hover:border-[#e77600]"><h2 className="font-bold">{title}</h2><p className="mt-2 text-sm text-gray-600">View and manage your {title.toLowerCase()}.</p></Link>)}
      </div>
    </div></div>
  );
}
