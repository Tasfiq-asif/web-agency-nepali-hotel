'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { RoomCard } from '@/components/ui/RoomCard';

const ROOMS = [
  {
    slug: 'himalayan-suite',
    name: 'Himalayan Suite',
    tagline: 'Panoramic mountain views from your private balcony',
    imageSrc: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    amenities: ['Mountain View', 'Balcony', 'Fireplace', 'King Bed'],
    maxGuests: 3,
    pricePerNight: 180,
  },
  {
    slug: 'forest-retreat',
    name: 'Forest Retreat',
    tagline: 'Nestled among rhododendrons with floor-to-ceiling windows',
    imageSrc: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    amenities: ['Forest View', 'Window Seat', 'Rain Shower', 'Queen Bed'],
    maxGuests: 2,
    pricePerNight: 140,
  },
  {
    slug: 'summit-lodge',
    name: 'Summit Lodge',
    tagline: 'Our most spacious suite with a private terrace and hot tub',
    imageSrc: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80',
    amenities: ['Terrace', 'Hot Tub', 'Living Area', 'King Bed'],
    maxGuests: 4,
    pricePerNight: 260,
  },
  {
    slug: 'valley-room',
    name: 'Valley Room',
    tagline: 'Warm wood interiors with views over the river valley',
    imageSrc: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
    amenities: ['Valley View', 'Writing Desk', 'Rain Shower', 'Twin Beds'],
    maxGuests: 2,
    pricePerNight: 110,
  },
];

export function RoomCardGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.room-card',
        { opacity: 0, y: 50 },
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
          <p className="label mb-4" style={{ color: 'var(--color-accent)' }}>
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
            A room for every{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>kind of stay</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
          {ROOMS.map((room) => (
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
