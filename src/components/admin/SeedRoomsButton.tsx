'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SeedRoomsButton() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSeed() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Seed failed');
      setDone(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Seed failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        color: 'rgba(245,240,232,0.45)',
        lineHeight: 1.6,
        marginBottom: '1rem',
        maxWidth: 420,
      }}>
        No rooms in the database yet. Seed the 6 default rooms to get started — you can edit them after.
      </p>

      <button
        onClick={handleSeed}
        disabled={loading || done}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5625rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: done ? '#6ea87e' : '#1C2B1A',
          backgroundColor: done ? 'rgba(110,168,126,0.15)' : loading ? 'rgba(196,112,79,0.5)' : '#C4704F',
          border: done ? '1px solid rgba(110,168,126,0.3)' : 'none',
          borderRadius: 4,
          padding: '0.5rem 1.25rem',
          cursor: loading || done ? 'default' : 'pointer',
          transition: 'background-color 0.15s',
        }}
      >
        {done ? 'Seeded — refreshing…' : loading ? 'Seeding…' : 'Seed 6 default rooms'}
      </button>

      {error && (
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#C4704F',
          marginTop: '0.5rem',
        }}>
          {error}
        </p>
      )}
    </div>
  );
}
