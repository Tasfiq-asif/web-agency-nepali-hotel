'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

const GALLERY_ITEMS = [
  { src: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80', alt: 'Mountain vista from the terrace', area: 'a' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', alt: 'Dining room by candlelight', area: 'b' },
  { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80', alt: 'Suite interior with Himalayan views', area: 'c' },
  { src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80', alt: 'Mountain herb garden', area: 'd' },
  { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', alt: 'Sunrise trek above the clouds', area: 'e' },
  { src: 'https://images.unsplash.com/photo-1475483768296-6163e8f4a9c5?w=800&q=80', alt: 'Evening gathering with mountain backdrop', area: 'f' },
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

        {/* Gallery Wall — 4×4 bento with two diagonal anchors */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(4, clamp(100px, 14vw, 160px))',
            gap: 'clamp(8px, 1.2vw, 14px)',
          }}
        >
          {GALLERY_ITEMS.map((item, i) => {
            const areaMap: Record<string, React.CSSProperties> = {
              a: { gridColumn: '1 / 3', gridRow: '1 / 3' },
              b: { gridColumn: '3 / 4', gridRow: '1 / 2' },
              c: { gridColumn: '4 / 5', gridRow: '1 / 2' },
              d: { gridColumn: '1 / 2', gridRow: '3 / 5' },
              e: { gridColumn: '3 / 5', gridRow: '2 / 5' },
              f: { gridColumn: '2 / 3', gridRow: '3 / 5' },
            };

            return (
              <div
                key={i}
                className="gallery-item"
                style={{
                  ...areaMap[item.area],
                  borderRadius: 6,
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
            );
          })}
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
