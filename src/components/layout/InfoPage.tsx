import Link from 'next/link';

export default function InfoPage({ title, body, links = [] }: { title: string; body: string; links?: { label: string; href: string }[] }) {
  return (
    <div className="min-h-screen bg-gallery px-4 py-8 lg:py-16 border-t border-black/10">
      <div className="mx-auto max-w-[800px]">
        <div className="border border-black bg-white p-8 md:p-16 shadow-flat">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-black mb-8">{title}</h1>
          <p className="text-sm font-medium leading-relaxed text-graphite mb-12 max-w-xl">{body}</p>
          
          {links.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 border-t border-black/10 pt-8">
              {links.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="group flex items-center justify-between border border-black/10 bg-concrete/20 p-6 transition-colors hover:border-black"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black group-hover:text-graphite transition-colors">{link.label}</span>
                  <span className="text-black group-hover:text-graphite transition-colors">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
