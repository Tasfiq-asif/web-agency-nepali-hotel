import { SmoothScroll } from '@/components/animations/SmoothScroll';
import { MotionProvider } from '@/components/animations/MotionProvider';
import { Preloader } from '@/components/animations/Preloader';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <Navbar />
      <SmoothScroll>
        <MotionProvider>
          {children}
          <Footer />
        </MotionProvider>
      </SmoothScroll>
    </>
  );
}
