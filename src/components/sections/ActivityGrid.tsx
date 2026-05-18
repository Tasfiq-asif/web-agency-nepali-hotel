'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

const ACTIVITIES = [
  {
    num: '01',
    title: 'Himalayan Treks',
    description:
      'Guided day hikes and multi-day treks through rhododendron forests to panoramic ridgelines.',
  },
  {
    num: '02',
    title: 'Sunrise Viewpoints',
    description:
      'Early morning drives to elevated viewpoints for golden-hour photography of the peaks.',
  },
  {
    num: '03',
    title: 'Mountain Yoga',
    description:
      'Daily morning sessions on the terrace — breathwork and asanas with Himalayan backdrop.',
  },
  {
    num: '04',
    title: 'Birding Expeditions',
    description:
      'Over 200 species in the surrounding forest. Guided walks with spotting scopes provided.',
  },
  {
    num: '05',
    title: 'Village Walks',
    description:
      'Visit nearby Gurung villages, meet local artisans, and learn traditional weaving.',
  },
  {
    num: '06',
    title: 'Herb Garden Tours',
    description:
      'Walk our kitchen garden with our chef — pick herbs and learn mountain-grown spice blends.',
  },
];

export function ActivityGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.activity-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      );

      gsap.fromTo(
        '.activity-heading',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.0, ease: 'power4.out', stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );

      gsap.fromTo(
        '.activity-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-forest">
      <div className="container">
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 5vw, 5rem)' }}>
          <p
            className="activity-label label mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            Activities & Nature
          </p>
          <h2
            style={{
              fontSize: 'var(--text-display-md)',
              fontWeight: 300,
              color: 'var(--color-text-inverse)',
              maxWidth: '20ch',
              marginInline: 'auto',
            }}
          >
            <span className="block overflow-hidden">
              <span className="activity-heading block">The mountains are</span>
            </span>
            <span className="block overflow-hidden">
              <span className="activity-heading block" style={{ fontStyle: 'italic', fontWeight: 400 }}>
                your itinerary
              </span>
            </span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {ACTIVITIES.map((activity) => (
            <div
              key={activity.title}
              className="activity-card"
              style={{
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                borderTop: '1px solid rgba(245,240,232,0.12)',
              }}
            >
              {/* Editorial numeral — replaces emoji */}
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'rgba(196,112,79,0.5)',
                  lineHeight: 1,
                  marginBottom: '1.25rem',
                  letterSpacing: '-0.02em',
                }}
              >
                {activity.num}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-display-sm)',
                  fontWeight: 400,
                  color: 'var(--color-text-inverse)',
                  marginBottom: '0.75rem',
                }}
              >
                {activity.title}
              </h3>
              <p
                style={{
                  fontSize: 'var(--text-body-sm)',
                  color: 'rgba(245,240,232,0.6)',
                  lineHeight: 1.65,
                }}
              >
                {activity.description}
              </p>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div style={{ textAlign: 'center', marginTop: 'clamp(3rem, 5vw, 4rem)' }}>
          <a
            href="/activities"
            className="inline-flex items-center gap-3 group"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-button)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-inverse)',
              borderBottom: '1px solid rgba(245,240,232,0.25)',
              paddingBottom: 4,
              textDecoration: 'none',
              transition: 'border-color 0.3s',
            }}
          >
            All Activities
            <span className="inline-block w-5 h-px bg-current transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
