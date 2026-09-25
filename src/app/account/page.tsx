import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui';
import SignOutButton from '@/components/auth/SignOutButton';

export default async function AccountPage() {
  const session = await auth();
  return (
    <div className="min-h-screen bg-gallery px-4 py-8 lg:py-16 border-t border-black/10">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">Your Account</h1>
          {session && <SignOutButton />}
        </div>
        
        {session ? (
          <p className="text-sm font-bold uppercase tracking-widest text-graphite mb-12">
            Active session: <span className="text-black">{session.user?.name || session.user?.email}</span>
          </p>
        ) : (
          <div className="mb-12">
            <p className="text-sm text-graphite mb-6 leading-relaxed max-w-md">Sign in to manage your orders, saved items, addresses, and account details securely.</p>
            <Link href="/auth/signin?callbackUrl=/account">
              <Button>Sign In to Continue</Button>
            </Link>
          </div>
        )}
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Your Orders', desc: 'Track, return, or buy things again', href: '/orders' },
            { title: 'Login & Security', desc: 'Edit login, name, and mobile number', href: session ? '/account' : '/auth/signin' },
            { title: 'Your Addresses', desc: 'Edit addresses for orders and gifts', href: session ? '/account' : '/auth/signin' },
            { title: 'Payment Options', desc: 'Edit or add payment methods', href: session ? '/account' : '/auth/signin' },
            { title: 'Contact Preferences', desc: 'Manage your notifications', href: session ? '/account' : '/auth/signin' },
            { title: 'Help & Support', desc: 'Browse help topics or contact us', href: '/help' }
          ].map((item) => (
            <Link 
              key={item.title} 
              href={item.href} 
              className="group border border-black/10 bg-white p-8 shadow-flat transition-colors hover:border-black"
            >
              <h2 className="font-heading text-xl font-bold text-black mb-3 group-hover:text-oxblood transition-colors">{item.title}</h2>
              <p className="text-sm text-graphite font-medium leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
