'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

const GALLERY_ITEMS = [
  { src: '/images/gallery/placeholder-1.svg', alt: 'Mountain vista from the terrace', span: 'tall' },
  { src: '/images/gallery/placeholder-2.svg', alt: 'Dining room by candlelight', span: 'normal' },
  { src: '/images/gallery/placeholder-3.svg', alt: 'Suite interior with Himalayan views', span: 'normal' },
  { src: '/images/gallery/placeholder-4.svg', alt: 'Sunrise trek above the clouds', span: 'tall' },
  { src: '/images/gallery/placeholder-5.svg', alt: 'Mountain herb garden', span: 'normal' },
  { src: '/images/gallery/placeholder-6.svg', alt: 'Evening bonfire with guests', span: 'normal' },
];

export function GalleryMasonry() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-item',
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
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
          <p className="label mb-4" style={{ color: 'var(--color-accent)' }}>
            Gallery
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
            Moments from{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>the mountain</span>
          </h2>
        </div>

        {/* Masonry grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridAutoRows: '200px',
            gap: 'clamp(0.5rem, 1.5vw, 1rem)',
          }}
        >
          {GALLERY_ITEMS.map((item, i) => (
            <div
              key={i}
              className="gallery-item"
              style={{
                gridRow: item.span === 'tall' ? 'span 2' : 'span 1',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <img
                src={item.src}
                alt={item.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                }}
              />
            </div>
          ))}
        </div>

        {/* View all link */}
        <div style={{ textAlign: 'center', marginTop: 'clamp(3rem, 5vw, 4rem)' }}>
          <a
            href="/gallery"
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
            View Full Gallery
            <span className="inline-block w-5 h-px bg-current transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
