'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

const STATS = [
  { target: 2800, display: '2,800', suffix: 'm', label: 'Elevation' },
  { target: 12,   display: '12',    suffix: '',  label: 'Suites & Rooms' },
  { target: 15,   display: '15',    suffix: '+', label: 'Years of Hospitality' },
  { target: 6,    display: '6',     suffix: '',  label: 'Trekking Routes Nearby' },
];

export function StatStrip() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stat-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );

      // Count-up animation — runs once on scroll enter
      gsap.utils.toArray<HTMLElement>('.stat-number').forEach((el) => {
        const target = Number(el.dataset.target);
        const useLocale = target >= 1000;
        const obj = { val: 0 };
        el.textContent = '0';
        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          snap: { val: 1 },
          onUpdate: () => {
            el.textContent = useLocale
              ? Math.round(obj.val).toLocaleString()
              : String(Math.round(obj.val));
          },
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        });
      });

      gsap.fromTo(
        '.stat-divider',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.6,
          ease: 'power3.inOut',
          stagger: 0.1,
          delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-forest"
      style={{
        paddingBlock: 'clamp(3rem, 6vw, 5rem)',
        paddingInline: 'var(--container-px)',
      }}
    >
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-y-10"
        style={{ textAlign: 'center' }}
      >
          {STATS.map((stat, i) => (
            <div key={stat.label} className="relative">
              {/* Vertical divider between items (desktop only) */}
              {i > 0 && (
                <div
                  className="stat-divider hidden md:block absolute left-0 top-1/2 -translate-y-1/2"
                  style={{
                    width: 1,
                    height: '60%',
                    backgroundColor: 'rgba(245,240,232,0.12)',
                    transformOrigin: 'top',
                  }}
                />
              )}

              <div className="stat-item">
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: 300,
                    lineHeight: 1,
                    color: 'var(--color-text-inverse)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  <span
                    className="stat-number"
                    data-target={stat.target}
                  >
                    {stat.display}
                  </span>
                  {stat.suffix && (
                    <span
                      style={{
                        fontSize: '0.5em',
                        fontStyle: 'italic',
                        color: 'var(--color-accent)',
                        marginLeft: 2,
                      }}
                    >
                      {stat.suffix}
                    </span>
                  )}
                </p>
                <p
                  className="label mt-3"
                  style={{ color: 'rgba(245,240,232,0.5)' }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
    </section>
  );
}
