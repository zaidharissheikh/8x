import Link from 'next/link';
import Image from 'next/image';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white px-4 pb-12 pt-8">
      <div className="mx-auto w-full max-w-[350px]">
        <Link href="/" aria-label="Amazon home" className="mb-6 flex justify-center">
          <Image src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" width={120} height={36} className="h-9 w-auto" unoptimized />
        </Link>
        <div className="rounded-sm border border-gray-300 p-6">
          <h1 className="mb-4 text-3xl font-normal">Create account</h1>
          <RegisterForm />
          <p className="mt-4 text-xs">By creating an account, you agree to AmazonClone&apos;s <Link href="/help#conditions" className="text-[#007185] hover:underline">Conditions of Use</Link> and <Link href="/help#privacy" className="text-[#007185] hover:underline">Privacy Notice</Link>.</p>
          <div className="mt-6 border-t border-gray-200 pt-4 text-sm">Already have an account? <Link href="/auth/signin" className="text-[#007185] hover:underline">Sign in</Link></div>
        </div>
      </div>
    </div>
  );
}
