'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requestedCallback = searchParams.get('callbackUrl') || '/';
      const callbackUrl = requestedCallback.startsWith('/') ? requestedCallback : '/';
      const res = await signIn('credentials', { redirect: false, email: email.trim().toLowerCase(), password, callbackUrl });
      if (res?.error) {
        setError('Invalid email or password.');
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('We could not sign you in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      {error && (
        <div className="border border-oxblood bg-oxblood/5 p-4 text-sm font-bold text-oxblood">
          <p>{error}</p>
        </div>
      )}
      <div className="flex flex-col">
        <label className="text-[10px] font-bold uppercase tracking-widest text-black mb-2">Email Address</label>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-black/20 px-4 py-3 text-sm font-medium outline-none transition-all rounded-none focus:border-black focus:ring-1 focus:ring-black hover:border-black/50"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-[10px] font-bold uppercase tracking-widest text-black mb-2">Password</label>
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-black/20 px-4 py-3 text-sm font-medium outline-none transition-all rounded-none focus:border-black focus:ring-1 focus:ring-black hover:border-black/50"
        />
      </div>
      <Button 
        type="submit" 
        disabled={loading}
        size="lg"
        className="mt-4"
      >
        {loading ? 'Authenticating...' : 'Sign In'}
      </Button>
    </form>
  );
}
