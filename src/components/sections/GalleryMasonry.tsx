'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

const GALLERY_ITEMS = [
  { src: '/images/gallery/mountain-vista.webp', alt: 'Mountain vista from the terrace', area: 'a' },
  { src: '/images/gallery/dining-candlelight.webp', alt: 'Dining room by candlelight', area: 'b' },
  { src: '/images/gallery/suite-himalayan-views.webp', alt: 'Suite interior with Himalayan views', area: 'c' },
  { src: '/images/gallery/mountain-herb-garden.webp', alt: 'Mountain herb garden', area: 'd' },
  { src: '/images/gallery/sunrise-trek.webp', alt: 'Sunrise trek above the clouds', area: 'e' },
  { src: '/images/gallery/evening-gathering.webp', alt: 'Evening gathering with mountain backdrop', area: 'f' },
];

export function GalleryMasonry() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      );

      gsap.fromTo(
        '.gallery-heading',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.0, ease: 'power4.out', stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );

      // Clip-path curtain reveal — "curtain pulled off a painting" (Effect 13, Awwwards standard)
      gsap.utils.toArray<HTMLElement>('.gallery-item').forEach((item, i) => {
        const img = item.querySelector('img');
        const tl = gsap.timeline({
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          delay: i * 0.09,
        });
        tl.fromTo(
          item,
          { clipPath: 'inset(0 100% 0 0)', WebkitClipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)',   WebkitClipPath: 'inset(0 0% 0 0)',   duration: 1.1, ease: 'power4.inOut' }
        );
        if (img) {
          tl.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.1, ease: 'power4.inOut' }, '<');
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section bg-canvas"
    >
      {/* Header — stays in container */}
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 5vw, 5rem)' }}>
          <p className="gallery-label label mb-4" style={{ color: 'var(--color-accent)' }}>
            Gallery
          </p>
          <h2
            style={{
              fontSize: 'var(--text-display-md)',
              fontWeight: 300,
              color: 'var(--color-ink)',
              maxWidth: '20ch',
              marginInline: 'auto',
            }}
          >
            <span className="block overflow-hidden">
              <span className="gallery-heading block">Moments from</span>
            </span>
            <span className="block overflow-hidden">
              <span className="gallery-heading block" style={{ fontStyle: 'italic', fontWeight: 400 }}>
                the mountain
              </span>
            </span>
          </h2>
        </div>
      </div>

      {/* Gallery Wall — bleeds past container, minimal padding for edge-to-edge feel */}
      <div className="gallery-bento">
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
          );
        })}
      </div>

      {/* View all link — back in container */}
      <div className="container">
        <div style={{ textAlign: 'center', marginTop: 'clamp(3rem, 5vw, 4rem)' }}>
          <a
            href="/gallery"
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
            View Full Gallery
            <span className="inline-block w-5 h-px bg-current transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
