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

// ── Pure date helpers (no library needed) ──────────────────────────────────

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
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

function nightsBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

// ── Constants ──────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_INITIALS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// ── Color constants ────────────────────────────────────────────────────────

const TERRACOTTA       = 'var(--color-accent)';
const TERRACOTTA_LIGHT = 'rgba(196,112,79,0.11)';
const INK              = 'var(--color-ink)';
const CANVAS           = 'var(--color-canvas)';
const HAIRLINE         = 'var(--color-hairline)';
const TEXT_SECONDARY   = 'var(--color-text-secondary)';

// ── Component ──────────────────────────────────────────────────────────────

export function AvailabilityCalendar({
  roomSlug,
  onSelect,
  initialCheckIn,
  initialCheckOut,
  className,
}: Props) {
  const today = useMemo(() => startOfDay(new Date()), []);

  const [viewDate, setViewDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn ?? null);
  const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut ?? null);
  const [hovered, setHovered] = useState<Date | null>(null);
  const [blocked, setBlocked] = useState<Set<string>>(new Set());

  // Stable ref to avoid stale closure in effect
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // ── Fetch blocked dates ────────────────────────────────────────────────

  useEffect(() => {
    const from = toISO(viewDate);
    const toDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 3, 0);
    const to = toISO(toDate);

    const params = new URLSearchParams({ from, to });
    if (roomSlug) params.set('roomSlug', roomSlug);

    fetch(`/api/availability?${params}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.blocked)) {
          setBlocked(new Set<string>(data.blocked));
        }
      })
      .catch(() => {});
  }, [viewDate, roomSlug]);

  // ── Notify parent when range changes ──────────────────────────────────

  useEffect(() => {
    onSelectRef.current?.({ checkIn, checkOut });
  }, [checkIn, checkOut]);

  // ── Helpers ───────────────────────────────────────────────────────────

  const isDisabled = useCallback(
    (day: Date) => isBefore(day, today) || blocked.has(toISO(day)),
    [today, blocked],
  );

  const hasBlockedInRange = useCallback(
    (from: Date, to: Date) => {
      const fromISO = toISO(from);
      const toISO_ = toISO(to);
      for (const b of blocked) {
        if (b > fromISO && b < toISO_) return true;
      }
      return false;
    },
    [blocked],
  );

  // ── Click handler ──────────────────────────────────────────────────────

  const handleDayClick = useCallback(
    (day: Date) => {
      if (isDisabled(day)) return;

      // No checkIn, or both already set — start fresh
      if (!checkIn || (checkIn && checkOut)) {
        setCheckIn(startOfDay(day));
        setCheckOut(null);
        return;
      }

      // checkIn set, no checkOut
      if (isBefore(day, checkIn) || isSameDay(day, checkIn)) {
        // Clicked before/on checkIn — treat as a new start
        setCheckIn(startOfDay(day));
        setCheckOut(null);
        return;
      }

      // Blocked date in proposed range → restart
      if (hasBlockedInRange(checkIn, day)) {
        setCheckIn(startOfDay(day));
        setCheckOut(null);
        return;
      }

      setCheckOut(startOfDay(day));
    },
    [checkIn, checkOut, isDisabled, hasBlockedInRange],
  );

  // ── Month navigation ───────────────────────────────────────────────────

  const canGoPrev = useMemo(() => {
    return viewDate.getTime() > new Date(today.getFullYear(), today.getMonth(), 1).getTime();
  }, [viewDate, today]);

  function prevMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function nextMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  // ── Grid cells ─────────────────────────────────────────────────────────

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const cells = useMemo<(Date | null)[]>(() => {
    const offset = firstDayOfMonth(year, month);
    const count = daysInMonth(year, month);
    const grid: (Date | null)[] = [
      ...Array<null>(offset).fill(null),
      ...Array.from({ length: count }, (_, i) => new Date(year, month, i + 1)),
    ];
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  }, [year, month]);

  // Effective end of the range highlight (checkOut, or hover preview)
  const effectiveHovered: Date | null =
    hovered !== null && !blocked.has(toISO(hovered)) ? hovered : null;

  const highlightEnd: Date | null = (() => {
    if (checkOut) return checkOut;
    if (
      checkIn &&
      effectiveHovered !== null &&
      !isBefore(effectiveHovered, checkIn) &&
      !isSameDay(effectiveHovered, checkIn)
    ) {
      return effectiveHovered;
    }
    return null;
  })();

  const nights =
    checkIn && checkOut ? nightsBetween(checkIn, checkOut) : null;

  // ── Day role & styles ──────────────────────────────────────────────────

  type Role =
    | 'past' | 'blocked' | 'check-in' | 'check-out'
    | 'in-range' | 'preview' | 'today' | 'default';

  function getDayRole(day: Date): Role {
    const iso = toISO(day);
    if (isBefore(day, today)) return 'past';
    if (blocked.has(iso)) return 'blocked';
    if (checkIn && isSameDay(day, checkIn)) return 'check-in';
    if (checkOut && isSameDay(day, checkOut)) return 'check-out';
    if (checkIn && checkOut && iso > toISO(checkIn) && iso < toISO(checkOut)) return 'in-range';
    if (checkIn && highlightEnd && !checkOut && iso > toISO(checkIn) && iso < toISO(highlightEnd)) return 'preview';
    if (isSameDay(day, today)) return 'today';
    return 'default';
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div
      className={className}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      aria-label="Availability calendar"
    >

      {/* ── Month header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: `1px solid ${HAIRLINE}`,
            cursor: canGoPrev ? 'pointer' : 'not-allowed',
            opacity: canGoPrev ? 1 : 0.28,
            color: INK,
            fontSize: '1rem',
            flexShrink: 0,
          }}
        >
          ←
        </button>

        <p
          aria-live="polite"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'var(--text-body-lg)',
            color: INK,
            letterSpacing: '-0.01em',
            textAlign: 'center',
          }}
        >
          {MONTH_NAMES[month]} {year}
        </p>

        <button
          onClick={nextMonth}
          aria-label="Next month"
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: `1px solid ${HAIRLINE}`,
            cursor: 'pointer',
            color: INK,
            fontSize: '1rem',
            flexShrink: 0,
          }}
        >
          →
        </button>
      </div>

      {/* ── Day initials row ── */}
      <div
        role="row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          marginBottom: '0.25rem',
        }}
      >
        {DAY_INITIALS.map(d => (
          <div
            key={d}
            role="columnheader"
            aria-label={d}
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-label)',
              letterSpacing: '0.1em',
              color: TEXT_SECONDARY,
              paddingBlock: '0.5rem',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Day grid ── */}
      <div
        role="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
        }}
      >
        {cells.map((day, idx) => {
          if (!day) {
            return (
              <div
                key={`empty-${idx}`}
                role="gridcell"
                aria-hidden
              />
            );
          }

          const role = getDayRole(day);
          const disabled = role === 'past' || role === 'blocked';
          const isEndpoint = role === 'check-in' || role === 'check-out';
          const isInHighlight = role === 'in-range' || role === 'preview';

          // Cell-level range bar (behind the day circle)
          let cellBg = 'transparent';
          if (isInHighlight) {
            cellBg = TERRACOTTA_LIGHT;
          } else if (role === 'check-in' && highlightEnd) {
            // Right half is the range bar; left half is clear
            cellBg = `linear-gradient(to right, transparent 50%, ${TERRACOTTA_LIGHT} 50%)`;
          } else if (role === 'check-out') {
            // Left half is the range bar; right half is clear
            cellBg = `linear-gradient(to left, transparent 50%, ${TERRACOTTA_LIGHT} 50%)`;
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
              style={{
                background: cellBg,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1',
              }}
            >
              {/* Day circle / indicator */}
              <div
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => !disabled && setHovered(day)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: '78%',
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  position: 'relative',
                  // Solid terracotta for selected endpoints
                  background: isEndpoint
                    ? TERRACOTTA
                    : isHoveredDefault
                      ? 'rgba(28,43,26,0.06)'
                      : 'transparent',
                  transition: 'background 0.14s ease',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(0.7rem, 1.1vw, 0.875rem)',
                    lineHeight: 1,
                    color: isEndpoint
                      ? CANVAS
                      : role === 'past'
                        ? TEXT_SECONDARY
                        : role === 'blocked'
                          ? TEXT_SECONDARY
                          : INK,
                    opacity: role === 'past' ? 0.28 : role === 'blocked' ? 0.4 : 1,
                    textDecoration: role === 'blocked' ? 'line-through' : 'none',
                  }}
                >
                  {day.getDate()}
                </span>

                {/* Today dot */}
                {role === 'today' && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '12%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 3,
                      height: 3,
                      borderRadius: '50%',
                      background: TERRACOTTA,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Selection summary ── */}
      {(checkIn || checkOut) && (
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: `1px solid ${HAIRLINE}`,
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          {/* Check-in */}
          <div>
            <p
              className="label"
              style={{ color: TEXT_SECONDARY, marginBottom: 3 }}
            >
              Check-in
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 'var(--text-display-sm)',
                color: INK,
                lineHeight: 1.1,
              }}
            >
              {checkIn
                ? checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : '—'}
            </p>
          </div>

          {checkIn && (
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-body)',
                color: HAIRLINE,
                paddingBottom: '0.2rem',
              }}
            >
              →
            </span>
          )}

          {/* Check-out */}
          <div>
            <p
              className="label"
              style={{ color: TEXT_SECONDARY, marginBottom: 3 }}
            >
              Check-out
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 'var(--text-display-sm)',
                color: checkOut ? INK : TEXT_SECONDARY,
                lineHeight: 1.1,
                fontStyle: checkOut ? 'normal' : 'italic',
              }}
            >
              {checkOut
                ? checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'select date'}
            </p>
          </div>

          {/* Nights count */}
          {nights !== null && (
            <div style={{ marginLeft: 'auto' }}>
              <p
                className="label"
                style={{ color: TEXT_SECONDARY, marginBottom: 3 }}
              >
                Stay
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  fontSize: 'var(--text-display-sm)',
                  color: TERRACOTTA,
                  lineHeight: 1.1,
                }}
              >
                {nights} {nights === 1 ? 'night' : 'nights'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Clear selection */}
      {(checkIn || checkOut) && (
        <button
          onClick={() => {
            setCheckIn(null);
            setCheckOut(null);
          }}
          style={{
            marginTop: '0.875rem',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-label)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: TEXT_SECONDARY,
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
