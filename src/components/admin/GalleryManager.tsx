'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateUploadDropzone } from '@uploadthing/react';
import type { OurFileRouter } from '@/lib/uploadthing';

const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: '/api/uploadthing',
});

type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  category: string | null;
  sortOrder: number;
  createdAt: string | Date;
};

interface Props {
  initialImages: GalleryImage[];
}

const CATEGORIES = ['general', 'rooms', 'dining', 'activities', 'exterior'];

// ── Style constants ────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.5rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(245,240,232,0.35)',
  marginBottom: '0.3rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(0,0,0,0.2)',
  border: '1px solid rgba(221,216,206,0.15)',
  borderRadius: 4,
  padding: '0.375rem 0.5rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  color: '#F5F0E8',
  outline: 'none',
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  cursor: 'pointer',
};

const iconBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: 4,
  backgroundColor: 'rgba(221,216,206,0.08)',
  border: '1px solid rgba(221,216,206,0.1)',
  cursor: 'pointer',
  color: 'rgba(245,240,232,0.5)',
  flexShrink: 0,
  transition: 'background-color 0.15s, color 0.15s',
};

function ImageCard({
  image,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
}: {
  image: GalleryImage;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onUpdate: (id: string, alt: string, category: string) => void;
}) {
  const [alt, setAlt] = useState(image.alt);
  const [category, setCategory] = useState(image.category ?? 'general');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleBlurSave() {
    if (alt === image.alt && category === (image.category ?? 'general')) return;
    setSaving(true);
    await fetch(`/api/admin/gallery/${image.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alt, category }),
    });
    setSaving(false);
    onUpdate(image.id, alt, category);
  }

  async function handleDelete() {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    setDeleting(true);
    await fetch(`/api/admin/gallery/${image.id}`, { method: 'DELETE' });
    onDelete();
  }

  return (
    <div style={{
      border: '1px solid rgba(221,216,206,0.1)',
      borderRadius: 6,
      overflow: 'hidden',
      backgroundColor: 'rgba(0,0,0,0.15)',
      opacity: deleting ? 0.4 : 1,
      transition: 'opacity 0.2s',
    }}>
      {/* Image */}
      <div style={{ position: 'relative', paddingTop: '66.67%', backgroundColor: 'rgba(0,0,0,0.3)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={alt || 'Gallery image'}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {saving && (
          <div style={{
            position: 'absolute',
            top: 6,
            right: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.4375rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#C4704F',
            padding: '0.2em 0.4em',
            borderRadius: 3,
          }}>
            Saving…
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ padding: '0.625rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={labelStyle}>Alt text</label>
          <input
            style={inputStyle}
            value={alt}
            onChange={e => setAlt(e.target.value)}
            onBlur={handleBlurSave}
            placeholder="Describe the image"
          />
        </div>
        <div style={{ marginBottom: '0.625rem' }}>
          <label style={labelStyle}>Category</label>
          <select
            style={selectStyle}
            value={category}
            onChange={e => { setCategory(e.target.value); }}
            onBlur={handleBlurSave}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c} style={{ backgroundColor: '#1C2B1A' }}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Order + delete actions */}
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            style={{ ...iconBtnStyle, opacity: isFirst ? 0.3 : 1, cursor: isFirst ? 'default' : 'pointer' }}
            title="Move up"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 9V3M3 6l3-3 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            style={{ ...iconBtnStyle, opacity: isLast ? 0.3 : 1, cursor: isLast ? 'default' : 'pointer' }}
            title="Move down"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 3v6M3 6l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              ...iconBtnStyle,
              color: 'rgba(196,112,79,0.6)',
              borderColor: 'rgba(196,112,79,0.2)',
            }}
            title="Delete"
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C4704F'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(196,112,79,0.6)'; }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 3h8M5 3V2h2v1M4 3l.5 7h3L8 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function GalleryManager({ initialImages }: Props) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const router = useRouter();

  async function saveUploadedFile(url: string, fileName: string) {
    const alt = fileName
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, alt, category: 'general' }),
    });

    if (res.ok) {
      const data = await res.json();
      setImages(prev => [...prev, data.image as GalleryImage]);
    }
  }

  async function swapOrder(indexA: number, indexB: number) {
    const a = images[indexA];
    const b = images[indexB];
    const newOrderA = b.sortOrder;
    const newOrderB = a.sortOrder;

    setImages(prev => {
      const next = [...prev];
      next[indexA] = { ...a, sortOrder: newOrderA };
      next[indexB] = { ...b, sortOrder: newOrderB };
      return next;
    });

    await Promise.all([
      fetch(`/api/admin/gallery/${a.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: newOrderA }),
      }),
      fetch(`/api/admin/gallery/${b.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: newOrderB }),
      }),
    ]);

    router.refresh();
  }

  function handleDelete(id: string) {
    setImages(prev => prev.filter(img => img.id !== id));
    router.refresh();
  }

  function handleUpdate(id: string, alt: string, category: string) {
    setImages(prev => prev.map(img => img.id === id ? { ...img, alt, category } : img));
  }

  return (
    <div>
      {/* Upload zone */}
      <div style={{
        marginBottom: '1.5rem',
        border: '1px dashed rgba(196,112,79,0.35)',
        borderRadius: 8,
        padding: '0.75rem',
        backgroundColor: 'rgba(196,112,79,0.04)',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(245,240,232,0.35)',
          marginBottom: '0.75rem',
        }}>
          Upload images · JPEG or WebP · max 4 MB each · up to 10 at once
        </p>

        <UploadDropzone
          endpoint="galleryImage"
          onUploadBegin={() => { setUploading(true); setUploadError(''); }}
          onClientUploadComplete={async (files) => {
            setUploading(false);
            await Promise.all(
              files.map(f => saveUploadedFile(
                (f as { ufsUrl?: string; url: string }).ufsUrl ?? f.url,
                f.name,
              )),
            );
          }}
          onUploadError={(err) => {
            setUploading(false);
            setUploadError(err.message);
          }}
          appearance={{
            container: {
              border: 'none',
              backgroundColor: 'transparent',
              padding: 0,
              marginTop: 0,
            },
            uploadIcon: { display: 'none' },
            label: {
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'rgba(245,240,232,0.6)',
            },
            allowedContent: {
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,232,0.25)',
            },
            button: {
              backgroundColor: '#C4704F',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: 4,
              padding: '0.5rem 1rem',
            },
          }}
        />

        {uploading && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#C4704F',
            marginTop: '0.5rem',
          }}>
            Uploading…
          </p>
        )}
        {uploadError && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#C4704F',
            marginTop: '0.5rem',
          }}>
            Error: {uploadError}
          </p>
        )}
      </div>

      {/* Image count */}
      {images.length > 0 && (
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(245,240,232,0.25)',
          marginBottom: '1rem',
        }}>
          {images.length} {images.length === 1 ? 'image' : 'images'} · alt text and category edits save on blur
        </p>
      )}

      {/* Grid */}
      {images.length === 0 ? (
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(245,240,232,0.2)',
        }}>
          No images yet. Upload above to get started.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '0.875rem',
        }}>
          {images.map((img, i) => (
            <ImageCard
              key={img.id}
              image={img}
              isFirst={i === 0}
              isLast={i === images.length - 1}
              onMoveUp={() => swapOrder(i, i - 1)}
              onMoveDown={() => swapOrder(i, i + 1)}
              onDelete={() => handleDelete(img.id)}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
