import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans, DM_Mono } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/animations/SmoothScroll';
import { MotionProvider } from '@/components/animations/MotionProvider';
import { Preloader } from '@/components/animations/Preloader';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['opsz', 'SOFT', 'WONK'],
  weight: 'variable',
  style: ['normal', 'italic'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Mountain Nest Hotel — Your Himalayan Sanctuary',
    template: '%s | Mountain Nest Hotel',
  },
  description:
    'Experience the Himalayas from Mountain Nest Hotel — a boutique mountain lodge offering curated stays, local cuisine, and guided trekking in Nepal.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Mountain Nest Hotel',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} ${dmMono.variable}`}
    >
      <body>
        <Preloader />
        <SmoothScroll>
          <MotionProvider>{children}</MotionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
