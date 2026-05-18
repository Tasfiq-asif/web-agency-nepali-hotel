'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-line .split__text',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );

      gsap.fromTo(
        '.cta-fade',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.35,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section bg-accent"
      style={{ textAlign: 'center' }}
    >
      <div className="container" style={{ maxWidth: 720 }}>
        {/* Label */}
        <p
          className="cta-fade label mb-8"
          style={{ color: 'rgba(245,240,232,0.6)' }}
        >
          Begin Your Journey
        </p>

        {/* Heading */}
        <h2
          style={{
            fontSize: 'var(--text-display-lg)',
            letterSpacing: '-0.02em',
            color: 'var(--color-text-inverse)',
            marginBottom: 20,
          }}
        >
          <span className="cta-line block overflow-hidden">
            <span className="split__text block" style={{ fontWeight: 300 }}>
              Your Himalayan
            </span>
          </span>
          <span className="cta-line block overflow-hidden">
            <span
              className="split__text block"
              style={{ fontWeight: 400, fontStyle: 'italic' }}
            >
              retreat awaits
            </span>
          </span>
        </h2>

        {/* Subtitle */}
        <p
          className="cta-fade"
          style={{
            fontSize: 'var(--text-body-lg)',
            color: 'rgba(245,240,232,0.8)',
            maxWidth: '40ch',
            marginInline: 'auto',
            marginBottom: 40,
            lineHeight: 1.6,
          }}
        >
          Reserve your stay directly and enjoy the best available rates — no
          commission, no middlemen.
        </p>

        {/* CTA Button — fill-wipe: ivory bg → ink fill, text flips canvas */}
        <Link
          href="/book"
          className="btn-wipe btn-wipe--inv cta-fade inline-flex items-center gap-3 group"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-button)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            backgroundColor: 'var(--color-text-inverse)',
            padding: '16px 36px',
          }}
        >
          Reserve Your Stay
          <span className="inline-block w-6 h-px bg-current transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
