'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { RoomCard } from '@/components/ui/RoomCard';
import { ROOMS, GUEST_FILTERS } from '@/data/rooms';

export function RoomsClient() {
  const [activeFilter, setActiveFilter] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const filtered = activeFilter === 0
    ? ROOMS
    : ROOMS.filter((r) => r.maxGuests >= activeFilter);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 }
      );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current!.querySelectorAll('.room-card');
      gsap.killTweensOf(cards);
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
        }
      );
    });

    return () => ctx.revert();
  }, [activeFilter]);

  return (
    <main>
      {/* Page header */}
      <section
        className="bg-forest"
        style={{ paddingTop: 'calc(var(--section-gap) + 5rem)', paddingBottom: 'var(--section-gap)' }}
      >
        <div className="container" ref={headerRef} style={{ opacity: 0 }}>
          <p className="label mb-5" style={{ color: 'var(--color-accent)' }}>
            Rooms & Suites
          </p>
          <h1
            style={{
              fontSize: 'var(--text-display-lg)',
              fontWeight: 300,
              color: 'var(--color-text-inverse)',
              maxWidth: '20ch',
            }}
          >
            Find your{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>perfect stay</span>
          </h1>
          <p
            style={{
              fontSize: 'var(--text-body-lg)',
              color: 'var(--color-text-inverse)',
              opacity: 0.7,
              maxWidth: '50ch',
              marginTop: '1.5rem',
            }}
          >
            Six thoughtfully designed rooms, each with its own character — from intimate garden retreats to panoramic mountain suites.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="section bg-canvas">
        <div className="container">
          {/* Filter bar */}
          <div
            className="flex flex-wrap gap-3"
            style={{ marginBottom: 'clamp(3rem, 5vw, 4rem)' }}
          >
            {GUEST_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-label)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '10px 20px',
                  border: '1px solid',
                  borderColor: activeFilter === f.value ? 'var(--color-ink)' : 'var(--color-hairline)',
                  backgroundColor: activeFilter === f.value ? 'var(--color-ink)' : 'transparent',
                  color: activeFilter === f.value ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Room grid */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16"
          >
            {filtered.map((room, i) => (
              <RoomCard key={room.slug} {...room} priority={i < 2} />
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', paddingBlock: '4rem' }}>
              <p style={{ fontSize: 'var(--text-body-lg)', color: 'var(--color-text-secondary)' }}>
                No rooms match this filter. Try selecting fewer guests.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
