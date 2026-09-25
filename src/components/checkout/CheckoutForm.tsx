'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart';
import { Button, Price } from '@/components/ui';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !authenticated || items.length === 0) return;

    gsap.fromTo(
      '.checkout-step-anim',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', clearProps: 'all' }
    );
  }, { scope: containerRef });

  if (items.length === 0) return (
    <div className="rounded-none border border-black/10 bg-white p-12 text-center shadow-flat max-w-2xl mx-auto mt-12">
      <h2 className="font-heading text-2xl font-bold mb-4">Your bag is empty</h2>
      <Link href="/">
        <Button variant="outline" className="border-black text-black">Return to Gallery</Button>
      </Link>
    </div>
  );
  
  if (!authenticated) return (
    <div className="rounded-none border border-black/10 bg-white p-12 text-center shadow-flat max-w-2xl mx-auto mt-12">
      <h2 className="font-heading text-3xl font-bold mb-4">Authentication Required</h2>
      <p className="text-sm text-graphite mb-8 max-w-md mx-auto">Please sign in to securely process your order. Your selections have been saved.</p>
      <Link href="/auth/signin?callbackUrl=/checkout">
        <Button size="lg" className="w-full sm:w-auto px-12">Sign In</Button>
      </Link>
    </div>
  );

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
    <div ref={containerRef} className="relative">
      <h1 className="checkout-step-anim mb-10 font-heading text-4xl md:text-5xl font-medium tracking-tight">Secure Checkout</h1>
      
      <div className="checkout-step-anim mb-12 grid grid-cols-3 border border-black/10 bg-white shadow-flat text-center">
        <StepLabel number="01" label="Delivery" active={step === 1} complete={step > 1} />
        <StepLabel number="02" label="Payment" active={step === 2} complete={step > 2} />
        <StepLabel number="03" label="Review" active={step === 3} complete={false} />
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px] items-start">
        <main className="space-y-8">
          {error && <div className="border border-oxblood bg-oxblood/5 p-4 text-sm font-bold text-oxblood">{error}</div>}

          <section className={cn("checkout-step-anim border bg-white p-8 transition-colors", step === 1 ? "border-black shadow-flat" : "border-black/10 opacity-70")}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold mb-4">1. Delivery Address</h2>
                {address.line1 ? (
                  <p className="text-sm leading-relaxed text-black/80">
                    <b className="text-black">{address.fullName}</b><br />
                    {address.line1}<br />
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                ) : (
                  <p className="text-sm text-graphite font-bold uppercase tracking-widest">No address selected</p>
                )}
              </div>
              {address.line1 && (
                <button type="button" onClick={() => { setAddressModalOpen(true); setStep(1); }} className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:text-graphite hover:border-graphite transition-colors">
                  Edit
                </button>
              )}
            </div>
            {!address.line1 && (
              <Button type="button" onClick={() => setAddressModalOpen(true)} className="mt-6">Add Address</Button>
            )}
          </section>

          <section className={cn("checkout-step-anim border bg-white p-8 transition-colors", step === 2 ? "border-black shadow-flat" : "border-black/10 opacity-70")}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold">2. Payment Method</h2>
              {step !== 2 && cardNumber && (
                <button type="button" onClick={() => { setStep(2); setError(''); }} className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:text-graphite hover:border-graphite transition-colors">
                  Edit
                </button>
              )}
            </div>
            
            {step === 2 ? (
              <form onSubmit={continueToReview} noValidate className="max-w-xl">
                <label className="flex items-center gap-3 text-sm font-bold mb-8 cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input type="radio" checked readOnly className="peer h-4 w-4 appearance-none rounded-full border border-black/30 bg-transparent checked:border-4 checked:border-black focus:outline-none transition-all" />
                  </div>
                  Credit or Debit Card
                </label>
                
                <div className="grid gap-6 sm:grid-cols-2 mb-8">
                  <label className="text-[10px] font-bold uppercase tracking-widest sm:col-span-2 block">
                    <span className="flex items-center justify-between mb-2">
                      <span>Card Number</span>
                      <CardBrandBadge brand={cardBrand} />
                    </span>
                    <input required value={cardNumber} onChange={(event) => updateCard(event.target.value)} onBlur={() => setPaymentTouched(true)} inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" aria-invalid={paymentTouched && Boolean(paymentErrors.card)} className={inputClass(paymentTouched && Boolean(paymentErrors.card))} />
                    {paymentTouched && paymentErrors.card && <span className="mt-2 block text-oxblood normal-case tracking-normal">{paymentErrors.card}</span>}
                  </label>
                  <label className="text-[10px] font-bold uppercase tracking-widest block">
                    <span className="mb-2 block">Expiry Date</span>
                    <input required value={expiry} onChange={(event) => updateExpiry(event.target.value)} onBlur={() => setPaymentTouched(true)} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" aria-invalid={paymentTouched && Boolean(paymentErrors.expiry)} className={inputClass(paymentTouched && Boolean(paymentErrors.expiry))} />
                    {paymentTouched && paymentErrors.expiry && <span className="mt-2 block text-oxblood normal-case tracking-normal">{paymentErrors.expiry}</span>}
                  </label>
                  <label className="text-[10px] font-bold uppercase tracking-widest block">
                    <span className="mb-2 block">Security Code</span>
                    <input required value={cvv} onChange={(event) => { setCvv(event.target.value.replace(/\D/g, '').slice(0, cardBrand === 'American Express' ? 4 : 3)); setError(''); }} onBlur={() => setPaymentTouched(true)} inputMode="numeric" autoComplete="cc-csc" placeholder={cardBrand === 'American Express' ? '1234' : '123'} aria-invalid={paymentTouched && Boolean(paymentErrors.cvv)} className={inputClass(paymentTouched && Boolean(paymentErrors.cvv))} />
                    {paymentTouched && paymentErrors.cvv && <span className="mt-2 block text-oxblood normal-case tracking-normal">{paymentErrors.cvv}</span>}
                  </label>
                </div>
                
                <Button type="submit">Use this payment method</Button>
                <p className="mt-6 text-xs text-graphite">Mock payment accepts valid Visa, Mastercard, American Express, or Discover test numbers.</p>
              </form>
            ) : (
              <p className="text-sm font-bold tracking-widest uppercase text-graphite">
                {cardNumber ? `${cardBrand} ending in ${cardNumber.replace(/\D/g, '').slice(-4)}` : 'Pending'}
              </p>
            )}
          </section>

          <section className={cn("checkout-step-anim border bg-white p-8 transition-colors", step === 3 ? "border-black shadow-flat" : "border-black/10 opacity-70")}>
            <h2 className="font-heading text-2xl font-bold mb-6">3. Review & Submit</h2>
            {step === 3 ? (
              <form onSubmit={placeOrder}>
                <div className="border border-black/10 bg-concrete/20 p-6 text-sm leading-relaxed mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-graphite block mb-2">Deliver To</span>
                  <b>{address.fullName}</b><br />
                  {address.line1}, {address.city}, {address.state} {address.postalCode}<br />
                  <span className="text-black font-bold mt-2 block">FREE delivery applied</span>
                  <span className="text-graphite block mt-1">{cardBrand} ending in {cardNumber.replace(/\D/g, '').slice(-4)}</span>
                </div>
                
                <div className="divide-y divide-black/10 border-t border-black/10">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-6 py-6">
                      <div className="relative h-24 w-24 shrink-0 bg-concrete/20 border border-black/5">
                        <Image src={item.image} alt={item.title} fill className="object-cover mix-blend-multiply" unoptimized />
                      </div>
                      <div className="min-w-0 text-sm flex flex-col justify-center">
                        <Link href={`/product/${item.slug}`} className="font-medium text-black hover:text-graphite transition-colors mb-2 line-clamp-2">
                          {item.title}
                        </Link>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-graphite mb-2">Qty: {item.quantity}</p>
                        <p className="font-bold text-base">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button type="submit" size="lg" disabled={loading} className="mt-8 w-full sm:w-auto px-12 text-base">
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </form>
            ) : (
              <p className="text-sm font-bold tracking-widest uppercase text-graphite">Pending</p>
            )}
          </section>
        </main>

        <aside className="checkout-step-anim sticky top-8 border border-black bg-white shadow-flat p-8">
          <h2 className="font-heading text-2xl font-bold mb-8 pb-4 border-b border-black/10">Order Summary</h2>
          <div className="space-y-4 text-sm font-medium mb-6">
            <div className="flex justify-between">
              <span className="text-graphite">Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite">Shipping</span>
              <span>$0.00</span>
            </div>
          </div>
          <div className="flex justify-between items-end border-t border-black/10 pt-6">
            <span className="text-sm font-bold uppercase tracking-widest">Order Total</span>
            <Price amount={subtotal.toFixed(2)} className="text-3xl" />
          </div>
          {step < 3 && <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-graphite leading-relaxed">Proceed to the final step to submit your order.</p>}
        </aside>
      </div>

      {addressModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="address-modal-title">
          <form onSubmit={saveAddress} className="max-h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl border border-black">
            <div className="flex items-center justify-between border-b border-black/10 bg-concrete/20 px-8 py-6">
              <h2 id="address-modal-title" className="font-heading text-2xl font-bold">Add Delivery Address</h2>
              <button type="button" onClick={() => setAddressModalOpen(false)} className="text-3xl font-light hover:opacity-50 transition-opacity" aria-label="Close address form">×</button>
            </div>
            <div className="space-y-6 p-8">
              <Field label="Full name" value={address.fullName} onChange={(value) => setAddress({ ...address, fullName: value })} required />
              <Field label="Street Address" value={address.line1} onChange={(value) => setAddress({ ...address, line1: value })} required />
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="City" value={address.city} onChange={(value) => setAddress({ ...address, city: value })} required />
                <Field label="State / Province" value={address.state} onChange={(value) => setAddress({ ...address, state: value })} required />
              </div>
              <Field label="ZIP / Postal Code" value={address.postalCode} onChange={(value) => setAddress({ ...address, postalCode: value })} required />
            </div>
            <div className="flex justify-end gap-4 border-t border-black/10 bg-concrete/20 px-8 py-6">
              <Button type="button" variant="outline" onClick={() => setAddressModalOpen(false)} className="border-black text-black">Cancel</Button>
              <Button type="submit">Use this address</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function CardBrandBadge({ brand }: { brand: CardBrand }) {
  return <span className="border border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black bg-concrete/50">{brand === 'Card' ? 'CARD' : brand}</span>;
}

function inputClass(invalid: boolean) {
  return cn(
    "mt-2 w-full border px-4 py-3 text-sm font-medium outline-none transition-all rounded-none",
    invalid ? "border-oxblood bg-oxblood/5 focus:border-oxblood focus:ring-1 focus:ring-oxblood" : "border-black/20 focus:border-black focus:ring-1 focus:ring-black hover:border-black/50"
  );
}

// Validation helpers remain unchanged below this point
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
  return (
    <div className={cn(
      "border-b-4 px-4 py-6 transition-colors flex flex-col items-center justify-center",
      active ? "border-black bg-concrete/20 text-black" : complete ? "border-black text-black" : "border-transparent text-graphite bg-white"
    )}>
      <span className="font-heading text-2xl font-bold mb-1">{complete ? '✓' : number}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </div>
  );
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-widest text-black">
      <span className="mb-2 block">{label}</span>
      <input 
        required={required} 
        value={value} 
        onChange={(event) => onChange(event.target.value)} 
        className={cn(
          "w-full border border-black/20 px-4 py-3 text-sm font-medium normal-case tracking-normal outline-none transition-all rounded-none",
          "focus:border-black focus:ring-1 focus:ring-black hover:border-black/50"
        )} 
      />
    </label>
  );
}
