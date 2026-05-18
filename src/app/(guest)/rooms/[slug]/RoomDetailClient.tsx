'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import type { Room } from '@/data/rooms';

interface Props {
  room: Room;
}

export function RoomDetailClient({ room }: Props) {
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Hero elements slide up on mount
      gsap.fromTo(
        '.room-hero-label, .room-hero-headline, .room-hero-tagline',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          delay: 0.15,
        }
      );

      // Content section reveals on scroll
      gsap.fromTo(
        '.detail-reveal',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main id="main-content">
      {/* ── Hero ── */}
      <div
        className="relative"
        style={{ height: '80vh', minHeight: 520 }}
      >
        <Image
          src={room.imageSrc}
          alt={room.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Dark gradient overlay — heavier at bottom for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(28,43,26,0.92) 0%, rgba(28,43,26,0.4) 45%, rgba(28,43,26,0.1) 100%)',
          }}
        />

        {/* Room identity — anchored to bottom-left */}
        <div
          className="absolute inset-0 container flex flex-col justify-end"
          style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}
        >
          <p
            className="room-hero-label label"
            style={{ color: 'var(--color-accent)', marginBottom: '1rem', opacity: 0 }}
          >
            Rooms &amp; Suites
          </p>

          <h1
            className="room-hero-headline"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display-lg)',
              fontWeight: 300,
              color: 'var(--color-text-inverse)',
              lineHeight: 1.05,
              maxWidth: '20ch',
              opacity: 0,
            }}
          >
            {room.name}
          </h1>

          <p
            className="room-hero-tagline"
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'var(--text-body-lg)',
              color: 'rgba(245,240,232,0.75)',
              marginTop: '0.75rem',
              maxWidth: '50ch',
              opacity: 0,
            }}
          >
            {room.tagline}
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <section ref={contentRef} className="section bg-canvas">
        <div className="container">
          <div
            className="grid grid-cols-1 items-start"
            style={{ gap: 'clamp(3rem, 6vw, 5rem)' }}
          >
            {/* Top meta row */}
            <div
              className="detail-reveal flex flex-wrap items-center gap-x-10 gap-y-4"
              style={{
                paddingBottom: 'clamp(2rem, 4vw, 3rem)',
                borderBottom: '1px solid var(--color-hairline)',
                opacity: 0,
              }}
            >
              <div>
                <p className="label" style={{ color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                  Nightly rate
                </p>
                <p>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2rem, 4vw, 3rem)',
                      fontWeight: 300,
                      color: 'var(--color-ink)',
                      lineHeight: 1,
                    }}
                  >
                    ${room.pricePerNight}
                  </span>
                  <span
                    className="label"
                    style={{ color: 'var(--color-text-secondary)', marginLeft: 8 }}
                  >
                    / night
                  </span>
                </p>
              </div>

              <div
                style={{
                  width: 1,
                  height: 48,
                  background: 'var(--color-hairline)',
                  display: 'none',
                }}
                className="hidden md:block"
              />

              <div>
                <p className="label" style={{ color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                  Capacity
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                    fontWeight: 300,
                    color: 'var(--color-ink)',
                  }}
                >
                  Up to {room.maxGuests} guests
                </p>
              </div>
            </div>

            {/* Two-column: description + amenities | booking widget */}
            <div
              className="grid grid-cols-1 lg:grid-cols-[1fr_340px]"
              style={{ gap: 'clamp(3rem, 6vw, 5rem)', alignItems: 'start' }}
            >
              {/* Left: description + amenities */}
              <div>
                {/* Description */}
                <div
                  className="detail-reveal"
                  style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)', opacity: 0 }}
                >
                  <p className="label" style={{ color: 'var(--color-accent)', marginBottom: '1.25rem' }}>
                    About this room
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-body-lg)',
                      color: 'var(--color-ink)',
                      maxWidth: '58ch',
                      lineHeight: 1.8,
                    }}
                  >
                    {room.description}
                  </p>
                </div>

                {/* Amenities */}
                <div className="detail-reveal" style={{ opacity: 0 }}>
                  <p
                    className="label"
                    style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}
                  >
                    What&apos;s included
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {room.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-body-sm)',
                          color: 'var(--color-ink)',
                          padding: '10px 18px',
                          border: '1px solid var(--color-hairline)',
                          lineHeight: 1,
                        }}
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: sticky booking widget */}
              <div
                className="detail-reveal lg:sticky"
                style={{ top: 'calc(var(--navbar-height, 5rem) + 1.5rem)', opacity: 0 }}
              >
                <div
                  style={{
                    background: 'var(--color-surface-dark)',
                    padding: 'clamp(1.75rem, 3vw, 2.5rem)',
                  }}
                >
                  {/* Price block */}
                  <div
                    style={{
                      marginBottom: '1.75rem',
                      paddingBottom: '1.75rem',
                      borderBottom: '1px solid rgba(245,240,232,0.12)',
                    }}
                  >
                    <p
                      className="label"
                      style={{ color: 'rgba(245,240,232,0.45)', marginBottom: '0.625rem' }}
                    >
                      Starting from
                    </p>
                    <p>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                          fontWeight: 300,
                          color: 'var(--color-text-inverse)',
                          lineHeight: 1,
                        }}
                      >
                        ${room.pricePerNight}
                      </span>
                      <span
                        className="label"
                        style={{ color: 'rgba(245,240,232,0.45)', marginLeft: 10 }}
                      >
                        / night
                      </span>
                    </p>
                  </div>

                  {/* Capacity */}
                  <div style={{ marginBottom: '2rem' }}>
                    <p
                      className="label"
                      style={{ color: 'rgba(245,240,232,0.45)', marginBottom: '0.375rem' }}
                    >
                      Capacity
                    </p>
                    <p
                      style={{
                        color: 'var(--color-text-inverse)',
                        fontSize: 'var(--text-body)',
                      }}
                    >
                      Up to {room.maxGuests} guests
                    </p>
                  </div>

                  {/* Reserve CTA */}
                  <Link
                    href={`/book?room=${room.slug}`}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '1.125rem 1.5rem',
                      background: 'var(--color-accent)',
                      color: 'var(--color-text-inverse)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-button)',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      transition: 'opacity 0.25s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    Reserve This Room
                  </Link>

                  <p
                    style={{
                      marginTop: '1rem',
                      textAlign: 'center',
                      fontSize: 'var(--text-body-sm)',
                      color: 'rgba(245,240,232,0.35)',
                      lineHeight: 1.6,
                    }}
                  >
                    Confirmed within 4 hours.
                    <br />
                    No charge until check-in.
                  </p>
                </div>

                {/* Back to all rooms */}
                <Link
                  href="/rooms"
                  className="flex items-center gap-2 group"
                  style={{
                    marginTop: '1.25rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-label)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  <span
                    className="inline-block w-5 h-px bg-current transition-transform duration-300 group-hover:-translate-x-1"
                    style={{ flexShrink: 0 }}
                  />
                  All Rooms &amp; Suites
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
