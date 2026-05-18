import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'Mountain Nest Hotel was born from a simple belief: that the mountains deserve to be experienced slowly. Learn about our philosophy, team, and commitment to sustainable hospitality.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
