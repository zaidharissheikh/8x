import InfoPage from '@/components/layout/InfoPage';

export default function HelpPage() {
  return <InfoPage title="Customer Service" body="Find help with orders, returns, account settings, and shopping on AmazonClone." links={[{ label: 'Your orders', href: '/orders' }, { label: 'Your account', href: '/account' }, { label: 'Start a search', href: '/s' }]} />;
}
