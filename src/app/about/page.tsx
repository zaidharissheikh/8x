import InfoPage from '@/components/layout/InfoPage';

export default function AboutPage() {
  return <InfoPage title="About AmazonClone" body="AmazonClone is a storefront experience built for this project, with a responsive Amazon inspired home page, product catalog, cart, and account flows." links={[{ label: 'Shop the catalog', href: '/s' }, { label: 'See today\'s deals', href: '/s?deal=1' }]} />;
}
