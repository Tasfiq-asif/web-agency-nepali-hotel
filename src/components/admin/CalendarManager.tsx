'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Room = { id: string; slug: string; name: string };
type BlockedDate = { id: string; roomId: string | null; date: string; reason: string | null };
type PricingRule = {
  id: string;
  roomId: string;
  startDate: string;
  endDate: string;
  pricePerNight: string;
  label: string | null;
  roomName: string;
};

interface Props {
  rooms: Room[];
  initialBlocks: BlockedDate[];
  initialPricing: PricingRule[];
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getTodayStr(): string {
  const d = new Date();
  return toDateStr(d.getFullYear(), d.getMonth(), d.getDate());
}

function buildCalendarGrid(year: number, month: number): (string | null)[][] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => toDateStr(year, month, i + 1)),
  ];
  while (cells.length < 42) cells.push(null);
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

// ── Style constants (outside component — no recreation on render) ──────────

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
  display: 'block',
  width: '100%',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  color: '#F5F0E8',
  backgroundColor: 'rgba(28,43,26,0.6)',
  border: '1px solid rgba(221,216,206,0.15)',
  borderRadius: '2px',
  padding: '0.5rem 0.625rem',
  outline: 'none',
  boxSizing: 'border-box',
  colorScheme: 'dark',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
};

const navBtnStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.875rem',
  color: 'rgba(245,240,232,0.5)',
  background: 'none',
  border: '1px solid rgba(221,216,206,0.15)',
  borderRadius: '2px',
  padding: '0.25rem 0.75rem',
  cursor: 'pointer',
};

const ghostBtnStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.5625rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(245,240,232,0.4)',
  backgroundColor: 'transparent',
  border: '1px solid rgba(221,216,206,0.15)',
  borderRadius: '2px',
  padding: '0.5rem 0.75rem',
  cursor: 'pointer',
};

const removeBtnStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.5rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(245,240,232,0.28)',
  border: '1px solid rgba(245,240,232,0.1)',
  background: 'none',
  padding: '0.2rem 0.4rem',
  borderRadius: '2px',
  cursor: 'pointer',
  flexShrink: 0,
};

function primaryBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.5625rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: disabled ? 'rgba(28,43,26,0.5)' : '#1C2B1A',
    backgroundColor: disabled ? 'rgba(196,112,79,0.4)' : '#C4704F',
    border: 'none',
    borderRadius: '2px',
    padding: '0.5rem 1rem',
    cursor: disabled ? 'default' : 'pointer',
    transition: 'background-color 0.15s',
  };
}

function tabBtnStyle(active: boolean): React.CSSProperties {
  return {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.5625rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: active ? '#F5F0E8' : 'rgba(245,240,232,0.4)',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: `1px solid ${active ? '#C4704F' : 'transparent'}`,
    marginBottom: '-1px',
    padding: '0.625rem 1.25rem',
    background: 'none',
    cursor: 'pointer',
    transition: 'color 0.15s',
  };
}

const monoSmall: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.5rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(245,240,232,0.35)',
};

// ── Component ───────────────────────────────────────────────────────────────

