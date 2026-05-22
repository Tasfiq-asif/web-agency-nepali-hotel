'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { onPreloaderDone } from '@/lib/preloader';
import { BLUR_PLACEHOLDERS } from '@/lib/blur-placeholders';

export function HeroFullscreen() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero-line', { yPercent: 110 });
      gsap.set('.hero-fade', { opacity: 0, y: 20 });

      onPreloaderDone(() => {
        gsap.to('.hero-line', {
          yPercent: 0,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.12,
        });

        gsap.to('.hero-fade', {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 0.5,
        });
      });

      // Photo parallax — scrub: 1.8 gives the image physical weight (float, not snap)
      if (imageRef.current) {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 768px)', () => {
          gsap.to(imageRef.current, {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.8,
            },
          });
        });
      }
    }, sectionRef);

    // Magnetic CTA — elastic snap-back on leave is the premium signal
    const cta = ctaRef.current;
    let cleanupMagnetic: (() => void) | null = null;

    if (cta && window.matchMedia('(hover: hover)').matches) {
      const onMove = (e: MouseEvent) => {
        const { left, top, width, height } = cta.getBoundingClientRect();
        const dx = (e.clientX - left - width / 2) * 0.35;
        const dy = (e.clientY - top - height / 2) * 0.35;
        gsap.to(cta, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
      };
      const onLeave = () => {
        gsap.to(cta, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
      };
      cta.addEventListener('mousemove', onMove);
      cta.addEventListener('mouseleave', onLeave);
      cleanupMagnetic = () => {
        cta.removeEventListener('mousemove', onMove);
        cta.removeEventListener('mouseleave', onLeave);
      };
    }

    return () => {
      ctx.revert();
      cleanupMagnetic?.();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: 600 }}
    >
      {/* Background image — 130% height gives parallax room to travel */}
      <div
        ref={imageRef}
        className="absolute inset-x-0 top-0"
        style={{ height: '140%', willChange: 'transform', backgroundColor: 'var(--color-surface-dark)' }}
      >
        <Image
          src="/images/hero.webp"
          alt="Mountain Nest Hotel — Himalayan mountain landscape"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDERS.hero}
          className="object-cover"
          style={{ objectPosition: 'center 30%' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Overlay gradient moves with the image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(28,43,26,0.3) 0%, rgba(28,43,26,0.1) 40%, rgba(28,43,26,0.55) 65%, rgba(28,43,26,0.9) 85%, rgba(28,43,26,1) 100%)',
          }}
        />
      </div>

      {/* Content — sits above scroll indicator with generous clearance */}
      <div
        className="container relative z-10 flex flex-col justify-end h-full"
        style={{ paddingBottom: 'clamp(7rem, 12vh, 10rem)' }}
      >
        {/* Label */}
        <p
          className="label hero-fade mb-6"
          style={{ color: 'rgba(245,240,232,0.6)' }}
        >
          Nepali Mountain Lodge
        </p>

        {/* Headline */}
        <h1
          aria-label="A sanctuary above the clouds"
          style={{
            fontSize: 'clamp(3.25rem, 13vw, 14rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-inverse)',
            marginBottom: 40,
          }}
        >
          <span className="block overflow-hidden">
            <span className="hero-line block" style={{ fontWeight: 300 }}>
              A sanctuary
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="hero-line block"
              style={{ fontWeight: 400, fontStyle: 'italic', color: 'var(--color-accent)' }}
            >
              above the clouds
            </span>
          </span>
        </h1>

        {/* Subtitle + CTA row */}
        <div className="hero-fade flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              color: 'rgba(245,240,232,0.75)',
              maxWidth: '38ch',
              lineHeight: 1.5,
            }}
          >
            Nestled in the Himalayas, where ancient trails meet quiet luxury.
          </p>

          <Link
            ref={ctaRef}
            href="/book"
            className="btn-wipe hero-fade inline-flex items-center gap-3 shrink-0 group"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-button)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-inverse)',
              border: '1px solid rgba(245,240,232,0.25)',
              padding: '16px 28px',
            }}
          >
            Reserve Your Stay
            <span
              className="inline-block w-6 h-px bg-current transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* Scroll indicator — positioned relative to section, not content */}
      <div
        className="hero-fade absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ bottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}
        aria-hidden
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(245,240,232,0.55)',
          }}
        >
          scroll
        </span>
        <div
          style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, rgba(196,112,79,0.5), transparent)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  );
}
