import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white flex flex-col mt-24">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-12 py-20 px-6 lg:px-12">
        <div className="flex flex-col space-y-6 md:col-span-1">
          <Link href="/" className="font-heading text-2xl font-black tracking-tight text-white">
            GALLERY
          </Link>
          <p className="text-graphite text-sm max-w-xs leading-relaxed">
            The new standard for premium e-commerce. Curated collections, engineered experience.
          </p>
        </div>
        
        <div className="flex flex-col space-y-4">
          <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-concrete mb-2">Explore</h3>
          <Link href="/s?category=womens-fashion" className="text-sm font-medium text-graphite hover:text-white transition-colors">Women's Fashion</Link>
          <Link href="/s?category=mens-fashion" className="text-sm font-medium text-graphite hover:text-white transition-colors">Men's Fashion</Link>
          <Link href="/s?category=beauty" className="text-sm font-medium text-graphite hover:text-white transition-colors">Beauty & Cosmetics</Link>
          <Link href="/s?category=home-kitchen" className="text-sm font-medium text-graphite hover:text-white transition-colors">Home & Living</Link>
        </div>
        
        <div className="flex flex-col space-y-4">
          <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-concrete mb-2">Support</h3>
          <Link href="/account" className="text-sm font-medium text-graphite hover:text-white transition-colors">Your Account</Link>
          <Link href="/orders" className="text-sm font-medium text-graphite hover:text-white transition-colors">Order Status</Link>
          <Link href="/help#returns" className="text-sm font-medium text-graphite hover:text-white transition-colors">Returns & Exchanges</Link>
          <Link href="/help" className="text-sm font-medium text-graphite hover:text-white transition-colors">Help Center</Link>
        </div>
        
        <div className="flex flex-col space-y-4">
          <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-concrete mb-2">Legal</h3>
          <Link href="/help#conditions" className="text-sm font-medium text-graphite hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/help#privacy" className="text-sm font-medium text-graphite hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/help#privacy" className="text-sm font-medium text-graphite hover:text-white transition-colors">Cookie Policy</Link>
        </div>
      </div>

      <div className="border-t border-white/10 py-8 px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between">
        <span className="text-xs text-graphite">© {new Date().getFullYear()} THE GALLERY. All rights reserved.</span>
        <div className="flex space-x-6 mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-graphite">
          <a href="#top" className="hover:text-white transition-colors">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
