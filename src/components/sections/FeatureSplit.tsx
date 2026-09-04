'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';

export function FeatureSplit() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.feature-image',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );

      // Parallax — image lags behind scroll for sense of depth
      gsap.fromTo(
        '.feature-image img',
        { yPercent: 5 },
        {
          yPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );

      gsap.fromTo(
        '.feature-text > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-forest">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div
            className="feature-image overflow-hidden rounded-sm"
            style={{ aspectRatio: '4 / 5' }}
          >
            <Image
              src="/images/dining.webp"
              alt="Mountain Nest Hotel dining experience"
              width={800}
              height={533}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full object-cover"
              style={{ height: '120%', willChange: 'transform' }}
            />
          </div>

          {/* Text */}
          <div className="feature-text">
            <p className="label mb-4" style={{ color: 'var(--color-accent)' }}>
              Dining & Local Cuisine
            </p>
            <h2
              style={{
                fontSize: 'var(--text-display-md)',
                fontWeight: 300,
                color: 'var(--color-canvas)',
                marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
              }}
            >
              Farm to table,{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 400 }}>
                mountain to plate
              </span>
            </h2>
            <p
              style={{
                fontSize: 'var(--text-body-lg)',
                color: 'rgba(245,240,232,0.75)',
                lineHeight: 1.7,
                maxWidth: '42ch',
                marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
              }}
            >
              Our kitchen draws from the valley below — seasonal vegetables from local
              farms, freshwater trout from mountain streams, and spices grown in our own
              herb garden. Every meal is a celebration of Nepali highland flavors.
            </p>
            <p
              style={{
                fontSize: 'var(--text-body)',
                color: 'rgba(245,240,232,0.6)',
                lineHeight: 1.7,
                maxWidth: '42ch',
                marginBottom: 'clamp(2rem, 4vw, 3rem)',
              }}
            >
              Guests gather each evening for a communal dinner — five courses paired
              with local wines and served by candlelight with views of the valley.
            </p>
            <a
              href="/dining"
              className="inline-flex items-center gap-3 group"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-button)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-canvas)',
                borderBottom: '1px solid rgba(245,240,232,0.3)',
                paddingBottom: 4,
                textDecoration: 'none',
                transition: 'border-color 0.3s',
              }}
            >
              Explore Our Menu
              <span className="inline-block w-5 h-px bg-current transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
