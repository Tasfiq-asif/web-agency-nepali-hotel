import type { Metadata } from 'next';
import { db } from '@/db';
import { galleryImages } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { GalleryManager } from '@/components/admin/GalleryManager';

export const metadata: Metadata = { title: 'Gallery | Admin' };

async function getGallery() {
  try {
    const rows = await db
      .select()
      .from(galleryImages)
      .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.createdAt));
    return { images: rows, dbLive: true };
  } catch {
    return { images: [], dbLive: false };
  }
}

export default async function AdminGalleryPage() {
  const { images, dbLive } = await getGallery();

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: 1100 }}>
      <div style={{
        marginBottom: '1.75rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid rgba(221,216,206,0.1)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '2.25rem',
          color: '#F5F0E8',
          lineHeight: 1.1,
          marginBottom: '0.375rem',
        }}>
          Gallery
        </h1>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(245,240,232,0.35)',
        }}>
          Upload · reorder · delete images
          {!dbLive && (
            <span style={{ color: '#C4704F', marginLeft: '1rem' }}>DB OFFLINE</span>
          )}
        </p>
      </div>

      <GalleryManager initialImages={images} />
    </div>
  );
}
