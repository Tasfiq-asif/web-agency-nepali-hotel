import { getPageSeo } from '@/lib/getSeo';

export async function generateMetadata() {
  return getPageSeo('dining', {
    title: 'Dining & Cuisine',
    description:
      'Farm-to-table Nepali cuisine at Mountain Nest Hotel — sunrise breakfasts, traditional dal bhat, and evening feasts prepared with ingredients from the valley.',
  });
}

export default function DiningLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
