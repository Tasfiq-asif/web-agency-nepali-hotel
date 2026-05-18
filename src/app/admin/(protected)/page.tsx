import type { Metadata } from 'next';
import { db } from '@/db';
import { bookings, rooms } from '@/db/schema';
import { eq, and, gte, desc } from 'drizzle-orm';
import { count } from 'drizzle-orm';

export const metadata: Metadata = { title: 'Dashboard | Admin' };

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:   { bg: 'rgba(139,115,85,0.25)',  color: '#C9A97A' },
  confirmed: { bg: 'rgba(196,112,79,0.25)',  color: '#E08A65' },
  cancelled: { bg: 'rgba(245,240,232,0.08)', color: 'rgba(245,240,232,0.35)' },
};

async function getDashboardData() {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);

    const [[pendingRow], [confirmedMonthRow], [totalRow], recent] = await Promise.all([
      db.select({ n: count() }).from(bookings).where(eq(bookings.status, 'pending')),
      db.select({ n: count() }).from(bookings).where(
        and(eq(bookings.status, 'confirmed'), gte(bookings.checkIn, monthStart))
      ),
      db.select({ n: count() }).from(bookings),
      db.select({
        id:           bookings.id,
        guestName:    bookings.guestName,
        roomName:     rooms.name,
        checkIn:      bookings.checkIn,
        checkOut:     bookings.checkOut,
        adults:       bookings.adults,
        children:     bookings.children,
        totalPrice:   bookings.totalPriceUsd,
        status:       bookings.status,
        createdAt:    bookings.createdAt,
      })
        .from(bookings)
        .innerJoin(rooms, eq(bookings.roomId, rooms.id))
        .orderBy(desc(bookings.createdAt))
        .limit(10),
    ]);

    return {
      pending:        pendingRow?.n ?? 0,
      confirmedMonth: confirmedMonthRow?.n ?? 0,
      total:          totalRow?.n ?? 0,
      recent,
      dbLive: true,
    };
  } catch {
    return { pending: 0, confirmedMonth: 0, total: 0, recent: [], dbLive: false };
  }
}

function nights(checkIn: string, checkOut: string) {
  return Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTs(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const STATS = [
    { label: 'Pending Reservations', value: String(data.pending),        note: 'Awaiting confirmation' },
    { label: 'Confirmed This Month', value: String(data.confirmedMonth), note: 'Check-in this month' },
    { label: 'Total Reservations',   value: String(data.total),          note: 'All time' },
  ];

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: 1100 }}>
      {/* Page header */}
      <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(221,216,206,0.1)' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '2.25rem',
            color: '#F5F0E8',
            lineHeight: 1.1,
            marginBottom: '0.375rem',
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(245,240,232,0.35)',
          }}
        >
          {today}
        </p>
        {!data.dbLive && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', color: '#C4704F', marginTop: '0.5rem' }}>
            DB OFFLINE — showing placeholder data
          </p>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {STATS.map(stat => (
          <div
            key={stat.label}
            style={{
              backgroundColor: 'rgba(28,43,26,0.7)',
              border: '1px solid rgba(221,216,206,0.1)',
              borderRadius: '2px',
              padding: '1.5rem',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(245,240,232,0.4)',
                marginBottom: '0.625rem',
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '2.5rem',
                fontWeight: 300,
                color: '#F5F0E8',
                lineHeight: 1,
                marginBottom: '0.375rem',
              }}
            >
              {stat.value}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: 'rgba(245,240,232,0.3)',
              }}
            >
              {stat.note}
            </p>
          </div>
        ))}
      </div>

      {/* Recent reservations */}
      <div>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(245,240,232,0.4)',
            marginBottom: '1rem',
          }}
        >
          Recent Reservations
        </p>

        {data.recent.length === 0 ? (
          <div
            style={{
              border: '1px solid rgba(221,216,206,0.1)',
              borderRadius: '2px',
              padding: '2.5rem',
              textAlign: 'center',
            }}
          >
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'rgba(245,240,232,0.3)' }}>
              No reservations yet.
            </p>
          </div>
        ) : (
          <div
            style={{
              border: '1px solid rgba(221,216,206,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 110px 110px 60px 100px 80px',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                backgroundColor: 'rgba(28,43,26,0.8)',
                borderBottom: '1px solid rgba(221,216,206,0.1)',
              }}
            >
              {['Guest', 'Room', 'Check-in', 'Check-out', 'Nights', 'Status', 'Received'].map(h => (
                <span
                  key={h}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,240,232,0.3)',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Table rows */}
            {data.recent.map((row, i) => {
              const pill = STATUS_STYLE[row.status] ?? STATUS_STYLE.cancelled;
              const n = nights(row.checkIn, row.checkOut);
              return (
                <div
                  key={row.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 110px 110px 60px 100px 80px',
                    gap: '0.5rem',
                    padding: '0.875rem 1.25rem',
                    backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(28,43,26,0.3)',
                    borderBottom: i < data.recent.length - 1 ? '1px solid rgba(221,216,206,0.06)' : 'none',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#F5F0E8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.guestName}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'rgba(245,240,232,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.roomName}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(245,240,232,0.7)' }}>
                    {formatDate(row.checkIn)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(245,240,232,0.7)' }}>
                    {formatDate(row.checkOut)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)' }}>
                    {n}
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      backgroundColor: pill.bg,
                      color: pill.color,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '2px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.status}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)' }}>
                    {formatTs(row.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
