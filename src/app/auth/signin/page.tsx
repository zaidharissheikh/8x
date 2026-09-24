import SignInForm from '@/components/auth/SignInForm';
import Link from 'next/link';
import Image from 'next/image';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8">
      <Link href="/" aria-label="Amazon home" className="mb-6 block">
        <Image src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" width={120} height={36} className="h-9 w-auto" unoptimized />
      </Link>
      <div className="w-[350px] border border-gray-300 rounded-sm p-6 mb-4">
        <h1 className="text-3xl font-normal mb-4">Sign-In</h1>
        <SignInForm />
        <p className="text-xs mt-4">
          By continuing, you agree to AmazonClone&apos;s <Link href="/help#conditions" className="text-[#007185] hover:underline hover:text-[#C7511F]">Conditions of Use</Link> and <Link href="/help#privacy" className="text-[#007185] hover:underline hover:text-[#C7511F]">Privacy Notice</Link>.
        </p>
      </div>
      
      <div className="w-[350px] flex items-center mb-4 mt-2">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-2 text-xs text-gray-500">New to AmazonClone?</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      
      <Link href="/auth/register" className="w-[350px] text-center border border-gray-400 rounded-md py-1.5 shadow-sm bg-gray-50 hover:bg-gray-100 text-sm">
        Create your AmazonClone account
      </Link>
    </div>
  );
}
