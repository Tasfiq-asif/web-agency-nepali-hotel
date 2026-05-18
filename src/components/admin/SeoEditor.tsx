'use client';

import { useState } from 'react';

type SeoRow = {
  pageKey: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
};

type SeoMap = Record<string, SeoRow>;

interface Props {
  initialSeo: SeoMap;
}

const PAGE_KEYS = [
  { key: 'home',       label: 'Home' },
  { key: 'rooms',      label: 'Rooms' },
  { key: 'dining',     label: 'Dining' },
  { key: 'activities', label: 'Activities' },
  { key: 'gallery',    label: 'Gallery' },
  { key: 'about',      label: 'About' },
  { key: 'contact',    label: 'Contact' },
  { key: 'book',       label: 'Book' },
] as const;

// ── Shared styles ──────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.5rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(245,240,232,0.35)',
  marginBottom: '0.375rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(0,0,0,0.2)',
  border: '1px solid rgba(221,216,206,0.15)',
  borderRadius: 4,
  padding: '0.5rem 0.625rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  color: '#F5F0E8',
  outline: 'none',
  boxSizing: 'border-box',
};

const counterStyle = (count: number, max: number): React.CSSProperties => ({
  fontFamily: 'var(--font-mono)',
  fontSize: '0.4375rem',
  letterSpacing: '0.08em',
  color: count > max ? '#C4704F' : 'rgba(245,240,232,0.2)',
  textAlign: 'right',
  marginTop: '0.25rem',
});

// ── Page SEO panel ─────────────────────────────────────────────────────────────

function SeoPanel({ pageKey, initial }: { pageKey: string; initial: SeoRow | undefined }) {
  const [title, setTitle]       = useState(initial?.metaTitle ?? '');
  const [desc, setDesc]         = useState(initial?.metaDescription ?? '');
  const [ogImage, setOgImage]   = useState(initial?.ogImage ?? '');
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState('');

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);

    const res = await fetch(`/api/admin/seo/${pageKey}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metaTitle: title, metaDescription: desc, ogImage }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? 'Save failed');
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Meta title */}
      <div>
        <label style={labelStyle}>Meta title</label>
        <input
          style={inputStyle}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Mountain Nest Hotel — Boutique Lodge in Nepal"
        />
        <p style={counterStyle(title.length, 60)}>{title.length} / 60</p>
      </div>

      {/* Meta description */}
      <div>
        <label style={labelStyle}>Meta description</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: 80, lineHeight: 1.6 }}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Reserve a stay at Mountain Nest Hotel — a boutique mountain lodge in Nepal with Himalayan views, traditional cuisine, and guided trekking."
        />
        <p style={counterStyle(desc.length, 160)}>{desc.length} / 160</p>
      </div>

      {/* OG image */}
      <div>
        <label style={labelStyle}>OG image URL</label>
        <input
          style={inputStyle}
          value={ogImage}
          onChange={e => setOgImage(e.target.value)}
          placeholder="https://mountainnest.com/images/og-home.jpg"
        />
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.4375rem',
          letterSpacing: '0.08em',
          color: 'rgba(245,240,232,0.2)',
          marginTop: '0.25rem',
        }}>
          Recommended: 1200 × 630px JPG
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#1C2B1A',
            backgroundColor: saving ? 'rgba(196,112,79,0.5)' : '#C4704F',
            border: 'none',
            borderRadius: 4,
            padding: '0.5rem 1.25rem',
            cursor: saving ? 'default' : 'pointer',
            transition: 'background-color 0.15s',
          }}
        >
          {saving ? 'Saving…' : 'Save SEO'}
        </button>

        {saved && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6ea87e' }}>
            Saved
          </span>
        )}
        {error && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4704F' }}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Root component ─────────────────────────────────────────────────────────────

export function SeoEditor({ initialSeo }: Props) {
  const [activePage, setActivePage] = useState<string>(PAGE_KEYS[0].key);

  return (
    <div style={{ display: 'flex', gap: 0, minHeight: 400 }}>
      {/* Tab sidebar */}
      <div style={{
        width: 140,
        flexShrink: 0,
        borderRight: '1px solid rgba(221,216,206,0.08)',
      }}>
        {PAGE_KEYS.map(page => {
          const isActive = page.key === activePage;
          const hasSeo = Boolean(
            initialSeo[page.key]?.metaTitle || initialSeo[page.key]?.metaDescription,
          );
          return (
            <button
              key={page.key}
              onClick={() => setActivePage(page.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                textAlign: 'left',
                padding: '0.625rem 1rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 400,
                color: isActive ? '#F5F0E8' : 'rgba(245,240,232,0.45)',
                backgroundColor: isActive ? 'rgba(196,112,79,0.1)' : 'transparent',
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                borderLeft: isActive ? '2px solid #C4704F' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'color 0.15s, background-color 0.15s',
              }}
            >
              {page.label}
              {hasSeo && (
                <span style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: '#6ea87e',
                  flexShrink: 0,
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* SEO panel */}
      <div style={{ flex: 1, paddingLeft: '2rem' }}>
        <SeoPanel
          key={activePage}
          pageKey={activePage}
          initial={initialSeo[activePage]}
        />
      </div>
    </div>
  );
}
