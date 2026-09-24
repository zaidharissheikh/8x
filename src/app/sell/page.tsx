import InfoPage from '@/components/layout/InfoPage';

export default function SellPage() {
  return <InfoPage title="Sell on AmazonClone" body="Seller tools are being prepared. Browse the catalog while the seller experience is built out." links={[{ label: 'Browse products', href: '/s' }, { label: 'Customer service', href: '/help' }]} />;
}
