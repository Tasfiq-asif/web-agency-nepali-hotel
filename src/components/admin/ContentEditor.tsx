'use client';

import { useState } from 'react';

type PageFields = Record<string, string>;
type ContentMap = Record<string, PageFields>;

interface Props {
  initialContent: ContentMap;
}

// ── Field definitions per page ────────────────────────────────────────────────

const PAGES = [
  {
    key: 'home',
    label: 'Home',
    fields: [
      { key: 'heroHeadline',  label: 'Hero Headline',    multiline: false, hint: 'Main heading over the hero image' },
      { key: 'introHeading',  label: 'Intro Heading',    multiline: false, hint: 'Large centered heading below hero' },
      { key: 'introAccent',   label: 'Intro Accent',     multiline: false, hint: 'Italic terracotta accent phrase' },
      { key: 'introText',     label: 'Intro Paragraph',  multiline: true,  hint: 'Body paragraph in the intro block' },
    ],
  },
  {
    key: 'about',
    label: 'About',
    fields: [
      { key: 'heading',        label: 'Page Heading',      multiline: false, hint: 'Main heading on the About page' },
      { key: 'story',          label: 'Our Story',         multiline: true,  hint: 'The hotel\'s origin story' },
      { key: 'philosophy',     label: 'Philosophy',        multiline: true,  hint: 'Hospitality philosophy paragraph' },
      { key: 'sustainability', label: 'Sustainability',    multiline: true,  hint: 'Environmental commitment paragraph' },
    ],
  },
  {
    key: 'dining',
    label: 'Dining',
    fields: [
      { key: 'heading',   label: 'Page Heading',  multiline: false, hint: 'Main heading on the Dining page' },
      { key: 'introText', label: 'Introduction',  multiline: true,  hint: 'Opening paragraph about the dining experience' },
      { key: 'menuNote',  label: 'Menu Note',     multiline: true,  hint: 'Seasonal / sourcing note below the menu' },
    ],
  },
  {
    key: 'activities',
    label: 'Activities',
    fields: [
      { key: 'heading',   label: 'Page Heading', multiline: false, hint: 'Main heading on the Activities page' },
      { key: 'introText', label: 'Introduction', multiline: true,  hint: 'Opening paragraph about available activities' },
    ],
  },
] as const;

// ── Shared style tokens ────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.5rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(245,240,232,0.35)',
  marginBottom: '0.375rem',
};

const hintStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.4375rem',
  letterSpacing: '0.08em',
  color: 'rgba(245,240,232,0.2)',
  marginBottom: '0.5rem',
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

// ── Page panel ─────────────────────────────────────────────────────────────────

function PagePanel({
  pageKey,
  fields,
  initialValues,
}: {
  pageKey: string;
  fields: (typeof PAGES)[number]['fields'];
  initialValues: PageFields;
}) {
  const [values, setValues] = useState<PageFields>(() => {
    const init: PageFields = {};
    for (const f of fields) init[f.key] = initialValues[f.key] ?? '';
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);

    const res = await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageKey, fields: values }),
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
      {fields.map(f => (
        <div key={f.key}>
          <label style={labelStyle}>{f.label}</label>
          <span style={hintStyle}>{f.hint}</span>
          {f.multiline ? (
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 100, lineHeight: 1.6 }}
              value={values[f.key]}
              onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
            />
          ) : (
            <input
              style={inputStyle}
              value={values[f.key]}
              onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
            />
          )}
        </div>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.25rem' }}>
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
          {saving ? 'Saving…' : 'Save page'}
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

export function ContentEditor({ initialContent }: Props) {
  const [activePage, setActivePage] = useState<string>(PAGES[0].key);
  const active = PAGES.find(p => p.key === activePage)!;

  return (
    <div style={{ display: 'flex', gap: 0, minHeight: 500 }}>
      {/* Tab sidebar */}
      <div style={{
        width: 140,
        flexShrink: 0,
        borderRight: '1px solid rgba(221,216,206,0.08)',
        paddingRight: 0,
      }}>
        {PAGES.map(page => {
          const isActive = page.key === activePage;
          return (
            <button
              key={page.key}
              onClick={() => setActivePage(page.key)}
              style={{
                display: 'block',
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
            </button>
          );
        })}
      </div>

      {/* Field panel */}
      <div style={{ flex: 1, paddingLeft: '2rem' }}>
        <PagePanel
          key={active.key}
          pageKey={active.key}
          fields={active.fields}
          initialValues={initialContent[active.key] ?? {}}
        />
      </div>
    </div>
  );
}
