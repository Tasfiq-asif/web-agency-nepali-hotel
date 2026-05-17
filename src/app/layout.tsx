import type { Metadata } from 'next';
import { Cormorant, Jost, DM_Mono } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/animations/SmoothScroll';
import { MotionProvider } from '@/components/animations/MotionProvider';
import { Preloader } from '@/components/animations/Preloader';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const cormorant = Cormorant({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const jost = Jost({
  variable: '--font-jost',
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
      className={`${cormorant.variable} ${jost.variable} ${dmMono.variable}`}
    >
      <body>
        <Preloader />
        <Navbar />
        <SmoothScroll>
          <MotionProvider>
            {children}
            <Footer />
          </MotionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
