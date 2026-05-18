import type { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/db';
import { bookings, rooms } from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { BookingRow, BOOKING_ROW_GRID } from '@/components/admin/BookingRow';

export const metadata: Metadata = { title: 'Reservations | Admin' };

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

const PAGE_SIZE = 25;
const VALID_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'cancelled'];

function toStatus(s: string | undefined): BookingStatus | undefined {
  return VALID_STATUSES.includes(s as BookingStatus) ? (s as BookingStatus) : undefined;
}

function nights(checkIn: string, checkOut: string) {
  return Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function getData(statusFilter: BookingStatus | undefined, page: number) {
  const offset = (page - 1) * PAGE_SIZE;

  try {
    const selectFields = {
      id:          bookings.id,
      guestName:   bookings.guestName,
      guestEmail:  bookings.guestEmail,
      roomName:    rooms.name,
      checkIn:     bookings.checkIn,
      checkOut:    bookings.checkOut,
      adults:      bookings.adults,
      children:    bookings.children,
      totalPrice:  bookings.totalPriceUsd,
      status:      bookings.status,
      createdAt:   bookings.createdAt,
    };

    const base = db
      .select(selectFields)
      .from(bookings)
      .innerJoin(rooms, eq(bookings.roomId, rooms.id));

    const baseCount = db.select({ n: count() }).from(bookings);

    const [rows, totalRows, statusCounts] = await Promise.all([
      statusFilter
        ? base.where(eq(bookings.status, statusFilter)).orderBy(desc(bookings.createdAt)).limit(PAGE_SIZE).offset(offset)
        : base.orderBy(desc(bookings.createdAt)).limit(PAGE_SIZE).offset(offset),

      statusFilter
        ? baseCount.where(eq(bookings.status, statusFilter))
        : baseCount,

      db
        .select({ status: bookings.status, n: count() })
        .from(bookings)
        .groupBy(bookings.status),
    ]);

    const counts: Record<string, number> = { all: 0 };
    for (const row of statusCounts) {
      counts[row.status] = Number(row.n);
      counts.all = (counts.all ?? 0) + Number(row.n);
    }

    return {
      rows,
      total: Number(totalRows[0]?.n ?? 0),
      counts,
      dbLive: true,
    };
  } catch {
    return { rows: [], total: 0, counts: { all: 0 }, dbLive: false };
  }
}

const TABS: { label: string; value: string | undefined; key: string }[] = [
  { label: 'All',       value: undefined,    key: 'all' },
  { label: 'Pending',   value: 'pending',    key: 'pending' },
  { label: 'Confirmed', value: 'confirmed',  key: 'confirmed' },
  { label: 'Cancelled', value: 'cancelled',  key: 'cancelled' },
];

const COL_HEADERS = [
  'Guest', 'Room', 'Check-in', 'Check-out', 'Nts', 'Pax', 'Total', 'Status', 'Received', 'Actions',
];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status: statusParam, page: pageParam } = await searchParams;
  const statusFilter = toStatus(statusParam);
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  const { rows, total, counts, dbLive } = await getData(statusFilter, page);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function tabHref(value: string | undefined) {
    if (!value) return '/admin/bookings';
    return `/admin/bookings?status=${value}`;
  }

  function pageHref(p: number) {
    const base = statusFilter ? `?status=${statusFilter}&page=${p}` : `?page=${p}`;
    return `/admin/bookings${base}`;
  }

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: 1300 }}>

      {/* Page header */}
      <div style={{ marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(221,216,206,0.1)' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '2.25rem',
          color: '#F5F0E8',
          lineHeight: 1.1,
          marginBottom: '0.375rem',
        }}>
          Reservations
        </h1>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(245,240,232,0.35)',
        }}>
          {total} {statusFilter ?? 'total'}{total !== 1 ? '' : ''}
          {!dbLive && (
            <span style={{ color: '#C4704F', marginLeft: '1rem' }}>DB OFFLINE</span>
          )}
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex',
        gap: '0',
        marginBottom: '1.5rem',
        borderBottom: '1px solid rgba(221,216,206,0.1)',
      }}>
        {TABS.map(tab => {
          const active = (statusFilter ?? undefined) === tab.value;
          const tabCount = counts[tab.key] ?? 0;
          return (
            <Link
              key={tab.key}
              href={tabHref(tab.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: active ? '#F5F0E8' : 'rgba(245,240,232,0.4)',
                borderBottom: active ? '1px solid #C4704F' : '1px solid transparent',
                marginBottom: '-1px',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
            >
              {tab.label}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                backgroundColor: active ? 'rgba(196,112,79,0.2)' : 'rgba(245,240,232,0.06)',
                color: active ? '#C4704F' : 'rgba(245,240,232,0.3)',
                padding: '0.125rem 0.375rem',
                borderRadius: '2px',
              }}>
                {tabCount}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <div style={{
          border: '1px solid rgba(221,216,206,0.1)',
          borderRadius: '2px',
          padding: '3rem',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'rgba(245,240,232,0.3)' }}>
            No reservations{statusFilter ? ` with status "${statusFilter}"` : ''}.
          </p>
        </div>
      ) : (
        <div style={{ border: '1px solid rgba(221,216,206,0.1)', borderRadius: '2px', overflow: 'hidden' }}>

          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: BOOKING_ROW_GRID,
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            backgroundColor: 'rgba(28,43,26,0.8)',
            borderBottom: '1px solid rgba(221,216,206,0.1)',
          }}>
            {COL_HEADERS.map(h => (
              <span key={h} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(245,240,232,0.3)',
              }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <BookingRow
              key={row.id}
              id={row.id}
              guestName={row.guestName}
              guestEmail={row.guestEmail}
              roomName={row.roomName}
              checkIn={row.checkIn}
              checkOut={row.checkOut}
              nights={nights(row.checkIn, row.checkOut)}
              guests={row.adults + row.children}
              totalPrice={row.totalPrice}
              status={row.status as 'pending' | 'confirmed' | 'cancelled'}
              receivedDate={formatDate(row.createdAt)}
              index={i}
              isLast={i === rows.length - 1}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(221,216,206,0.08)',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(245,240,232,0.3)',
          }}>
            Page {page} of {totalPages} — {total} reservations
          </p>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {page > 1 ? (
              <Link
                href={pageHref(page - 1)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,240,232,0.5)',
                  border: '1px solid rgba(221,216,206,0.15)',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '2px',
                  textDecoration: 'none',
                }}
              >
                ← Prev
              </Link>
            ) : (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(245,240,232,0.15)',
                border: '1px solid rgba(221,216,206,0.06)',
                padding: '0.375rem 0.75rem',
                borderRadius: '2px',
              }}>
                ← Prev
              </span>
            )}

            {page < totalPages ? (
              <Link
                href={pageHref(page + 1)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,240,232,0.5)',
                  border: '1px solid rgba(221,216,206,0.15)',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '2px',
                  textDecoration: 'none',
                }}
              >
                Next →
              </Link>
            ) : (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(245,240,232,0.15)',
                border: '1px solid rgba(221,216,206,0.06)',
                padding: '0.375rem 0.75rem',
                borderRadius: '2px',
              }}>
                Next →
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
