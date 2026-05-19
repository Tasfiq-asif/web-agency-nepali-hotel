'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AvailabilityCalendar, type DateRange } from '@/components/ui/AvailabilityCalendar';
import { ROOMS as STATIC_ROOMS, type Room } from '@/data/rooms';

// ── Color tokens ───────────────────────────────────────────────────────────────
const C = {
  terracotta: 'var(--color-accent)',
  ink:        'var(--color-ink)',
  canvas:     'var(--color-canvas)',
  hairline:   'var(--color-hairline)',
  muted:      'var(--color-text-secondary)',
  dark:       'var(--color-surface-dark)',
  inverse:    'var(--color-text-inverse)',
} as const;

// ── Right panel slideshow images ───────────────────────────────────────────────
const SLIDESHOW = [
  '/images/gallery/mountain-vista.webp',
  '/images/gallery/suite-himalayan-views.webp',
  '/images/gallery/sunrise-trek.webp',
  '/images/gallery/evening-gathering.webp',
];

// ── Types ──────────────────────────────────────────────────────────────────────
interface BookingData {
  checkIn:         Date | null;
  checkOut:        Date | null;
  roomSlug:        string | null;
  adults:          number;
  children:        number;
  fullName:        string;
  email:           string;
  phone:           string;
  nationality:     string;
  specialRequests: string;
}

export interface Props {
  initialRoom?: string;
}

