'use client';

import { usePathname } from 'next/navigation';

export default function SiteChrome({ header, children, footer }: { header: React.ReactNode; children: React.ReactNode; footer: React.ReactNode }) {
  const isCheckout = usePathname() === '/checkout';

  return (
    <>
      {!isCheckout && header}
      <main className="flex flex-1 flex-col">{children}</main>
      {!isCheckout && footer}
    </>
  );
}
