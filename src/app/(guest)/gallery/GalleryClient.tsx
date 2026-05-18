'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';

type GalleryImage = {
  id: number
  url: string
  alt: string
  category: string
}

type Category = 'all' | 'rooms' | 'dining' | 'activities' | 'views'

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'all',        label: 'All' },
  { key: 'rooms',      label: 'Rooms' },
  { key: 'dining',     label: 'Dining' },
  { key: 'activities', label: 'Activities' },
  { key: 'views',      label: 'Views' },
];

export function GalleryClient({ images }: { images: GalleryImage[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [filterKey, setFilterKey] = useState(0);

  const filtered: GalleryImage[] =
    activeCategory === 'all'
      ? images
      : images.filter((img) => img.category === activeCategory);

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setFilterKey((k) => k + 1);
  };

  const openLightbox = (idx: number) => setLightboxIndex(idx);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prevImage = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i - 1 + filtered.length) % filtered.length
      ),
    [filtered.length]
  );

  const nextImage = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i + 1) % filtered.length
      ),
    [filtered.length]
  );

  useEffect(() => {
    if (!gridRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [filterKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, closeLightbox, prevImage, nextImage]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  return (
    <>
      {/* Category filter bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(0.5rem, 1.5vw, 0.875rem)',
          marginTop: 'clamp(2.5rem, 4vw, 3.5rem)',
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-button)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '8px 20px',
                border: isActive
                  ? '1px solid var(--color-accent)'
                  : '1px solid rgba(245,240,232,0.2)',
                borderRadius: 9999,
                background: isActive ? 'var(--color-accent)' : 'transparent',
                color: isActive
                  ? 'var(--color-text-inverse)'
                  : 'rgba(245,240,232,0.6)',
                cursor: 'pointer',
                transition: 'background 0.25s, border-color 0.25s, color 0.25s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    'rgba(245,240,232,0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    'rgba(245,240,232,0.6)';
                }
              }}
            >
              {cat.label}
            </button>
          );
        })}

        <span
          style={{
            marginLeft: 'auto',
            alignSelf: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-label)',
            letterSpacing: '0.12em',
            color: 'rgba(245,240,232,0.35)',
            textTransform: 'uppercase',
          }}
        >
          {String(filtered.length).padStart(2, '0')} images
        </span>
      </div>

      {/* Masonry grid */}
      <div
        ref={gridRef}
        key={filterKey}
        style={{
          marginTop: 'clamp(2.5rem, 4vw, 4rem)',
          columns: 'clamp(240px, 30vw, 420px) 3',
          columnGap: 'clamp(8px, 1.25vw, 16px)',
        }}
      >
        {filtered.map((img, i) => (
          <div
            key={img.id}
            className="gallery-item"
            onClick={() => openLightbox(i)}
            style={{
              breakInside: 'avoid',
              marginBottom: 'clamp(8px, 1.25vw, 16px)',
              borderRadius: 4,
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                display: 'block',
              }}
            >
              <Image
                src={img.url}
                alt={img.alt}
                width={800}
                height={600}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transition:
                    'filter 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLImageElement).style.filter =
                    'brightness(1.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLImageElement).style.filter =
                    'brightness(1)';
                }}
              />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-label)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,232,0.35)',
              paddingTop: '3rem',
            }}
          >
            No images in this category yet.
          </p>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          {/* Counter */}
          <div
            style={{
              position: 'absolute',
              top: 'clamp(1.5rem, 3vw, 2.5rem)',
              left: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-label)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,232,0.4)',
              pointerEvents: 'none',
            }}
          >
            {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
            {String(filtered.length).padStart(2, '0')}
          </div>

          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            style={{
              position: 'absolute',
              top: 'clamp(1.25rem, 3vw, 2rem)',
              right: 'clamp(1.25rem, 3vw, 2rem)',
              background: 'none',
              border: '1px solid rgba(245,240,232,0.2)',
              color: 'var(--color-canvas)',
              cursor: 'pointer',
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              lineHeight: 1,
              transition: 'border-color 0.2s, opacity 0.2s',
              opacity: 0.7,
              borderRadius: 2,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '1';
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                'rgba(245,240,232,0.6)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.7';
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                'rgba(245,240,232,0.2)';
            }}
            aria-label="Close lightbox"
          >
            &times;
          </button>

          {/* Image + caption */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '90vw',
              maxHeight: '85vh',
            }}
          >
            <Image
              src={filtered[lightboxIndex].url}
              alt={filtered[lightboxIndex].alt}
              width={1200}
              height={800}
              style={{
                maxWidth: '90vw',
                maxHeight: '78vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
              priority
            />
            <p
              style={{
                marginTop: '1rem',
                fontFamily: 'var(--font-body)',
                fontStyle: 'italic',
                fontSize: 'var(--text-body-sm)',
                color: 'rgba(245,240,232,0.5)',
                letterSpacing: '0.01em',
                textAlign: 'center',
              }}
            >
              {filtered[lightboxIndex].alt}
            </p>
          </div>

          {/* Prev arrow */}
          {filtered.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              style={{
                position: 'absolute',
                left: 'clamp(0.75rem, 2.5vw, 2rem)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: '1px solid rgba(245,240,232,0.2)',
                color: 'var(--color-canvas)',
                cursor: 'pointer',
                width: 52,
                height: 52,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                transition: 'border-color 0.2s',
                borderRadius: 2,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  'rgba(245,240,232,0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  'rgba(245,240,232,0.2)';
              }}
              aria-label="Previous image"
            >
              ←
            </button>
          )}

          {/* Next arrow */}
          {filtered.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              style={{
                position: 'absolute',
                right: 'clamp(0.75rem, 2.5vw, 2rem)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: '1px solid rgba(245,240,232,0.2)',
                color: 'var(--color-canvas)',
                cursor: 'pointer',
                width: 52,
                height: 52,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                transition: 'border-color 0.2s',
                borderRadius: 2,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  'rgba(245,240,232,0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  'rgba(245,240,232,0.2)';
              }}
              aria-label="Next image"
            >
              →
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}
