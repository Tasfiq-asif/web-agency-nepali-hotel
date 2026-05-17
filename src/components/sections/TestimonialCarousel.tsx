'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';

const TESTIMONIALS = [
  {
    quote:
      'We came for two nights and stayed a week. The views from our room made it impossible to leave — every morning felt like waking inside a painting.',
    guest: 'Sarah & James L.',
    origin: 'London, UK',
    stay: 'Summit Suite · March 2026',
  },
  {
    quote:
      'The communal dinners were the highlight. Sitting with other travellers, sharing stories over five courses of mountain-grown food — unforgettable.',
    guest: 'Marco D.',
    origin: 'Milan, Italy',
    stay: 'Valley Room · October 2025',
  },
  {
    quote:
      'Our guide took us on a sunrise trek to a viewpoint we never would have found alone. The staff here know these mountains like family.',
    guest: 'Ayumi T.',
    origin: 'Tokyo, Japan',
    stay: 'Himalayan Suite · November 2025',
  },
  {
    quote:
      'After a decade of luxury hotels, this is the first place that felt genuinely warm. Not performative — real warmth from people who love what they do.',
    guest: 'David & Rachel K.',
    origin: 'New York, USA',
    stay: 'Summit Suite · April 2026',
  },
];

export function TestimonialCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonial-inner',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const goTo = (index: number) => {
    setActive(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
  };

  const current = TESTIMONIALS[active];

  return (
    <section ref={sectionRef} className="section bg-forest">
      <div className="container">
        <div className="testimonial-inner" style={{ textAlign: 'center', maxWidth: '52rem', marginInline: 'auto' }}>
          {/* Label */}
          <p className="label mb-6" style={{ color: 'var(--color-accent)' }}>
            Guest Stories
          </p>

          {/* Quote */}
          <blockquote
            key={active}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display-sm)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--color-canvas)',
              lineHeight: 1.4,
              marginBottom: 'clamp(2rem, 4vw, 3rem)',
              minHeight: '8rem',
              transition: 'opacity 0.5s ease',
            }}
          >
            &ldquo;{current.quote}&rdquo;
          </blockquote>

          {/* Attribution */}
          <div style={{ marginBottom: 'clamp(2rem, 3vw, 2.5rem)' }}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body)',
                fontWeight: 500,
                color: 'var(--color-canvas)',
                marginBottom: '0.25rem',
              }}
            >
              {current.guest}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-label)',
                letterSpacing: '0.1em',
                color: 'rgba(245,240,232,0.6)',
              }}
            >
              {current.origin} · {current.stay}
            </p>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`View testimonial ${i + 1}`}
                style={{
                  width: i === active ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: 'none',
                  background: i === active ? 'var(--color-accent)' : 'rgba(245,240,232,0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
