'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart';

type CheckoutStep = 1 | 2 | 3;
type Address = { fullName: string; line1: string; city: string; state: string; postalCode: string };
type CardBrand = 'Visa' | 'Mastercard' | 'American Express' | 'Discover' | 'Card';
type PaymentErrors = { card: string; expiry: string; cvv: string };

const emptyAddress: Address = { fullName: '', line1: '', city: '', state: '', postalCode: '' };

export default function CheckoutForm({ authenticated }: { authenticated: boolean }) {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>(1);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [addressModalOpen, setAddressModalOpen] = useState(true);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentTouched, setPaymentTouched] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const subtotal = getSubtotal();
  const cardBrand = getCardBrand(cardNumber);
  const paymentErrors = getPaymentErrors(cardNumber, expiry, cvv, cardBrand);

  if (items.length === 0) return <div className="rounded border border-gray-300 bg-white p-8"><p>Your cart is empty.</p><Link href="/" className="mt-3 inline-block text-sm text-[#007185] hover:underline">Continue shopping</Link></div>;
  if (!authenticated) return <div className="rounded border border-gray-300 bg-white p-6"><h2 className="text-xl font-bold">Sign in to continue</h2><p className="mt-2 text-sm text-gray-600">Your cart is saved while you sign in.</p><Link href="/auth/signin?callbackUrl=/checkout" className="mt-5 inline-block rounded-full bg-[#ffd814] px-6 py-2 text-sm font-bold hover:bg-[#f7ca00]">Sign in</Link></div>;

  function saveAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setAddressModalOpen(false);
    setStep(2);
  }

  function continueToReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPaymentTouched(true);
    const message = firstPaymentError(paymentErrors);
    if (message) {
      setError(message);
      return;
    }
    setError('');
    setStep(3);
  }

  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = firstPaymentError(paymentErrors);
    if (message) {
      setPaymentTouched(true);
      setError(message);
      setStep(2);
      return;
    }
    setError('');
    setLoading(true);
    const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: items.map((item) => ({ productId: item.productId || item.id, quantity: item.quantity, title: item.title })), address, paymentLast4: cardNumber.replace(/\D/g, '').slice(-4) }) });
    const result = await response.json() as { error?: string; orderId?: string };
    if (!response.ok || !result.orderId) { setError(result.error || 'We could not place your order.'); setLoading(false); return; }
    clearCart();
    router.push(`/orders?placed=${result.orderId}`);
  }

  function updateCard(value: string) {
    setCardNumber(formatCardNumber(value));
    setError('');
  }

  function updateExpiry(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
    setError('');
  }

  return (
    <div className="relative">
      <h1 className="mb-5 text-3xl font-normal text-[#111]">Checkout</h1>
      <div className="mb-6 grid grid-cols-3 rounded border border-gray-300 bg-white text-center text-xs sm:text-sm"><StepLabel number="1" label="Delivery address" active={step === 1} complete={step > 1} /><StepLabel number="2" label="Payment method" active={step === 2} complete={step > 2} /><StepLabel number="3" label="Review items" active={step === 3} complete={false} /></div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="space-y-5">
          {error && <div className="checkout-panel rounded border border-[#c40000] bg-red-50 p-3 text-sm text-[#c40000]">{error}</div>}

          <section className={`checkout-panel rounded border bg-white p-5 ${step === 1 ? 'border-[#c45500]' : 'border-gray-300'}`}>
            <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold">1. Delivery address</h2>{address.line1 ? <p className="mt-3 text-sm leading-6 text-gray-700"><b>{address.fullName}</b><br />{address.line1}<br />{address.city}, {address.state} {address.postalCode}</p> : <p className="mt-3 text-sm text-gray-600">Add an address for delivery.</p>}</div>{address.line1 && <button type="button" onClick={() => { setAddressModalOpen(true); setStep(1); }} className="text-sm text-[#007185] hover:underline">Change</button>}</div>
            {!address.line1 && <button type="button" onClick={() => setAddressModalOpen(true)} className="mt-4 rounded border border-gray-400 bg-gray-50 px-4 py-2 text-sm hover:bg-gray-100">Add a new address</button>}
          </section>

          <section className={`checkout-panel rounded border bg-white p-5 ${step === 2 ? 'border-[#c45500]' : 'border-gray-300'}`}>
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold">2. Payment method</h2>{step !== 2 && cardNumber && <button type="button" onClick={() => { setStep(2); setError(''); }} className="text-sm text-[#007185] hover:underline">Change</button>}</div>
            {step === 2 ? <form onSubmit={continueToReview} noValidate className="mt-4 max-w-xl">
              <label className="flex items-center gap-2 text-sm font-bold"><input type="radio" checked readOnly /> Credit or debit card</label>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-bold sm:col-span-2"><span className="flex items-center justify-between"><span>Card number</span><CardBrandBadge brand={cardBrand} /></span><input required value={cardNumber} onChange={(event) => updateCard(event.target.value)} onBlur={() => setPaymentTouched(true)} inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" aria-invalid={paymentTouched && Boolean(paymentErrors.card)} className={inputClass(paymentTouched && Boolean(paymentErrors.card))} />{paymentTouched && paymentErrors.card && <span className="mt-1 block text-xs font-normal text-[#c40000]">{paymentErrors.card}</span>}</label>
                <label className="text-sm font-bold"><span>Expiry date</span><input required value={expiry} onChange={(event) => updateExpiry(event.target.value)} onBlur={() => setPaymentTouched(true)} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" aria-invalid={paymentTouched && Boolean(paymentErrors.expiry)} className={inputClass(paymentTouched && Boolean(paymentErrors.expiry))} />{paymentTouched && paymentErrors.expiry && <span className="mt-1 block text-xs font-normal text-[#c40000]">{paymentErrors.expiry}</span>}</label>
                <label className="text-sm font-bold"><span>Security code</span><input required value={cvv} onChange={(event) => { setCvv(event.target.value.replace(/\D/g, '').slice(0, cardBrand === 'American Express' ? 4 : 3)); setError(''); }} onBlur={() => setPaymentTouched(true)} inputMode="numeric" autoComplete="cc-csc" placeholder={cardBrand === 'American Express' ? '1234' : '123'} aria-invalid={paymentTouched && Boolean(paymentErrors.cvv)} className={inputClass(paymentTouched && Boolean(paymentErrors.cvv))} />{paymentTouched && paymentErrors.cvv && <span className="mt-1 block text-xs font-normal text-[#c40000]">{paymentErrors.cvv}</span>}</label>
              </div>
              <button type="submit" className="mt-5 rounded-full bg-[#ffd814] px-6 py-2 text-sm font-bold hover:bg-[#f7ca00]">Use this payment method</button><p className="mt-3 text-xs text-gray-600">Mock payment accepts valid Visa, Mastercard, American Express, or Discover test numbers.</p>
            </form> : <p className="mt-3 text-sm text-gray-700">{cardNumber ? `${cardBrand} ending in ${cardNumber.replace(/\D/g, '').slice(-4)}` : 'Complete this step to choose a payment method.'}</p>}
          </section>

          <section className={`checkout-panel rounded border bg-white p-5 ${step === 3 ? 'border-[#c45500]' : 'border-gray-300'}`}>
            <h2 className="text-xl font-bold">3. Review items and shipping</h2>
            {step === 3 ? <form onSubmit={placeOrder} className="mt-4"><div className="rounded border border-gray-200 bg-gray-50 p-4 text-sm leading-6"><b>Deliver to:</b><br />{address.fullName}, {address.line1}, {address.city}, {address.state} {address.postalCode}<br /><span className="text-[#007600]">FREE delivery</span><br /><span>{cardBrand} ending in {cardNumber.replace(/\D/g, '').slice(-4)}</span></div><div className="mt-4 divide-y divide-gray-200">{items.map((item) => <div key={item.id} className="flex gap-4 py-4"><div className="relative h-20 w-20 shrink-0"><Image src={item.image} alt={item.title} fill className="object-contain" unoptimized /></div><div className="min-w-0 text-sm"><Link href={`/product/${item.slug}`} className="font-medium text-[#007185] hover:underline">{item.title}</Link><p className="mt-1">Quantity: {item.quantity}</p><p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p></div></div>)}</div><button type="submit" disabled={loading} className="mt-5 rounded-full bg-[#ffd814] px-8 py-2 text-sm font-bold hover:bg-[#f7ca00] disabled:opacity-50">{loading ? 'Placing order...' : 'Place your order'}</button></form> : <p className="mt-3 text-sm text-gray-700">Review your items and shipping details before placing the order.</p>}
          </section>
        </main>

        <aside className="checkout-panel h-max rounded border border-gray-300 bg-white p-5"><h2 className="text-xl font-bold">Order summary</h2><div className="mt-5 flex justify-between text-sm"><span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span><span>${subtotal.toFixed(2)}</span></div><div className="mt-3 flex justify-between text-sm"><span>Shipping</span><span>$0.00</span></div><div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-bold text-[#b12704]"><span>Order total</span><span>${subtotal.toFixed(2)}</span></div>{step < 3 && <p className="mt-4 text-xs text-gray-600">Your order will be placed after you review the items and shipping details.</p>}</aside>
      </div>

      {addressModalOpen && <div className="checkout-modal fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="address-modal-title"><form onSubmit={saveAddress} className="max-h-full w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-gray-300 bg-gray-100 px-6 py-4"><h2 id="address-modal-title" className="text-xl font-bold">Add a new address</h2><button type="button" onClick={() => setAddressModalOpen(false)} className="text-2xl text-gray-600" aria-label="Close address form">×</button></div><div className="space-y-4 p-6"><Field label="Full name" value={address.fullName} onChange={(value) => setAddress({ ...address, fullName: value })} required /><Field label="Address" value={address.line1} onChange={(value) => setAddress({ ...address, line1: value })} required /><div className="grid gap-4 sm:grid-cols-2"><Field label="City" value={address.city} onChange={(value) => setAddress({ ...address, city: value })} required /><Field label="State" value={address.state} onChange={(value) => setAddress({ ...address, state: value })} required /></div><Field label="ZIP code" value={address.postalCode} onChange={(value) => setAddress({ ...address, postalCode: value })} required /></div><div className="flex justify-end gap-3 border-t border-gray-300 px-6 py-4"><button type="button" onClick={() => setAddressModalOpen(false)} className="rounded border border-gray-400 px-5 py-2 text-sm hover:bg-gray-100">Cancel</button><button type="submit" className="rounded-full bg-[#ffd814] px-6 py-2 text-sm font-bold hover:bg-[#f7ca00]">Use this address</button></div></form></div>}
    </div>
  );
}

function CardBrandBadge({ brand }: { brand: CardBrand }) {
  return <span className="rounded border border-gray-300 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-600">{brand === 'Card' ? 'CARD' : brand.toUpperCase()}</span>;
}

function inputClass(invalid: boolean) {
  return `mt-1 w-full rounded border px-3 py-2 font-normal outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] ${invalid ? 'border-[#c40000] bg-red-50' : 'border-gray-400'}`;
}

function getCardBrand(value: string): CardBrand {
  const digits = value.replace(/\D/g, '');
  if (/^4/.test(digits)) return 'Visa';
  if (/^(5[1-5]|2(?:2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'American Express';
  if (/^(6011|65|64[4-9])/.test(digits)) return 'Discover';
  return 'Card';
}

function getPaymentErrors(card: string, expiry: string, cvv: string, brand: CardBrand): PaymentErrors {
  const digits = card.replace(/\D/g, '');
  const cardLength = brand === 'American Express' ? 15 : 16;
  const errors: PaymentErrors = { card: '', expiry: '', cvv: '' };
  if (!digits) errors.card = 'Enter a card number.';
  else if (digits.length !== cardLength || !passesLuhn(digits)) errors.card = `Enter a valid ${brand === 'Card' ? '16-digit card' : brand} number.`;
  const [monthText, yearText] = expiry.split('/');
  const month = Number(monthText);
  const year = Number(yearText);
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  if (!/^\d{2}\/\d{2}$/.test(expiry) || month < 1 || month > 12 || year < currentYear || (year === currentYear && month < now.getMonth() + 1)) errors.expiry = 'Enter a valid future expiry date.';
  const cvvLength = brand === 'American Express' ? 4 : 3;
  if (!new RegExp(`^\\d{${cvvLength}}$`).test(cvv)) errors.cvv = `Enter a ${cvvLength}-digit security code.`;
  return errors;
}

function firstPaymentError(errors: PaymentErrors) {
  return errors.card || errors.expiry || errors.cvv;
}

function passesLuhn(value: string) {
  let sum = 0;
  let alternate = false;
  for (let index = value.length - 1; index >= 0; index -= 1) {
    let digit = Number(value[index]);
    if (alternate) { digit *= 2; if (digit > 9) digit -= 9; }
    sum += digit;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 19);
  return digits.match(/.{1,4}/g)?.join(' ') || '';
}

function StepLabel({ number, label, active, complete }: { number: string; label: string; active: boolean; complete: boolean }) {
  return <div className={`border-b-2 px-2 py-3 font-medium transition-colors ${active ? 'border-[#c45500] text-[#c45500]' : complete ? 'border-[#007600] text-[#007600]' : 'border-transparent text-gray-500'}`}><span className="mr-1 font-bold">{complete ? '✓' : number}.</span>{label}</div>;
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="block text-sm font-bold">{label}<input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded border border-gray-400 px-3 py-2 font-normal outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]" /></label>;
}