export function CalendarManager({ rooms, initialBlocks, initialPricing }: Props) {
  const router = useRouter();
  const today = getTodayStr();
  const now = new Date();

  // Tabs
  const [activeTab, setActiveTab] = useState<'blocks' | 'pricing'>('blocks');

  // Calendar navigation
  const [calYear, setCalYear]   = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  // Room filter (for calendar display and block list)
  const [roomFilter, setRoomFilter] = useState<string>('all');

  // Blocked dates state
  const [blocks, setBlocks]           = useState<BlockedDate[]>(initialBlocks);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [blockReason, setBlockReason] = useState('');
  const [blockRoom, setBlockRoom]     = useState<string>('all');
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockError, setBlockError]   = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Seasonal pricing state
  const [pricing, setPricing]         = useState<PricingRule[]>(initialPricing);
  const [priceRoom, setPriceRoom]     = useState('');
  const [priceStart, setPriceStart]   = useState('');
  const [priceEnd, setPriceEnd]       = useState('');
  const [pricePer, setPricePer]       = useState('');
  const [priceLabel, setPriceLabel]   = useState('');
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError]     = useState('');
  const [pricingDeleteLoading, setPricingDeleteLoading] = useState<string | null>(null);

  // ── Calendar helpers ────────────────────────────────────────────

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  }

  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  }

  function toggleDate(dateStr: string) {
    setSelectedDates(prev =>
      prev.includes(dateStr)
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr]
    );
  }

  // Set of blocked date strings visible under current room filter
  const visibleBlockedSet = new Set<string>(
    blocks
      .filter(b => roomFilter === 'all' || b.roomId === null || b.roomId === roomFilter)
      .map(b => b.date)
  );

  // Filtered block list for the sidebar
  const visibleBlocks = blocks
    .filter(b => roomFilter === 'all' || b.roomId === null || b.roomId === roomFilter)
    .sort((a, b) => a.date.localeCompare(b.date));

  const calGrid = buildCalendarGrid(calYear, calMonth);

  // ── Block API calls ──────────────────────────────────────────────

  async function submitBlock() {
    if (selectedDates.length === 0) return;
    setBlockLoading(true);
    setBlockError('');
    try {
      const res = await fetch('/api/admin/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dates: selectedDates,
          roomId: blockRoom === 'all' ? null : blockRoom,
          reason: blockReason.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? 'Failed to block dates');
      }
      const { inserted } = await res.json() as { inserted: BlockedDate[] };
      setBlocks(prev => [...prev, ...inserted]);
      setSelectedDates([]);
      setBlockReason('');
      router.refresh();
    } catch (err) {
      setBlockError(err instanceof Error ? err.message : 'Failed to block dates');
    } finally {
      setBlockLoading(false);
    }
  }

  async function deleteBlock(id: string) {
    setDeleteLoading(id);
    try {
      await fetch(`/api/admin/blocked-dates/${id}`, { method: 'DELETE' });
      setBlocks(prev => prev.filter(b => b.id !== id));
      router.refresh();
    } finally {
      setDeleteLoading(null);
    }
  }

  // ── Pricing API calls ────────────────────────────────────────────

  async function submitPricing() {
    if (!priceRoom || !priceStart || !priceEnd || !pricePer) {
      setPricingError('Room, dates, and price are required');
      return;
    }
    if (priceStart >= priceEnd) {
      setPricingError('End date must be after start date');
      return;
    }
    const price = parseFloat(pricePer);
    if (isNaN(price) || price <= 0) {
      setPricingError('Price must be a positive number');
      return;
    }
    setPricingLoading(true);
    setPricingError('');
    try {
      const res = await fetch('/api/admin/seasonal-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: priceRoom,
          startDate: priceStart,
          endDate: priceEnd,
          pricePerNight: price,
          label: priceLabel.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? 'Failed to save pricing');
      }
      const { rule } = await res.json() as { rule: PricingRule };
      setPricing(prev => [...prev, rule].sort((a, b) => a.startDate.localeCompare(b.startDate)));
      setPriceRoom('');
      setPriceStart('');
      setPriceEnd('');
      setPricePer('');
      setPriceLabel('');
      router.refresh();
    } catch (err) {
      setPricingError(err instanceof Error ? err.message : 'Failed to save pricing');
    } finally {
      setPricingLoading(false);
    }
  }

  async function deletePricing(id: string) {
    setPricingDeleteLoading(id);
    try {
      await fetch(`/api/admin/seasonal-pricing/${id}`, { method: 'DELETE' });
      setPricing(prev => prev.filter(p => p.id !== id));
      router.refresh();
    } finally {
      setPricingDeleteLoading(null);
    }
  }

  // ── Render ───────────────────────────────────────────────────────

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(221,216,206,0.1)', marginBottom: '2rem' }}>
        <button style={tabBtnStyle(activeTab === 'blocks')} onClick={() => setActiveTab('blocks')}>
          Blocked Dates
        </button>
        <button style={tabBtnStyle(activeTab === 'pricing')} onClick={() => setActiveTab('pricing')}>
          Seasonal Pricing
        </button>
      </div>

      {/* ─── BLOCKED DATES TAB ─────────────────────────────────── */}
      {activeTab === 'blocks' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>

          {/* Left: Calendar */}
          <div>
            {/* Controls row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <select
                value={roomFilter}
                onChange={e => setRoomFilter(e.target.value)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#F5F0E8',
                  backgroundColor: 'rgba(28,43,26,0.9)',
                  border: '1px solid rgba(221,216,206,0.15)',
                  borderRadius: '2px',
                  padding: '0.375rem 0.625rem',
                  outline: 'none',
                  cursor: 'pointer',
                  colorScheme: 'dark',
                }}
              >
                <option value="all">All Rooms</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={prevMonth} style={navBtnStyle}>←</button>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: '1.125rem',
                  color: '#F5F0E8',
                  minWidth: 190,
                  textAlign: 'center',
                  display: 'block',
                }}>
                  {MONTH_NAMES[calMonth]} {calYear}
                </span>
                <button onClick={nextMonth} style={navBtnStyle}>→</button>
              </div>
            </div>

            {/* Day name headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.25rem' }}>
              {DAY_NAMES.map(d => (
                <div key={d} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.4375rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,240,232,0.3)',
                  textAlign: 'center',
                  paddingBottom: '0.5rem',
                }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{
              border: '1px solid rgba(221,216,206,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              {calGrid.map((week, wi) => (
                <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                  {week.map((dateStr, di) => {
                    const borderRight  = di < 6 ? '1px solid rgba(221,216,206,0.05)' : 'none';
                    const borderBottom = wi < calGrid.length - 1 ? '1px solid rgba(221,216,206,0.05)' : 'none';

                    if (!dateStr) {
                      return (
                        <div
                          key={di}
                          style={{
                            height: 48,
                            backgroundColor: 'rgba(28,43,26,0.25)',
                            borderRight,
                            borderBottom,
                          }}
                        />
                      );
                    }

                    const isToday    = dateStr === today;
                    const isSelected = selectedDates.includes(dateStr);
                    const isBlocked  = visibleBlockedSet.has(dateStr);
                    const dayNum     = parseInt(dateStr.split('-')[2], 10);

                    return (
                      <button
                        key={di}
                        onClick={() => toggleDate(dateStr)}
                        style={{
                          position: 'relative',
                          height: 48,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.6875rem',
                          fontWeight: isToday ? 500 : 400,
                          color: isSelected
                            ? '#1C2B1A'
                            : isBlocked
                              ? '#C4704F'
                              : isToday
                                ? '#F5F0E8'
                                : 'rgba(245,240,232,0.6)',
                          backgroundColor: isSelected
                            ? '#C4704F'
                            : isBlocked
                              ? 'rgba(196,112,79,0.12)'
                              : 'transparent',
                          border: 'none',
                          borderRight,
                          borderBottom,
                          cursor: 'pointer',
                          transition: 'background-color 0.1s, color 0.1s',
                          outline: 'none',
                        }}
                      >
                        {/* Today dot */}
                        {isToday && !isSelected && !isBlocked && (
                          <span style={{
                            position: 'absolute',
                            bottom: 5,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 3,
                            height: 3,
                            borderRadius: '50%',
                            backgroundColor: '#C4704F',
                          }} />
                        )}
                        {/* Blocked indicator */}
                        {isBlocked && !isSelected && (
                          <span style={{
                            position: 'absolute',
                            top: 3,
                            right: 4,
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.4375rem',
                            color: 'rgba(196,112,79,0.55)',
                            lineHeight: 1,
                          }}>
                            ×
                          </span>
                        )}
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.875rem' }}>
              {[
                { label: 'Selected',  bg: '#C4704F',               dot: false },
                { label: 'Blocked',   bg: 'rgba(196,112,79,0.12)', dot: false },
                { label: 'Today',     bg: 'transparent',            dot: true },
              ].map(({ label, bg, dot }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: 2,
                    backgroundColor: bg,
                    border: '1px solid rgba(221,216,206,0.15)',
                    position: 'relative',
                    flexShrink: 0,
                  }}>
                    {dot && (
                      <span style={{
                        position: 'absolute',
                        bottom: 2, left: '50%',
                        transform: 'translateX(-50%)',
                        width: 3, height: 3,
                        borderRadius: '50%',
                        backgroundColor: '#C4704F',
                      }} />
                    )}
                  </div>
                  <span style={{ ...monoSmall, fontSize: '0.4375rem' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Action panel */}
          <div>
            {/* Block form */}
            <div style={{
              border: '1px solid rgba(221,216,206,0.1)',
              borderRadius: '2px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}>
              <p style={{ ...monoSmall, marginBottom: '1rem' }}>Block dates</p>

              {selectedDates.length === 0 ? (
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  color: 'rgba(245,240,232,0.3)',
                  lineHeight: 1.6,
                }}>
                  Click dates on the calendar to select them.
                </p>
              ) : (
                <>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.08em',
                    color: '#C4704F',
                    marginBottom: '1rem',
                  }}>
                    {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
                  </p>

                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={labelStyle}>Apply to</label>
                    <select value={blockRoom} onChange={e => setBlockRoom(e.target.value)} style={selectStyle}>
                      <option value="all">All Rooms (Property-wide)</option>
                      {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Reason (optional)</label>
                    <input
                      type="text"
                      value={blockReason}
                      onChange={e => setBlockReason(e.target.value)}
                      placeholder="e.g. Maintenance, Owner stay"
                      style={inputStyle}
                    />
                  </div>

                  {blockError && (
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5625rem',
                      color: '#C4704F',
                      marginBottom: '0.75rem',
                    }}>
                      {blockError}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={submitBlock} disabled={blockLoading} style={primaryBtnStyle(blockLoading)}>
                      {blockLoading ? '···' : `Block ${selectedDates.length} date${selectedDates.length !== 1 ? 's' : ''}`}
                    </button>
                    <button onClick={() => setSelectedDates([])} style={ghostBtnStyle}>
                      Clear
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Existing blocks list */}
            <div>
              <p style={{ ...monoSmall, marginBottom: '0.75rem' }}>
                {visibleBlocks.length} blocked date{visibleBlocks.length !== 1 ? 's' : ''}
                {roomFilter !== 'all' && (
                  <span style={{ color: 'rgba(245,240,232,0.25)' }}>
                    {' · '}{rooms.find(r => r.id === roomFilter)?.name ?? ''}
                  </span>
                )}
              </p>

              {visibleBlocks.length === 0 ? (
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  color: 'rgba(245,240,232,0.25)',
                }}>
                  No blocked dates.
                </p>
              ) : (
                <div style={{
                  border: '1px solid rgba(221,216,206,0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  {visibleBlocks.map((block, i) => {
                    const roomName = block.roomId
                      ? (rooms.find(r => r.id === block.roomId)?.name ?? block.roomId)
                      : 'All Rooms';
                    return (
                      <div
                        key={block.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(28,43,26,0.3)',
                          borderBottom: i < visibleBlocks.length - 1 ? '1px solid rgba(221,216,206,0.06)' : 'none',
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <p style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6875rem',
                            color: '#F5F0E8',
                          }}>
                            {block.date}
                          </p>
                          <p style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.4375rem',
                            letterSpacing: '0.08em',
                            color: 'rgba(245,240,232,0.3)',
                            marginTop: '0.125rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {roomName}{block.reason ? ` · ${block.reason}` : ''}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteBlock(block.id)}
                          disabled={deleteLoading === block.id}
                          style={{
                            ...removeBtnStyle,
                            color: deleteLoading === block.id
                              ? 'rgba(245,240,232,0.15)'
                              : removeBtnStyle.color,
                          }}
                        >
                          {deleteLoading === block.id ? '···' : 'Remove'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── SEASONAL PRICING TAB ──────────────────────────────── */}
      {activeTab === 'pricing' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* Left: Add form */}
          <div style={{
            border: '1px solid rgba(221,216,206,0.1)',
            borderRadius: '2px',
            padding: '1.25rem',
          }}>
            <p style={{ ...monoSmall, marginBottom: '1rem' }}>Add pricing override</p>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Room *</label>
              <select value={priceRoom} onChange={e => setPriceRoom(e.target.value)} style={selectStyle}>
                <option value="">Select room</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Start date *</label>
                <input type="date" value={priceStart} onChange={e => setPriceStart(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>End date *</label>
                <input type="date" value={priceEnd} onChange={e => setPriceEnd(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Price / night (USD) *</label>
              <input
                type="number"
                min="1"
                step="1"
                value={pricePer}
                onChange={e => setPricePer(e.target.value)}
                placeholder="e.g. 180"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Label (optional)</label>
              <input
                type="text"
                value={priceLabel}
                onChange={e => setPriceLabel(e.target.value)}
                placeholder="e.g. Peak Season, Monsoon"
                style={inputStyle}
              />
            </div>

            {pricingError && (
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                color: '#C4704F',
                marginBottom: '0.75rem',
              }}>
                {pricingError}
              </p>
            )}

            <button onClick={submitPricing} disabled={pricingLoading} style={primaryBtnStyle(pricingLoading)}>
              {pricingLoading ? '···' : 'Add override'}
            </button>
          </div>

          {/* Right: Pricing table */}
          <div>
            <p style={{ ...monoSmall, marginBottom: '0.75rem' }}>
              {pricing.length} pricing rule{pricing.length !== 1 ? 's' : ''}
            </p>

            {pricing.length === 0 ? (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                color: 'rgba(245,240,232,0.25)',
              }}>
                No seasonal pricing rules yet. Base room prices apply year-round.
              </p>
            ) : (
              <div style={{
                border: '1px solid rgba(221,216,206,0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}>
                {/* Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr 72px 1fr 70px',
                  gap: '0.5rem',
                  padding: '0.625rem 1rem',
                  backgroundColor: 'rgba(28,43,26,0.8)',
                  borderBottom: '1px solid rgba(221,216,206,0.1)',
                }}>
                  {['Room', 'Start', 'End', '$/Nt', 'Label', ''].map(h => (
                    <span key={h} style={monoSmall}>{h}</span>
                  ))}
                </div>

                {/* Rows */}
                {pricing.map((rule, i) => (
                  <div
                    key={rule.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.5fr 1fr 1fr 72px 1fr 70px',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(28,43,26,0.3)',
                      borderBottom: i < pricing.length - 1 ? '1px solid rgba(221,216,206,0.06)' : 'none',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      color: '#F5F0E8',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {rule.roomName}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'rgba(245,240,232,0.7)' }}>
                      {rule.startDate}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'rgba(245,240,232,0.7)' }}>
                      {rule.endDate}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#C4704F', fontWeight: 500 }}>
                      ${parseFloat(rule.pricePerNight).toFixed(0)}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5625rem',
                      letterSpacing: '0.06em',
                      color: 'rgba(245,240,232,0.4)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {rule.label ?? '—'}
                    </span>
                    <button
                      onClick={() => deletePricing(rule.id)}
                      disabled={pricingDeleteLoading === rule.id}
                      style={{
                        ...removeBtnStyle,
                        color: pricingDeleteLoading === rule.id
                          ? 'rgba(245,240,232,0.15)'
                          : removeBtnStyle.color,
                      }}
                    >
                      {pricingDeleteLoading === rule.id ? '···' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
