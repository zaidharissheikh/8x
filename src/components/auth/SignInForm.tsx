'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

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
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      {error && (
        <div className="text-[#C40000] text-sm border border-[#C40000] p-2 rounded-sm bg-red-50">
          <span className="font-bold">There was a problem</span>
          <p>{error}</p>
        </div>
      )}
      <div className="flex flex-col">
        <label className="text-sm font-bold mb-1">Email</label>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-400 rounded-sm px-3 py-1 outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-bold mb-1">Password</label>
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-400 rounded-sm px-3 py-1 outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]"
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-md py-1.5 text-sm shadow-sm mt-2 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
