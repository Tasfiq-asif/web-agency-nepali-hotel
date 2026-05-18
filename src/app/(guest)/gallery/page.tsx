import type { Metadata } from 'next';
import { db } from '@/db';
import { galleryImages } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { GalleryClient } from './GalleryClient';
import { CTASection } from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Explore Mountain Nest Hotel through photography — panoramic Himalayan views, our rooms and suites, dining moments, and the landscapes of Nepal\'s Solukhumbu District.',
};

type GalleryImage = {
  id: number
  url: string
  alt: string
  category: string
}

const FALLBACK_IMAGES: GalleryImage[] = [
  { id: 1, url: '/images/gallery/mountain-vista.webp',       alt: 'Mountain vista at dawn',          category: 'views' },
  { id: 2, url: '/images/gallery/suite-himalayan-views.webp',alt: 'Suite with Himalayan views',       category: 'rooms' },
  { id: 3, url: '/images/gallery/dining-candlelight.webp',   alt: 'Candlelight dining terrace',       category: 'dining' },
  { id: 4, url: '/images/gallery/sunrise-trek.webp',         alt: 'Sunrise mountain trek',            category: 'activities' },
  { id: 5, url: '/images/gallery/evening-gathering.webp',    alt: 'Evening gathering by firepit',     category: 'activities' },
  { id: 6, url: '/images/gallery/mountain-herb-garden.webp', alt: 'Mountain herb garden',             category: 'dining' },
];

async function fetchImages(): Promise<GalleryImage[]> {
  try {
    const rows = await db
      .select({
        url:      galleryImages.url,
        alt:      galleryImages.alt,
        category: galleryImages.category,
      })
      .from(galleryImages)
      .orderBy(asc(galleryImages.sortOrder));

    if (rows.length === 0) return FALLBACK_IMAGES;

    return rows.map((r, i) => ({
      id:       i + 1,
      url:      r.url,
      alt:      r.alt ?? '',
      category: r.category ?? 'general',
    }));
  } catch {
    return FALLBACK_IMAGES;
  }
}

export default async function GalleryPage() {
  const images = await fetchImages();

  return (
    <main id="main-content">
      {/* Page header — dark forest */}
      <section
        className="bg-dark"
        style={{
          paddingTop: 'calc(var(--section-gap) + 5rem)',
          paddingBottom: 'var(--section-gap)',
        }}
      >
        <div className="container">
          <p
            className="label"
            style={{
              color: 'var(--color-accent)',
              marginBottom: '1.25rem',
            }}
          >
            Gallery
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display-lg)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--color-text-inverse)',
              maxWidth: '18ch',
              lineHeight: 1.05,
            }}
          >
            Every frame,
            <br />
            <span style={{ fontWeight: 300, fontStyle: 'normal' }}>a memory.</span>
          </h1>

          <p
            style={{
              fontSize: 'var(--text-body-lg)',
              color: 'rgba(245,240,232,0.65)',
              maxWidth: '52ch',
              marginTop: '1.75rem',
              lineHeight: 1.65,
              fontFamily: 'var(--font-body)',
            }}
          >
            A visual record of Mountain Nest — the light, the landscape, the moments.
          </p>

          <GalleryClient images={images} />
        </div>
      </section>

      <CTASection />
    </main>
  );
}
