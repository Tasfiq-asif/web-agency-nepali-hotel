import { getPageSeo } from '@/lib/getSeo';

export async function generateMetadata() {
  return getPageSeo('activities', {
    title: 'Activities & Nature',
    description:
      'Guided treks, birdwatching, cultural village walks, and star-gazing from Mountain Nest Hotel — curated experiences in the Solukhumbu District, Nepal.',
  });
}

export default function ActivitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
