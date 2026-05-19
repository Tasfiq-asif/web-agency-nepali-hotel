'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { RoomCard } from '@/components/ui/RoomCard';
import { type Room } from '@/data/rooms';

interface Props {
  rooms: Room[];
}

export function RoomCardGrid({ rooms }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.rooms-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      );

      gsap.fromTo(
        '.rooms-heading',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.0, ease: 'power4.out', stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );

      gsap.fromTo(
        '.room-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-canvas">
      <div className="container">
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 5vw, 5rem)' }}>
          <p className="rooms-label label mb-4" style={{ color: 'var(--color-accent)' }}>
            Rooms & Suites
          </p>
          <h2
            style={{
              fontSize: 'var(--text-display-md)',
              fontWeight: 300,
              color: 'var(--color-ink)',
              maxWidth: '18ch',
              marginInline: 'auto',
            }}
          >
            <span className="block overflow-hidden">
              <span className="rooms-heading block">A room for every</span>
            </span>
            <span className="block overflow-hidden">
              <span className="rooms-heading block" style={{ fontStyle: 'italic', fontWeight: 400 }}>
                kind of stay
              </span>
            </span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
          {rooms.slice(0, 4).map((room) => (
            <RoomCard key={room.slug} {...room} />
          ))}
        </div>

        {/* View all link */}
        <div style={{ textAlign: 'center', marginTop: 'clamp(3rem, 5vw, 4rem)' }}>
          <a
            href="/rooms"
            className="inline-flex items-center gap-3 group"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-button)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-ink)',
              borderBottom: '1px solid var(--color-hairline)',
              paddingBottom: 4,
              textDecoration: 'none',
              transition: 'border-color 0.3s',
            }}
          >
            View All Rooms
            <span className="inline-block w-5 h-px bg-current transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