// ── Pure helpers ───────────────────────────────────────────────────────────────
function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function countNights(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}
function fmtLong(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
}
function fmtShort(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const STEPS = [
  { n: '01', label: 'Dates' },
  { n: '02', label: 'Room' },
  { n: '03', label: 'Details' },
  { n: '04', label: 'Confirm' },
];

const TEXT_FIELDS = [
  { id: 'fullName'    as const, label: 'Full Name',     type: 'text',  required: true,  ph: 'As it appears on your passport' },
  { id: 'email'       as const, label: 'Email Address', type: 'email', required: true,  ph: "We'll send your confirmation here" },
  { id: 'phone'       as const, label: 'Phone Number',  type: 'tel',   required: true,  ph: '+1 000 000 0000' },
  { id: 'nationality' as const, label: 'Nationality',   type: 'text',  required: false, ph: 'Optional' },
];

// ── Responsive hook — breakpoint matches split-panel activation ────────────────
function useMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function BookingForm({ initialRoom }: Props) {
  const isMobile = useMobile();

  const [step,        setStep]        = useState(1);
  const [submitted,   setSubmitted]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingId,   setBookingId]   = useState<string | null>(null);
  const [focused,     setFocused]     = useState<string | null>(null);
  const [avail,       setAvail]       = useState<Record<string, boolean | null>>({});
  const [slideIndex,  setSlideIndex]  = useState(0);
  const [rooms,       setRooms]       = useState<Room[]>(STATIC_ROOMS);

  useEffect(() => {
    fetch('/api/rooms')
      .then(r => r.json() as Promise<{ rooms: Room[] }>)
      .then(json => { if (json.rooms?.length) setRooms(json.rooms); })
      .catch(() => {});
  }, []);

  const [data, setData] = useState<BookingData>({
    checkIn:         null,
    checkOut:        null,
    roomSlug:        initialRoom ?? null,
    adults:          2,
    children:        0,
    fullName:        '',
    email:           '',
    phone:           '',
    nationality:     '',
    specialRequests: '',
  });

  // ── Slideshow cycling (desktop only) ─────────────────────────────────────────
  useEffect(() => {
    if (isMobile) return;
    const id = setInterval(() => setSlideIndex(i => (i + 1) % SLIDESHOW.length), 4000);
    return () => clearInterval(id);
  }, [isMobile]);

  // ── Fetch all rooms' availability when entering Step 2 ────────────────────────
  useEffect(() => {
    if (step !== 2 || !data.checkIn || !data.checkOut) return;

    const from = toISO(data.checkIn);
    const to   = toISO(data.checkOut);

    setAvail(Object.fromEntries(rooms.map(r => [r.slug, null])));

    Promise.all(
      rooms.map(async room => {
        try {
          const p    = new URLSearchParams({ roomSlug: room.slug, from, to });
          const res  = await fetch(`/api/availability?${p}`);
          const json = await res.json();
          const blocked: string[] = Array.isArray(json.blocked) ? json.blocked : [];
          return { slug: room.slug, ok: !blocked.some(d => d >= from && d < to) };
        } catch {
          return { slug: room.slug, ok: true };
        }
      }),
    ).then(results => {
      setAvail(Object.fromEntries(results.map(r => [r.slug, r.ok])));
    });
  }, [step, data.checkIn, data.checkOut]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleDateSelect = useCallback((range: DateRange) => {
    setData(d => ({ ...d, checkIn: range.checkIn, checkOut: range.checkOut }));
  }, []);

  function setRoomSlug(slug: string) {
    setData(d => ({ ...d, roomSlug: slug }));
  }

  function setTextField(
    field: 'fullName' | 'email' | 'phone' | 'nationality' | 'specialRequests',
    value: string,
  ) {
    setData(d => ({ ...d, [field]: value }));
  }

  function adjustGuests(field: 'adults' | 'children', delta: number) {
    const [min, max] = field === 'adults' ? [1, 10] : [0, 6];
    setData(d => ({ ...d, [field]: Math.max(min, Math.min(max, (d[field] as number) + delta)) }));
  }

  async function handleSubmit() {
    if (!data.checkIn || !data.checkOut || !data.roomSlug) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/bookings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          checkIn:         toISO(data.checkIn),
          checkOut:        toISO(data.checkOut),
          roomSlug:        data.roomSlug,
          adults:          data.adults,
          children:        data.children,
          fullName:        data.fullName,
          email:           data.email,
          phone:           data.phone,
          nationality:     data.nationality,
          specialRequests: data.specialRequests,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(
          (json as { error?: string }).error ??
          'Unable to submit. Please try again or email us directly.'
        );
      }
      const json = await res.json();
      setBookingId((json as { id: string }).id ?? null);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Derived ───────────────────────────────────────────────────────────────────
  const step1Valid = !!(data.checkIn && data.checkOut);
  const step2Valid = !!data.roomSlug;
  const step3Valid =
    data.fullName.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(data.email) &&
    data.phone.trim().length > 5;

  const hasDates     = step1Valid;
  const selectedRoom = data.roomSlug ? (rooms.find(r => r.slug === data.roomSlug) ?? null) : null;
  const nights       = data.checkIn && data.checkOut ? countNights(data.checkIn, data.checkOut) : 0;
  const totalPrice   = selectedRoom ? selectedRoom.pricePerNight * nights : 0;

  // ── Heading style ─────────────────────────────────────────────────────────────
  const headingStyle: React.CSSProperties = {
    fontFamily:   'var(--font-display)',
    fontSize:     isMobile ? 'clamp(2rem,7vw,3rem)' : 'var(--text-display-md)',
    fontWeight:   400,
    lineHeight:   1.1,
    marginBottom: isMobile ? 'clamp(1.25rem,3vw,2.25rem)' : '1.25rem',
  };

  // ── Success state ─────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{
        minHeight:      '100vh',
        paddingTop:     72,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 520, padding: '2rem var(--container-px)' }}>
          <div style={{
            width:          52,
            height:         52,
            borderRadius:   '50%',
            border:         `1px solid ${C.terracotta}`,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            margin:         '0 auto 2rem',
            fontFamily:     'var(--font-display)',
            fontSize:       '1.5rem',
            color:          C.terracotta,
          }}>
            ✓
          </div>
          <p className="label" style={{ color: C.terracotta, marginBottom: '1rem' }}>Enquiry Received</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display-md)', fontWeight: 400, lineHeight: 1.15, marginBottom: '1.5rem' }}>
            We&rsquo;ll confirm your stay<br />within 4 hours.
          </h2>
          {bookingId && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, marginBottom: '1.5rem' }}>
              Reference: <strong style={{ color: C.ink }}>{bookingId.slice(0, 8).toUpperCase()}</strong>
            </p>
          )}
          <p style={{ color: C.muted, fontSize: 'var(--text-body)', lineHeight: 1.7, marginBottom: '2rem' }}>
            A confirmation has been sent to{' '}
            <strong style={{ color: C.ink }}>{data.email}</strong>.{' '}
            Our team reviews every enquiry personally and will reach out with availability confirmation and payment details.
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'var(--text-display-sm)', color: C.terracotta }}>
            Mountain Nest Hotel
          </p>
        </div>
      </div>
    );
  }

  // ── Step indicator ────────────────────────────────────────────────────────────
  const current = STEPS[step - 1];

  const stepIndicator = isMobile ? (
    /* Mobile: segmented progress bar + compact label */
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted }}>
          {current.n} · {current.label}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', color: C.muted }}>
          {step} / {STEPS.length}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 2, background: step > i ? C.terracotta : C.hairline, transition: 'background 0.35s ease' }} />
        ))}
      </div>
    </div>
  ) : (
    /* Desktop: 4-node horizontal track */
    <div style={{ display: 'flex' }}>
      {STEPS.map((s, i) => {
        const active = step === i + 1;
        const done   = step > i + 1;
        return (
          <div key={s.n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{ width: '100%', height: 2, background: active ? C.terracotta : done ? C.ink : C.hairline, transition: 'background 0.35s ease', marginBottom: '0.5rem' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: active ? C.terracotta : done ? C.ink : C.muted }}>
              {done ? '✓' : s.n}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', textTransform: 'uppercase', color: active || done ? C.ink : C.muted, opacity: !active && !done ? 0.45 : 1 }}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );

  // ── Nav row ───────────────────────────────────────────────────────────────────
  function NavRow({
    canContinue,
    onContinue,
    onBack,
    label = 'Continue',
    isSubmit = false,
  }: {
    canContinue: boolean;
    onContinue:  () => void;
    onBack?:     () => void;
    label?:      string;
    isSubmit?:   boolean;
  }) {
    const continueBtn = (
      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue || (isSubmit && submitting)}
        className="btn-wipe"
        style={{
          width:         isMobile ? '100%' : 'auto',
          padding:       isMobile ? '1.125rem 2rem' : '1rem 2.5rem',
          border:        `1px solid ${canContinue ? C.terracotta : C.hairline}`,
          background:    'transparent',
          cursor:        canContinue ? (isSubmit && submitting ? 'wait' : 'pointer') : 'not-allowed',
          fontFamily:    'var(--font-mono)',
          fontSize:      'var(--text-button)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color:         canContinue ? C.terracotta : C.muted,
          opacity:       canContinue ? (isSubmit && submitting ? 0.6 : 1) : 0.45,
          transition:    'color 0.42s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {isSubmit && submitting ? 'Sending ···' : label}
      </button>
    );

    if (isMobile) {
      return (
        <div style={{ marginTop: 'clamp(2rem,5vw,3rem)', paddingTop: '1.5rem', borderTop: `1px solid ${C.hairline}` }}>
          {onBack && (
            <button type="button" onClick={onBack}
              style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, marginBottom: '1rem', padding: 0 }}>
              ← Back
            </button>
          )}
          {continueBtn}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: onBack ? 'space-between' : 'flex-end' }}>
        {onBack && (
          <button type="button" onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, textDecoration: 'underline', textDecorationColor: C.hairline }}>
            ← Back
          </button>
        )}
        {continueBtn}
      </div>
    );
  }

  // ── Room card ─────────────────────────────────────────────────────────────────
  function RoomCard({ room }: { room: Room }) {
    const selected    = data.roomSlug === room.slug;
    const roomAvail   = avail[room.slug];
    const unavailable = roomAvail === false;
    const loading     = roomAvail === null;
    const availColor  = loading ? C.muted : unavailable ? '#B85E40' : '#3D6B3D';
    const availLabel  = loading ? '···' : unavailable ? 'Unavailable' : 'Available';

    return (
      <button
        type="button"
        onClick={() => !unavailable && setRoomSlug(room.slug)}
        disabled={unavailable}
        style={{
          display:       'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems:    'stretch',
          border:        `1px solid ${selected ? C.terracotta : C.hairline}`,
          background:    selected ? 'rgba(196,112,79,0.04)' : C.canvas,
          cursor:        unavailable ? 'not-allowed' : 'pointer',
          opacity:       unavailable ? 0.4 : 1,
          textAlign:     'left',
          padding:       0,
          transition:    'border-color 0.2s ease, background 0.2s ease',
          overflow:      'hidden',
          position:      'relative',
        }}
      >
        {selected && (
          <div style={
            isMobile
              ? { position: 'absolute', left: 0, right: 0, top: 0, height: 3, background: C.terracotta }
              : { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: C.terracotta }
          } />
        )}

        {isMobile ? (
          <div style={{ width: '100%', aspectRatio: '3/2', position: 'relative', overflow: 'hidden' }}>
            <Image src={room.imageSrc} alt={room.name} fill sizes="100vw" style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 12, right: 12, padding: '0.25rem 0.625rem', background: unavailable ? 'rgba(28,43,26,0.75)' : 'rgba(28,43,26,0.7)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: loading ? 'rgba(245,240,232,0.6)' : unavailable ? '#E8967A' : '#A8CCA8' }}>
              {availLabel}
            </div>
          </div>
        ) : (
          <div style={{ width: 120, minHeight: 96, flexShrink: 0, position: 'relative' }}>
            <Image src={room.imageSrc} alt={room.name} fill sizes="120px" style={{ objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ flex: 1, padding: isMobile ? '1rem 1.125rem 1.125rem' : '0.875rem 1.125rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-body-lg)', color: C.ink, lineHeight: 1.2 }}>
              {room.name}
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-body-lg)', color: selected ? C.terracotta : C.ink, whiteSpace: 'nowrap', lineHeight: 1.2, flexShrink: 0 }}>
              ${room.pricePerNight}
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7em', color: C.muted }}>/night</span>
            </p>
          </div>
          <p style={{ color: C.muted, fontSize: 'var(--text-body-sm)', lineHeight: 1.35 }}>{room.tagline}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted }}>
              Up to {room.maxGuests} guests
            </span>
            {!isMobile && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', textTransform: 'uppercase', color: availColor }}>
                {availLabel}
              </span>
            )}
            {isMobile && nights > 0 && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', color: selected ? C.terracotta : C.muted }}>
                ${(room.pricePerNight * nights).toLocaleString()} est.
              </span>
            )}
          </div>
        </div>
      </button>
    );
  }

  // ── Step bodies (content without nav row) ─────────────────────────────────────
  const step1Body = (
    <div style={{ width: '100%', minWidth: 0 }}>
      <p className="label" style={{ marginBottom: '0.75rem' }}>Step 01</p>
      <h2 style={headingStyle}>Choose your dates</h2>
      <AvailabilityCalendar
        onSelect={handleDateSelect}
        initialCheckIn={data.checkIn ?? undefined}
        initialCheckOut={data.checkOut ?? undefined}
      />
    </div>
  );

  const step2Body = (
    <div>
      <p className="label" style={{ marginBottom: '0.75rem' }}>Step 02</p>
      <h2 style={{ ...headingStyle, marginBottom: '0.625rem' }}>Select your room</h2>
      {data.checkIn && data.checkOut && (
        <p style={{ color: C.muted, marginBottom: isMobile ? '1.25rem' : 'clamp(1.5rem,3vw,2rem)', fontSize: 'var(--text-body-sm)' }}>
          {fmtShort(data.checkIn)} → {fmtShort(data.checkOut)} &middot; {nights} {nights === 1 ? 'night' : 'nights'}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '0.75rem' }}>
        {rooms.map(room => <RoomCard key={room.slug} room={room} />)}
      </div>
    </div>
  );

  const step3Body = (
    <div>
      <p className="label" style={{ marginBottom: '0.75rem' }}>Step 03</p>
      <h2 style={headingStyle}>Your details</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1.5rem' : '1.875rem' }}>
        {TEXT_FIELDS.map(({ id, label, type, required, ph }) => (
          <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor={id} className="label" style={{ color: C.muted }}>
              {label}
              {required && <span style={{ color: C.terracotta, marginLeft: 2 }}> *</span>}
            </label>
            <input
              id={id}
              type={type}
              value={data[id] as string}
              onChange={e => setTextField(id, e.target.value)}
              onFocus={() => setFocused(id)}
              onBlur={() => setFocused(null)}
              placeholder={ph}
              style={{
                display:          'block',
                width:            '100%',
                padding:          isMobile ? '0.875rem 0' : '0.625rem 0',
                background:       'none',
                border:           'none',
                borderBottom:     `1px solid ${focused === id ? C.terracotta : C.hairline}`,
                fontFamily:       'var(--font-body)',
                fontSize:         isMobile ? 'var(--text-body-lg)' : 'var(--text-body)',
                color:            C.ink,
                outline:          'none',
                transition:       'border-color 0.2s ease',
                WebkitAppearance: 'none',
              }}
            />
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '1.5rem' : '2rem' }}>
          {([
            { field: 'adults'   as const, label: 'Adults',   min: 1 },
            { field: 'children' as const, label: 'Children', min: 0 },
          ]).map(({ field, label, min }) => (
            <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span className="label" style={{ color: C.muted }}>{label}</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button type="button" onClick={() => adjustGuests(field, -1)} disabled={data[field] <= min} aria-label={`Decrease ${label}`}
                  style={{ width: isMobile ? 48 : 40, height: isMobile ? 48 : 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.hairline}`, background: 'none', cursor: data[field] <= min ? 'not-allowed' : 'pointer', opacity: data[field] <= min ? 0.3 : 1, fontSize: '1.25rem', color: C.ink, flexShrink: 0 }}>
                  −
                </button>
                <div style={{ flex: 1, height: isMobile ? 48 : 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: `1px solid ${C.hairline}`, borderBottom: `1px solid ${C.hairline}`, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-lg)', color: C.ink, minWidth: 44 }}>
                  {data[field]}
                </div>
                <button type="button" onClick={() => adjustGuests(field, 1)} aria-label={`Increase ${label}`}
                  style={{ width: isMobile ? 48 : 40, height: isMobile ? 48 : 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.hairline}`, background: 'none', cursor: 'pointer', fontSize: '1.25rem', color: C.ink, flexShrink: 0 }}>
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label htmlFor="specialRequests" className="label" style={{ color: C.muted }}>Special Requests</label>
          <textarea
            id="specialRequests"
            value={data.specialRequests}
            onChange={e => setTextField('specialRequests', e.target.value)}
            onFocus={() => setFocused('specialRequests')}
            onBlur={() => setFocused(null)}
            placeholder="Dietary requirements, anniversary preparations, early check-in..."
            rows={isMobile ? 3 : 4}
            style={{ display: 'block', width: '100%', padding: isMobile ? '0.875rem 0' : '0.625rem 0', background: 'none', border: 'none', borderBottom: `1px solid ${focused === 'specialRequests' ? C.terracotta : C.hairline}`, fontFamily: 'var(--font-body)', fontSize: isMobile ? 'var(--text-body-lg)' : 'var(--text-body)', color: C.ink, outline: 'none', resize: 'none', transition: 'border-color 0.2s ease' }}
          />
        </div>
      </div>
    </div>
  );

  const step4Body = (
    <div>
      <p className="label" style={{ marginBottom: '0.75rem' }}>Step 04</p>
      <h2 style={headingStyle}>Confirm your enquiry</h2>
      <div style={{ border: `1px solid ${C.hairline}`, marginBottom: '1.75rem' }}>
        <div style={{ padding: isMobile ? '1rem 1.125rem' : '1.25rem 1.5rem', background: C.dark, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-body-lg)', color: C.inverse, lineHeight: 1.2, marginBottom: '0.2rem' }}>
              {selectedRoom?.name ?? '—'}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)' }}>
              {nights} {nights === 1 ? 'night' : 'nights'}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: isMobile ? 'var(--text-body-lg)' : 'var(--text-display-sm)', color: C.inverse, lineHeight: 1.1 }}>
              ${totalPrice.toLocaleString()}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)' }}>
              Estimated total
            </p>
          </div>
        </div>
        <div style={{ padding: `0 ${isMobile ? '1.125rem' : '1.5rem'}` }}>
          {[
            { label: 'Check-in',  value: data.checkIn  ? fmtLong(data.checkIn)  : '—' },
            { label: 'Check-out', value: data.checkOut ? fmtLong(data.checkOut) : '—' },
            { label: 'Guests', value: `${data.adults} adult${data.adults !== 1 ? 's' : ''}${data.children > 0 ? `, ${data.children} child${data.children !== 1 ? 'ren' : ''}` : ''}` },
            { label: 'Name',  value: data.fullName },
            { label: 'Email', value: data.email },
            { label: 'Phone', value: data.phone },
            ...(data.nationality     ? [{ label: 'Nationality',      value: data.nationality }]     : []),
            ...(data.specialRequests ? [{ label: 'Special Requests', value: data.specialRequests }] : []),
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', paddingBlock: '0.875rem', borderBottom: `1px solid ${C.hairline}` }}>
              <span className="label" style={{ color: C.muted, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-sm)', color: C.ink, textAlign: 'right', lineHeight: 1.45, wordBreak: 'break-word' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p style={{ color: C.muted, fontSize: 'var(--text-body-sm)', lineHeight: 1.65, marginBottom: '1.75rem' }}>
        This is an enquiry, not a confirmed reservation. Our team will review your request and respond within 4 hours with availability confirmation and payment details.
      </p>
      {submitError && (
        <p style={{ color: C.terracotta, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          {submitError}
        </p>
      )}
    </div>
  );

  // ── Right panel (desktop only) ────────────────────────────────────────────────
  const showRoomImage   = step >= 2 && !!selectedRoom;
  const showBlurOverlay = step >= 2 && !selectedRoom;

  const rightPanel = (
    <div style={{ width: '48%', height: '100%', background: C.ink, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
      {/* Image area — 55% of panel height */}
      <div style={{ position: 'relative', flexShrink: 0, height: '55%', overflow: 'hidden' }}>
        {showRoomImage ? (
          <>
            <Image src={selectedRoom!.imageSrc} alt={selectedRoom!.name} fill sizes="48vw" style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.75rem 2.5rem', background: 'linear-gradient(to top, rgba(28,43,26,0.9) 0%, transparent 100%)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.5rem', color: '#F5F0E8', lineHeight: 1.2, marginBottom: '0.25rem' }}>{selectedRoom!.name}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'rgba(245,240,232,0.6)' }}>{selectedRoom!.tagline}</p>
            </div>
          </>
        ) : showBlurOverlay ? (
          <>
            <Image src={SLIDESHOW[0]} alt="" fill sizes="48vw" style={{ objectFit: 'cover', filter: 'blur(8px)', transform: 'scale(1.1)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,43,26,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.5rem', color: 'rgba(245,240,232,0.7)' }}>Choose a room →</p>
            </div>
          </>
        ) : (
          /* Slideshow with CSS crossfade */
          <>
            {SLIDESHOW.map((src, i) => (
              <div key={src} style={{ position: 'absolute', inset: 0, transition: 'opacity 0.8s ease', opacity: i === slideIndex ? 1 : 0 }}>
                <Image src={src} alt="" fill sizes="48vw" style={{ objectFit: 'cover' }} priority={i === 0} />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Summary area — remaining 45% */}
      <div style={{ flex: 1, padding: '1.75rem 2.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {!hasDates ? (
          <div style={{ marginTop: 'auto' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: '0.9375rem', color: 'rgba(245,240,232,0.4)' }}>
              Select dates to begin →
            </p>
          </div>
        ) : (
          <div>
            {([
              { label: 'Check-in',  value: fmtLong(data.checkIn!) },
              { label: 'Check-out', value: fmtLong(data.checkOut!) },
              { label: 'Nights',    value: `${nights} ${nights === 1 ? 'night' : 'nights'}` },
              { label: 'Guests',    value: `${data.adults} adult${data.adults !== 1 ? 's' : ''}${data.children > 0 ? `, ${data.children} child${data.children !== 1 ? 'ren' : ''}` : ''}` },
              { label: 'Room',      value: selectedRoom?.name ?? '— choose a room' },
            ] as const).map(({ label, value }, i, arr) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', paddingBlock: '0.75rem', borderBottom: i < arr.length - 1 ? '1px solid rgba(245,240,232,0.08)' : 'none' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', flexShrink: 0 }}>
                  {label}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-sm)', color: label === 'Room' && !selectedRoom ? 'rgba(245,240,232,0.3)' : '#F5F0E8', textAlign: 'right', lineHeight: 1.4 }}>
                  {value}
                </span>
              </div>
            ))}
            {selectedRoom && nights > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', paddingTop: '1.25rem', marginTop: '0.25rem', borderTop: '1px solid rgba(245,240,232,0.15)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>
                  Estimated Total
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.875rem', color: C.terracotta }}>
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ── Mobile render (single-column, unchanged layout) ───────────────────────────
  if (isMobile) {
    return (
      <div style={{ paddingTop: 'calc(var(--section-gap) + 5rem)', paddingBottom: 'var(--section-gap)', paddingInline: 'var(--container-px)' }}>
        {stepIndicator}
        {step === 1 && (
          <div>
            {step1Body}
            <NavRow canContinue={step1Valid} onContinue={() => setStep(2)} />
          </div>
        )}
        {step === 2 && (
          <div>
            {step2Body}
            <NavRow canContinue={step2Valid} onContinue={() => setStep(3)} onBack={() => setStep(1)} />
          </div>
        )}
        {step === 3 && (
          <div>
            {step3Body}
            <NavRow canContinue={step3Valid} onContinue={() => setStep(4)} onBack={() => setStep(2)} />
          </div>
        )}
        {step === 4 && (
          <div>
            {step4Body}
            <NavRow canContinue={true} onContinue={handleSubmit} onBack={() => setStep(3)} label="Submit Enquiry" isSubmit />
          </div>
        )}
      </div>
    );
  }

  // ── Desktop render — full-viewport split panel ────────────────────────────────
  return (
    <div style={{ display: 'flex', height: '100vh', paddingTop: 72, overflow: 'hidden' }}>
      {/* Left panel: 52% — step indicator pinned top, content scrollable, nav pinned bottom */}
      <div style={{ width: '52%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.canvas, borderRight: `1px solid ${C.hairline}` }}>
        {/* Pinned step indicator */}
        <div style={{ padding: '1.5rem 3rem', flexShrink: 0, borderBottom: `1px solid ${C.hairline}` }}>
          {stepIndicator}
        </div>
        {/* Scrollable step content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0, padding: '2rem 3rem 1rem' }}>
          {step === 1 && step1Body}
          {step === 2 && step2Body}
          {step === 3 && step3Body}
          {step === 4 && step4Body}
        </div>
        {/* Pinned nav footer */}
        <div style={{ flexShrink: 0, padding: '1.5rem 3rem', borderTop: `1px solid ${C.hairline}`, background: C.canvas }}>
          <NavRow
            canContinue={step === 1 ? step1Valid : step === 2 ? step2Valid : step === 3 ? step3Valid : true}
            onContinue={step === 4 ? handleSubmit : () => setStep(step + 1)}
            onBack={step > 1 ? () => setStep(step - 1) : undefined}
            label={step === 4 ? 'Submit Enquiry' : 'Continue'}
            isSubmit={step === 4}
          />
        </div>
      </div>

      {/* Right panel: 48% — hotel imagery + progressive summary */}
      {rightPanel}
    </div>
  );
}
