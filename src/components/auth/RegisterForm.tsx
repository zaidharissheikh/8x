'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      {error && <div className="border border-[#c40000] bg-red-50 p-2 text-sm text-[#c40000]"><span className="font-bold">There was a problem</span><p>{error}</p></div>}
      <label className="flex flex-col text-sm font-bold">Your name<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 rounded-sm border border-gray-400 px-3 py-1 font-normal outline-none focus:border-[#e77600]" placeholder="First and last name" /></label>
      <label className="flex flex-col text-sm font-bold">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 rounded-sm border border-gray-400 px-3 py-1 font-normal outline-none focus:border-[#e77600]" /></label>
      <label className="flex flex-col text-sm font-bold">Password<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" className="mt-1 rounded-sm border border-gray-400 px-3 py-1 font-normal outline-none focus:border-[#e77600]" /></label>
      <label className="flex flex-col text-sm font-bold">Re-enter password<input required minLength={6} type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-1 rounded-sm border border-gray-400 px-3 py-1 font-normal outline-none focus:border-[#e77600]" /></label>
      <button type="submit" disabled={loading} className="w-full rounded-md border border-[#fcd200] bg-[#ffd814] py-1.5 text-sm shadow-sm hover:bg-[#f7ca00] disabled:opacity-50">{loading ? 'Creating account...' : 'Create your account'}</button>
    </form>
  );
}
