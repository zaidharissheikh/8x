import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#232F3E] text-white flex flex-col text-sm mt-8">
      <div className="bg-[#37475A] hover:bg-[#485769] text-center py-4">
        <a href="#top" className="block text-sm">Back to top</a>
      </div>
      
      <div className="max-w-5xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-8 py-10 px-4">
        <div className="flex flex-col space-y-2">
          <h3 className="font-bold mb-1">Get to Know Us</h3>
          <Link href="/about" className="text-gray-300 hover:underline">About AmazonClone</Link>
          <Link href="/s?k=careers" className="text-gray-300 hover:underline">Careers</Link>
          <Link href="/s?k=press+releases" className="text-gray-300 hover:underline">Press Releases</Link>
          <Link href="/s?k=amazon+science" className="text-gray-300 hover:underline">Amazon Science</Link>
          <Link href="/s?k=investor+relations" className="text-gray-300 hover:underline">Investor Relations</Link>
          <Link href="/s?k=blog" className="text-gray-300 hover:underline">Blog</Link>
        </div>
        <div className="flex flex-col space-y-2">
          <h3 className="font-bold mb-1">Make Money with Us</h3>
          <Link href="/sell" className="text-gray-300 hover:underline">Sell products</Link>
          <Link href="/sell" className="text-gray-300 hover:underline">Sell on Amazon Business</Link>
          <Link href="/sell" className="text-gray-300 hover:underline">Sell apps</Link>
          <Link href="/sell" className="text-gray-300 hover:underline">Become an Affiliate</Link>
          <Link href="/sell" className="text-gray-300 hover:underline">Advertise Your Products</Link>
          <Link href="/sell" className="text-gray-300 hover:underline">Self-Publish with Us</Link>
        </div>
        <div className="flex flex-col space-y-2">
          <h3 className="font-bold mb-1">AmazonClone Payment Products</h3>
          <Link href="/s?k=credit+card" className="text-gray-300 hover:underline">Rewards Visa Signature Cards</Link>
          <Link href="/s?k=store+card" className="text-gray-300 hover:underline">AmazonClone Store Card</Link>
          <Link href="/s?k=credit+card" className="text-gray-300 hover:underline">Amazon Secured Card</Link>
          <Link href="/s?k=gift+cards" className="text-gray-300 hover:underline">Gift Cards</Link>
          <Link href="/s?k=currency+converter" className="text-gray-300 hover:underline">Currency Converter</Link>
        </div>
        <div className="flex flex-col space-y-2">
          <h3 className="font-bold mb-1">Let Us Help You</h3>
          <Link href="/account" className="text-gray-300 hover:underline">Your Account</Link>
          <Link href="/orders" className="text-gray-300 hover:underline">Your Orders</Link>
          <Link href="/help#shipping" className="text-gray-300 hover:underline">Shipping Rates &amp; Policies</Link>
          <Link href="/help#returns" className="text-gray-300 hover:underline">Returns &amp; Replacements</Link>
          <Link href="/help#assistant" className="text-gray-300 hover:underline">Amazon Assistant</Link>
          <Link href="/help" className="text-gray-300 hover:underline">Help</Link>
        </div>
      </div>

      <div className="bg-[#131921] py-8 flex flex-col items-center border-t border-gray-600">
        <Link href="/" aria-label="Amazon home" className="mb-5">
          <Image src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" width={92} height={30} className="h-7 w-auto brightness-0 invert" unoptimized />
        </Link>
        <div className="flex items-center space-x-6 text-xs text-gray-300 mb-2">
          <Link href="/help#conditions" className="hover:underline">Conditions of Use</Link>
          <Link href="/help#privacy" className="hover:underline">Privacy Notice</Link>
          <Link href="/help#privacy" className="hover:underline">Privacy Disclosure</Link>
        </div>
        <span className="text-xs text-gray-300">© 2026, Amazon assignment purpose clone</span>
      </div>
    </footer>
  );
}
