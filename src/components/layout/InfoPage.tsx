import Link from 'next/link';

export default function InfoPage({ title, body, links = [] }: { title: string; body: string; links?: { label: string; href: string }[] }) {
  return (
    <div className="min-h-screen bg-[#eaeded] px-4 py-8">
      <div className="mx-auto max-w-4xl rounded-[4px] border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-medium text-[#0f1111]">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-700">{body}</p>
        {links.length > 0 && <div className="mt-7 grid gap-3 sm:grid-cols-2">{links.map((link) => <Link key={link.href} href={link.href} className="rounded border border-gray-300 p-4 text-sm text-[#007185] hover:border-[#e77600] hover:text-[#c7511f]">{link.label}</Link>)}</div>}
      </div>
    </div>
  );
}
