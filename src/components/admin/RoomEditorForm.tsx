'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Room = {
  id: string;
  slug: string;
  name: string;
  description: string;
  maxGuests: number;
  basePriceUsd: string;
  amenities: string[] | null;
  images: { url: string; alt: string }[] | null;
  isActive: boolean;
};

interface Props {
  initialRooms: Room[];
}

// ── Style constants ────────────────────────────────────────────────────────────

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

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 90,
  lineHeight: 1.55,
};

function RoomCard({ room, onSave }: { room: Room; onSave: (updated: Room) => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(room.name);
  const [description, setDescription] = useState(room.description);
  const [maxGuests, setMaxGuests] = useState(String(room.maxGuests));
  const [basePrice, setBasePrice] = useState(room.basePriceUsd);
  const [amenitiesStr, setAmenitiesStr] = useState((room.amenities ?? []).join(', '));
  const [isActive, setIsActive] = useState(room.isActive);

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);

    const amenities = amenitiesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const res = await fetch(`/api/admin/rooms/${room.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        maxGuests: parseInt(maxGuests, 10),
        basePriceUsd: parseFloat(basePrice),
        amenities,
        isActive,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? 'Save failed');
      return;
    }

    setSaved(true);
    onSave(data.room as Room);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{
      border: '1px solid rgba(221,216,206,0.1)',
      borderRadius: 6,
      marginBottom: '0.75rem',
      backgroundColor: 'rgba(0,0,0,0.12)',
      overflow: 'hidden',
    }}>
      {/* Row header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '0.875rem 1rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: isActive ? '#6ea87e' : 'rgba(245,240,232,0.25)',
            backgroundColor: isActive ? 'rgba(110,168,126,0.12)' : 'rgba(245,240,232,0.05)',
            padding: '0.2em 0.5em',
            borderRadius: 3,
          }}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '1.125rem',
            color: '#F5F0E8',
          }}>
            {name}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            color: 'rgba(245,240,232,0.3)',
          }}>
            ${parseFloat(basePrice).toFixed(0)}/night · {maxGuests} guests
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5625rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: open ? '#C4704F' : 'rgba(245,240,232,0.35)',
          transition: 'color 0.15s',
        }}>
          {open ? 'Close' : 'Edit'}
        </span>
      </button>

      {/* Inline editor */}
      {open && (
        <div style={{ padding: '0 1rem 1.25rem', borderTop: '1px solid rgba(221,216,206,0.08)' }}>
          <div style={{ paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            {/* Name */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Room name</label>
              <input
                style={inputStyle}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description</label>
              <textarea
                style={textareaStyle}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Max guests */}
            <div>
              <label style={labelStyle}>Max guests</label>
              <input
                style={inputStyle}
                type="number"
                min={1}
                max={10}
                value={maxGuests}
                onChange={e => setMaxGuests(e.target.value)}
              />
            </div>

            {/* Base price */}
            <div>
              <label style={labelStyle}>Base price (USD/night)</label>
              <input
                style={inputStyle}
                type="number"
                min={0}
                step="0.01"
                value={basePrice}
                onChange={e => setBasePrice(e.target.value)}
              />
            </div>

            {/* Amenities */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Amenities (comma-separated)</label>
              <input
                style={inputStyle}
                value={amenitiesStr}
                onChange={e => setAmenitiesStr(e.target.value)}
                placeholder="Mountain views, Private balcony, En-suite bathroom"
              />
            </div>

            {/* isActive toggle */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <button
                onClick={() => setIsActive(a => !a)}
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: isActive ? '#C4704F' : 'rgba(221,216,206,0.15)',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'background-color 0.2s',
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: 3,
                  left: isActive ? 19 : 3,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: '#F5F0E8',
                  transition: 'left 0.2s',
                }} />
              </button>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(245,240,232,0.5)',
              }}>
                {isActive ? 'Listed on site' : 'Hidden from site'}
              </span>
            </div>

            {/* Actions */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
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
                  padding: '0.5rem 1rem',
                  cursor: saving ? 'default' : 'pointer',
                  transition: 'background-color 0.15s',
                }}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>

              {saved && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#6ea87e',
                }}>
                  Saved
                </span>
              )}
              {error && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#C4704F',
                }}>
                  {error}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function RoomEditorForm({ initialRooms }: Props) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const router = useRouter();

  function handleSave(updated: Room) {
    setRooms(prev => prev.map(r => r.id === updated.id ? updated : r));
    router.refresh();
  }

  if (rooms.length === 0) {
    return (
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.625rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(245,240,232,0.25)',
      }}>
        No rooms found. Seed the database to get started.
      </p>
    );
  }

  return (
    <div>
      {rooms.map(room => (
        <RoomCard key={room.id} room={room} onSave={handleSave} />
      ))}
    </div>
  );
}
