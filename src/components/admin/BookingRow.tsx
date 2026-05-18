'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

interface BookingRowProps {
  id: string;
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: string | null;
  status: BookingStatus;
  receivedDate: string;
  index: number;
  isLast: boolean;
}

const STATUS_STYLE: Record<BookingStatus, { bg: string; color: string }> = {
  pending:   { bg: 'rgba(139,115,85,0.25)',  color: '#C9A97A' },
  confirmed: { bg: 'rgba(196,112,79,0.25)',  color: '#E08A65' },
  cancelled: { bg: 'rgba(245,240,232,0.08)', color: 'rgba(245,240,232,0.3)' },
};

const GRID = '1.5fr 1fr 100px 100px 48px 56px 80px 90px 80px 130px';

export function BookingRow({
  id,
  guestName,
  guestEmail,
  roomName,
  checkIn,
  checkOut,
  nights,
  guests,
  totalPrice,
  status,
  receivedDate,
  index,
  isLast,
}: BookingRowProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(status);
  const [loading, setLoading] = useState<'confirm' | 'cancel' | null>(null);

  const pill = STATUS_STYLE[currentStatus];

  async function handleAction(action: 'confirm' | 'cancel') {
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json() as { status: BookingStatus };
        setCurrentStatus(data.status);
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: GRID,
        gap: '0.5rem',
        padding: '0.875rem 1.25rem',
        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(28,43,26,0.3)',
        borderBottom: !isLast ? '1px solid rgba(221,216,206,0.06)' : 'none',
        alignItems: 'center',
      }}
    >
      {/* Guest name + email */}
      <div style={{ minWidth: 0 }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: '#F5F0E8',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {guestName}
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5625rem',
          letterSpacing: '0.04em',
          color: 'rgba(245,240,232,0.35)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginTop: '0.125rem',
        }}>
          {guestEmail}
        </p>
      </div>

      {/* Room */}
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.8125rem',
        color: 'rgba(245,240,232,0.6)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {roomName}
      </span>

      {/* Check-in */}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'rgba(245,240,232,0.7)' }}>
        {checkIn}
      </span>

      {/* Check-out */}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'rgba(245,240,232,0.7)' }}>
        {checkOut}
      </span>

      {/* Nights */}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)' }}>
        {nights}
      </span>

      {/* Guests */}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)' }}>
        {guests}
      </span>

      {/* Total */}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(245,240,232,0.7)' }}>
        {totalPrice ? `$${Math.round(parseFloat(totalPrice))}` : '—'}
      </span>

      {/* Status pill */}
      <span style={{
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
      }}>
        {currentStatus}
      </span>

      {/* Received */}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'rgba(245,240,232,0.4)' }}>
        {receivedDate}
      </span>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
        {currentStatus === 'pending' && (
          <button
            onClick={() => handleAction('confirm')}
            disabled={loading !== null}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: loading === 'confirm' ? 'rgba(196,112,79,0.4)' : '#C4704F',
              border: `1px solid ${loading === 'confirm' ? 'rgba(196,112,79,0.25)' : 'rgba(196,112,79,0.45)'}`,
              background: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '2px',
              cursor: loading !== null ? 'default' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {loading === 'confirm' ? '···' : 'Confirm'}
          </button>
        )}
        {(currentStatus === 'pending' || currentStatus === 'confirmed') && (
          <button
            onClick={() => handleAction('cancel')}
            disabled={loading !== null}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: loading === 'cancel' ? 'rgba(245,240,232,0.12)' : 'rgba(245,240,232,0.28)',
              border: '1px solid rgba(245,240,232,0.1)',
              background: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '2px',
              cursor: loading !== null ? 'default' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s',
            }}
          >
            {loading === 'cancel' ? '···' : 'Cancel'}
          </button>
        )}
      </div>
    </div>
  );
}

export { GRID as BOOKING_ROW_GRID };
