'use client';

import { useEffect } from 'react';
import { gsap } from '@/lib/gsap';

export function ContactReveal({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-header-line',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: 0.1 }
      );
      gsap.fromTo(
        '.contact-header-fade',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.5 }
      );

      gsap.fromTo(
        '.contact-reveal',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.contact-reveal',
            start: 'top 72%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return <>{children}</>;
}
