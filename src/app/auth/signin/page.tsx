import SignInForm from '@/components/auth/SignInForm';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gallery flex flex-col items-center pt-16 px-4">
      <Link href="/" aria-label="Gallery home" className="mb-12 block font-heading text-4xl font-bold tracking-tight">
        THE GALLERY<span className="text-oxblood">.</span>
      </Link>
      <div className="w-[400px] max-w-full border border-black bg-white shadow-flat p-8 md:p-12 mb-8">
        <h1 className="font-heading text-3xl font-bold mb-8 text-center">Sign In</h1>
        <SignInForm />
        <p className="text-[10px] font-bold uppercase tracking-widest text-graphite mt-8 text-center leading-relaxed">
          By continuing, you agree to The Gallery's <Link href="/help#conditions" className="text-black hover:text-oxblood hover:underline transition-colors">Conditions of Use</Link> and <Link href="/help#privacy" className="text-black hover:text-oxblood hover:underline transition-colors">Privacy Notice</Link>.
        </p>
      </div>
      
      <div className="w-[400px] max-w-full flex flex-col gap-6 mt-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-black/10"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-graphite">New to The Gallery?</span>
          <div className="flex-1 border-t border-black/10"></div>
        </div>
        
        <Link href="/auth/register" className="w-full flex items-center justify-center border border-black text-black bg-transparent hover:bg-concrete/20 transition-colors py-4 font-bold text-sm">
          Create an Account
        </Link>
      </div>
    </div>
  );
}
