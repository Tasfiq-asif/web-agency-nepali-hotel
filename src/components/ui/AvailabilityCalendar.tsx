'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface DateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}

interface Props {
  roomSlug?: string;
  onSelect?: (range: DateRange) => void;
  initialCheckIn?: Date;
  initialCheckOut?: Date;
  className?: string;
}

// ── Pure date helpers ──────────────────────────────────────────────────────────

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function isSameDay(a: Date, b: Date): boolean {
  return toISO(a) === toISO(b);
}
function isBefore(a: Date, b: Date): boolean {
  return toISO(a) < toISO(b);
}
function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}
function nightsBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

// ── Constants ──────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const ACCENT       = 'var(--color-accent)';
const ACCENT_LIGHT = 'rgba(196,112,79,0.11)';
const INK          = 'var(--color-ink)';
const CANVAS       = 'var(--color-canvas)';
const HAIRLINE     = 'var(--color-hairline)';
const MUTED        = 'var(--color-text-secondary)';

// ── Component ──────────────────────────────────────────────────────────────────

export function AvailabilityCalendar({
  roomSlug,
  onSelect,
  initialCheckIn,
  initialCheckOut,
  className,
}: Props) {
  const today = useMemo(() => startOfDay(new Date()), []);

  const [viewDate, setViewDate] = useState<Date>(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [checkIn,  setCheckIn]  = useState<Date | null>(initialCheckIn  ?? null);
  const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut ?? null);
  const [hovered,  setHovered]  = useState<Date | null>(null);
  const [blocked,  setBlocked]  = useState<Set<string>>(new Set());

  // rowPx = measured pixel width of one grid column (= row height for square cells)
  const [rowPx, setRowPx] = useState(0);
  const gridWrapRef = useRef<HTMLDivElement>(null);

  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // ── Measure grid width → square row height ─────────────────────────────────
  // gridAutoRows is set to the exact column pixel width so cells are always
  // square. overflow:hidden on each cell then reliably clips the inner circle.

  useEffect(() => {
    const el = gridWrapRef.current;
    if (!el) return;
    const measure = () => setRowPx(Math.floor(el.getBoundingClientRect().width / 7));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Fetch blocked dates ────────────────────────────────────────────────────

  useEffect(() => {
    const from   = toISO(viewDate);
    const toDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 3, 0);
    const to     = toISO(toDate);
    const params = new URLSearchParams({ from, to });
    if (roomSlug) params.set('roomSlug', roomSlug);
    fetch(`/api/availability?${params}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.blocked)) setBlocked(new Set<string>(data.blocked));
      })
      .catch(() => {});
  }, [viewDate, roomSlug]);

  // ── Notify parent ──────────────────────────────────────────────────────────

  useEffect(() => {
    onSelectRef.current?.({ checkIn, checkOut });
  }, [checkIn, checkOut]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const isDisabled = useCallback(
    (day: Date) => isBefore(day, today) || blocked.has(toISO(day)),
    [today, blocked],
  );

  const hasBlockedInRange = useCallback(
    (from: Date, to: Date) => {
      const f = toISO(from);
      const t = toISO(to);
      for (const b of blocked) { if (b > f && b < t) return true; }
      return false;
    },
    [blocked],
  );

  const handleDayClick = useCallback((day: Date) => {
    if (isDisabled(day)) return;
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(startOfDay(day));
      setCheckOut(null);
      return;
    }
    if (isBefore(day, checkIn) || isSameDay(day, checkIn)) {
      setCheckIn(startOfDay(day));
      setCheckOut(null);
      return;
    }
    if (hasBlockedInRange(checkIn, day)) {
      setCheckIn(startOfDay(day));
      setCheckOut(null);
      return;
    }
    setCheckOut(startOfDay(day));
  }, [checkIn, checkOut, isDisabled, hasBlockedInRange]);

  // ── Navigation ─────────────────────────────────────────────────────────────

  const canGoPrev = useMemo(
    () => viewDate.getTime() > new Date(today.getFullYear(), today.getMonth(), 1).getTime(),
    [viewDate, today],
  );
  function prevMonth() { setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)); }
  function nextMonth() { setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)); }

  // ── Grid cells ─────────────────────────────────────────────────────────────

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const cells = useMemo<(Date | null)[]>(() => {
    const offset = firstDayOfMonth(year, month);
    const count  = daysInMonth(year, month);
    const grid: (Date | null)[] = [
      ...Array<null>(offset).fill(null),
      ...Array.from({ length: count }, (_, i) => new Date(year, month, i + 1)),
    ];
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  }, [year, month]);

  const effectiveHovered: Date | null =
    hovered !== null && !blocked.has(toISO(hovered)) ? hovered : null;

  const highlightEnd: Date | null = (() => {
    if (checkOut) return checkOut;
    if (
      checkIn && effectiveHovered !== null &&
      !isBefore(effectiveHovered, checkIn) &&
      !isSameDay(effectiveHovered, checkIn)
    ) return effectiveHovered;
    return null;
  })();

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : null;

  type Role = 'past' | 'blocked' | 'check-in' | 'check-out' | 'in-range' | 'preview' | 'today' | 'default';

  function getDayRole(day: Date): Role {
    const iso = toISO(day);
    if (isBefore(day, today))   return 'past';
    if (blocked.has(iso))       return 'blocked';
    if (checkIn  && isSameDay(day, checkIn))  return 'check-in';
    if (checkOut && isSameDay(day, checkOut)) return 'check-out';
    if (checkIn && checkOut && iso > toISO(checkIn) && iso < toISO(checkOut)) return 'in-range';
    if (checkIn && highlightEnd && !checkOut && iso > toISO(checkIn) && iso < toISO(highlightEnd)) return 'preview';
    if (isSameDay(day, today))  return 'today';
    return 'default';
  }

  // Responsive sizing derived from the measured cell size.
  // All values scale with rowPx so the calendar fills its cells at any width.
  const INDICATOR_PCT  = '80%';
  const numberFontPx   = rowPx > 0 ? Math.max(11, Math.round(rowPx * 0.32)) : 13;
  const labelFontPx    = rowPx > 0 ? Math.max(8,  Math.round(rowPx * 0.16)) : 9;
  const todotSizePx    = rowPx > 0 ? Math.max(2,  Math.round(rowPx * 0.05)) : 3;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className={['cal-root', className].filter(Boolean).join(' ')}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        width: '100%',
        maxWidth: 680,
        marginInline: 'auto',
      }}
      aria-label="Availability calendar"
    >

      {/* ── Month navigation ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
          style={{
            width: 30, height: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none',
            border: `1px solid ${HAIRLINE}`,
            cursor: canGoPrev ? 'pointer' : 'not-allowed',
            opacity: canGoPrev ? 1 : 0.22,
            color: INK,
            fontSize: '0.875rem',
            flexShrink: 0,
          }}
        >←</button>

        <p
          aria-live="polite"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: '1.0625rem',
            color: INK,
            letterSpacing: '-0.01em',
          }}
        >
          {MONTH_NAMES[month]} {year}
        </p>

        <button
          onClick={nextMonth}
          aria-label="Next month"
          style={{
            width: 30, height: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none',
            border: `1px solid ${HAIRLINE}`,
            cursor: 'pointer',
            color: INK,
            fontSize: '0.875rem',
            flexShrink: 0,
          }}
        >→</button>
      </div>

      {/* ── Day-of-week labels ───────────────────────────────────────────── */}
      <div
        role="row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          marginBottom: '0.125rem',
        }}
      >
        {DAY_LABELS.map(d => (
          <div
            key={d}
            role="columnheader"
            aria-label={d}
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: labelFontPx,
              letterSpacing: '0.1em',
              color: MUTED,
              paddingBlock: '0.375rem',
            }}
          >{d}</div>
        ))}
      </div>

      {/* ── Day grid ─────────────────────────────────────────────────────── */}
      {/*
        gridWrapRef measures this div's width. rowPx = floor(width / 7) is
        used as gridAutoRows so every row is exactly one column-width tall
        (square cells). The cell's overflow:hidden then reliably clips the
        inner indicator — it cannot bleed into adjacent rows because the row
        track itself is the exact height we need.
      */}
      <div ref={gridWrapRef}>
        <div
          role="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            // fall back to 48 px before the first ResizeObserver measurement
            gridAutoRows: rowPx > 0 ? rowPx : 48,
          }}
        >
          {cells.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} role="gridcell" aria-hidden />;
            }

            const role          = getDayRole(day);
            const disabled      = role === 'past' || role === 'blocked';
            const isEndpoint    = role === 'check-in' || role === 'check-out';
            const isInHighlight = role === 'in-range' || role === 'preview';

            let cellBg = 'transparent';
            if (isInHighlight) {
              cellBg = ACCENT_LIGHT;
            } else if (role === 'check-in' && highlightEnd) {
              cellBg = `linear-gradient(to right, transparent 50%, ${ACCENT_LIGHT} 50%)`;
            } else if (role === 'check-out') {
              cellBg = `linear-gradient(to left, transparent 50%, ${ACCENT_LIGHT} 50%)`;
            }

            const isHoveredDefault =
              !disabled && !isEndpoint && !isInHighlight &&
              hovered !== null && isSameDay(hovered, day);

            return (
              <div
                key={toISO(day)}
                role="gridcell"
                aria-label={day.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                aria-selected={isEndpoint || isInHighlight}
                aria-disabled={disabled}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => !disabled && setHovered(day)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: cellBg,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // overflow:hidden is the key guard — with gridAutoRows set to
                  // the exact column width, the row track matches the cell
                  // height, so this clips without any bleed into adjacent rows.
                  overflow: 'hidden',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
              >
                {/* Inner square indicator ───────────────────────────────── */}
                {/* width/height both resolve to 76% of rowPx (the square    */}
                {/* cell side-length), giving a true square background fill. */}
                <div
                  style={{
                    width: INDICATOR_PCT,
                    height: INDICATOR_PCT,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    background: isEndpoint
                      ? ACCENT
                      : isHoveredDefault
                        ? 'rgba(28,43,26,0.06)'
                        : 'transparent',
                    transition: 'background 0.14s ease',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: numberFontPx,
                      lineHeight: 1,
                      color: isEndpoint ? CANVAS : (disabled ? MUTED : INK),
                      opacity: role === 'past' ? 0.28 : role === 'blocked' ? 0.4 : 1,
                      textDecoration: role === 'blocked' ? 'line-through' : 'none',
                    }}
                  >
                    {day.getDate()}
                  </span>

                  {role === 'today' && (
                    <span style={{
                      position: 'absolute',
                      bottom: '14%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: todotSizePx, height: todotSizePx,
                      borderRadius: '50%',
                      background: ACCENT,
                    }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Selection summary ────────────────────────────────────────────── */}
      {(checkIn || checkOut) && (
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1.25rem',
          borderTop: `1px solid ${HAIRLINE}`,
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginBottom: 4 }}>
              Check-in
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-display-sm)', color: INK, lineHeight: 1.1 }}>
              {checkIn ? checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
            </p>
          </div>

          {checkIn && (
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-body)', color: HAIRLINE, paddingBottom: '0.2rem' }}>→</span>
          )}

          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginBottom: 4 }}>
              Check-out
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-display-sm)', color: checkOut ? INK : MUTED, lineHeight: 1.1, fontStyle: checkOut ? 'normal' : 'italic' }}>
              {checkOut ? checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'select date'}
            </p>
          </div>

          {nights !== null && (
            <div style={{ marginLeft: 'auto' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginBottom: 4 }}>
                Stay
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-display-sm)', color: ACCENT, lineHeight: 1.1 }}>
                {nights} {nights === 1 ? 'night' : 'nights'}
              </p>
            </div>
          )}
        </div>
      )}

      {(checkIn || checkOut) && (
        <button
          onClick={() => { setCheckIn(null); setCheckOut(null); }}
          style={{
            marginTop: '0.875rem',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: MUTED,
            textDecoration: 'underline',
            textDecorationColor: HAIRLINE,
          }}
        >
          Clear dates
        </button>
      )}
    </div>
  );
}
