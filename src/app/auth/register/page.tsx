import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gallery px-4 pb-12 pt-16">
      <div className="mx-auto w-full max-w-[400px]">
        <Link href="/" aria-label="Gallery home" className="mb-12 flex justify-center font-heading text-4xl font-bold tracking-tight">
          THE GALLERY<span className="text-oxblood">.</span>
        </Link>
        <div className="border border-black bg-white shadow-flat p-8 md:p-12">
          <h1 className="mb-8 text-center font-heading text-3xl font-bold">Create Account</h1>
          <RegisterForm />
          <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-graphite leading-relaxed">
            By creating an account, you agree to The Gallery's <Link href="/help#conditions" className="text-black hover:text-oxblood hover:underline transition-colors">Conditions of Use</Link> and <Link href="/help#privacy" className="text-black hover:text-oxblood hover:underline transition-colors">Privacy Notice</Link>.
          </p>
          <div className="mt-8 border-t border-black/10 pt-6 text-center text-[10px] font-bold uppercase tracking-widest">
            <span className="text-graphite mr-2">Already have an account?</span> 
            <Link href="/auth/signin" className="text-black hover:text-oxblood hover:underline transition-colors">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
