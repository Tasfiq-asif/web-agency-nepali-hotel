'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

export function IntroStatement() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.intro-line .split__text',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      );

      gsap.fromTo(
        '.intro-body',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          delay: 0.4,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' },
        }
      );

      gsap.fromTo(
        '.intro-divider',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-canvas"
      style={{
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
        marginTop: '-100px',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -40px 80px rgba(28,43,26,0.18)',
        paddingTop: 'calc(var(--section-gap) + 4rem)',
        paddingBottom: 'var(--section-gap)',
      }}
    >
      <div className="container" style={{ maxWidth: 600 }}>
        {/* Decorative divider */}
        <div
          className="intro-divider mx-auto mb-10"
          style={{
            width: 64,
            height: 1,
            backgroundColor: 'var(--color-accent)',
            transformOrigin: 'center',
          }}
        />

        {/* Heading */}
        <h2
          style={{
            fontSize: 'var(--text-display-md)',
            letterSpacing: '-0.02em',
            color: 'var(--color-ink)',
            marginBottom: 28,
          }}
        >
          <span className="intro-line block overflow-hidden">
            <span className="split__text block">Where the mountains</span>
          </span>
          <span className="intro-line block overflow-hidden">
            <span
              className="split__text block"
              style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}
            >
              welcome you home
            </span>
          </span>
        </h2>

        {/* Body */}
        <div className="intro-body">
          <p
            style={{
              fontSize: 'var(--text-body-lg)',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
              maxWidth: '52ch',
              marginInline: 'auto',
            }}
          >
            Mountain Nest is a boutique lodge nestled in the heart of the Nepali
            Himalayas. Here, ancient trekking trails meet quiet luxury — a place
            where every guest arrives as a traveller and leaves as family.
          </p>
        </div>
      </div>
    </section>
  );
}
