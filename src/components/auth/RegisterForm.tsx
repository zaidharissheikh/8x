'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (password !== confirmation) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) {
      setError(result.error || 'We could not create your account.');
      setLoading(false);
      return;
    }
    router.push('/auth/signin?created=1');
  }

  const inputClasses = "mt-2 w-full border border-black/20 px-4 py-3 text-sm font-medium normal-case tracking-normal outline-none transition-all rounded-none focus:border-black focus:ring-1 focus:ring-black hover:border-black/50";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      {error && <div className="border border-oxblood bg-oxblood/5 p-4 text-sm font-bold text-oxblood"><p>{error}</p></div>}
      
      <label className="flex flex-col text-[10px] font-bold uppercase tracking-widest text-black">
        Your Name
        <input required value={name} onChange={(event) => setName(event.target.value)} className={inputClasses} placeholder="First and last name" />
      </label>
      
      <label className="flex flex-col text-[10px] font-bold uppercase tracking-widest text-black">
        Email Address
        <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClasses} />
      </label>
      
      <label className="flex flex-col text-[10px] font-bold uppercase tracking-widest text-black">
        Password
        <input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" className={inputClasses} />
      </label>
      
      <label className="flex flex-col text-[10px] font-bold uppercase tracking-widest text-black">
        Re-enter Password
        <input required minLength={6} type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className={inputClasses} />
      </label>
      
      <Button type="submit" size="lg" disabled={loading} className="mt-4">
        {loading ? 'Processing...' : 'Create Account'}
      </Button>
    </form>
  );
}
