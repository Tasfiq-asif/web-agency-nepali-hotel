'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';
import { BLUR_PLACEHOLDERS } from '@/lib/blur-placeholders';

interface RoomCardProps {
  slug: string;
  name: string;
  tagline: string;
  imageSrc: string;
  amenities: string[];
  maxGuests: number;
  pricePerNight: number;
  priority?: boolean;
}

export function RoomCard({
  slug,
  name,
  tagline,
  imageSrc,
  amenities,
  maxGuests,
  pricePerNight,
  priority = false,
}: RoomCardProps) {
  const blurDataURL = BLUR_PLACEHOLDERS[slug as keyof typeof BLUR_PLACEHOLDERS];
  const imageWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = imageWrapRef.current;
    if (!wrap || !window.matchMedia('(hover: hover)').matches) return;

    const img = wrap.querySelector('img');
    if (!img) return;

    const onEnter = () =>
      gsap.to(img, { scale: 1.03, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
    const onLeave = () =>
      gsap.to(img, { scale: 1, duration: 1.1, ease: 'elastic.out(1, 0.35)', overwrite: 'auto' });

    wrap.addEventListener('mouseenter', onEnter);
    wrap.addEventListener('mouseleave', onLeave);
    return () => {
      wrap.removeEventListener('mouseenter', onEnter);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <Link
      href={`/rooms/${slug}`}
      className="room-card group block"
      style={{ textDecoration: 'none' }}
    >
      {/* Image */}
      <div
        ref={imageWrapRef}
        className="relative overflow-hidden"
        style={{ aspectRatio: '4 / 3' }}
      >
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          className="object-cover"
          style={{ willChange: 'transform' }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(to top, rgba(28,43,26,0.4) 0%, transparent 50%)' }}
        />
      </div>

      {/* Content */}
      <div style={{ paddingTop: 24 }}>
        {/* Name */}
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-display-sm)',
            fontWeight: 400,
            color: 'var(--color-ink)',
            marginBottom: 6,
          }}
        >
          {name}
        </h3>

        {/* Tagline */}
        <p
          style={{
            fontSize: 'var(--text-body)',
            color: 'var(--color-text-secondary)',
            marginBottom: 16,
          }}
        >
          {tagline}
        </p>

        {/* Amenities */}
        <div
          className="flex flex-wrap gap-2"
          style={{ marginBottom: 20 }}
        >
          {amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="label"
              style={{
                padding: '4px 10px',
                border: '1px solid var(--color-hairline)',
                fontSize: 'var(--text-label)',
              }}
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Price + Guests row */}
        <div className="room-price-display flex items-center justify-between">
          <p style={{ color: 'var(--color-ink)', fontSize: 'var(--text-body)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5em', fontWeight: 400 }}>
              ${pricePerNight}
            </span>
            <span style={{ color: 'var(--color-text-secondary)', marginLeft: 4 }}>
              / night
            </span>
          </p>
          <p className="label" style={{ color: 'var(--color-text-secondary)' }}>
            Up to {maxGuests} guests
          </p>
        </div>

        {/* Reserve link */}
        <div
          className="mt-5 flex items-center gap-2"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-button)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
          }}
        >
          Reserve This Room
          <span
            className="inline-block w-5 h-px bg-current transition-transform duration-300 group-hover:translate-x-1.5"
          />
        </div>
      </div>
    </Link>
  );
}
