// Email HTML templates for Mountain Nest Hotel
// Plain HTML strings — no @react-email dependency needed with Resend

export interface BookingEmailData {
  bookingId:  string;
  guestName:  string;
  guestEmail: string;
  guestPhone: string;
  nationality?: string | null;
  roomName:   string;
  checkIn:    string; // YYYY-MM-DD
  checkOut:   string;
  nights:     number;
  adults:     number;
  children:   number;
  totalUsd:   number;
  specialRequests?: string | null;
}

function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

const BASE = `
  font-family: Georgia, 'Times New Roman', serif;
  background: #F5F0E8;
  margin: 0; padding: 0;
`;

const WRAP = `
  max-width: 560px;
  margin: 40px auto;
  background: #FFFFFF;
  border: 1px solid #DDD8CE;
`;

const HEADER = `
  background: #1C2B1A;
  padding: 32px 40px;
  text-align: center;
`;

const BODY = `padding: 40px;`;

const ROW = `
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #DDD8CE;
  font-family: system-ui, sans-serif;
  font-size: 14px;
  color: #1C2B1A;
`;

const LABEL = `color: #6B6558; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;`;

function row(label: string, value: string) {
  return `<div style="${ROW}">
    <span style="${LABEL}">${label}</span>
    <span style="font-weight: 500;">${value}</span>
  </div>`;
}

export function guestConfirmationEmail(d: BookingEmailData): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${BASE}">
  <div style="${WRAP}">
    <div style="${HEADER}">
      <p style="color:#C4704F;font-family:system-ui,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 8px;">Mountain Nest Hotel</p>
      <h1 style="color:#F5F0E8;font-size:26px;font-weight:400;margin:0;line-height:1.2;">Reservation Received</h1>
    </div>

    <div style="${BODY}">
      <p style="font-family:system-ui,sans-serif;font-size:15px;color:#1C2B1A;margin:0 0 24px;">
        Dear ${d.guestName},
      </p>
      <p style="font-family:system-ui,sans-serif;font-size:15px;color:#6B6558;line-height:1.6;margin:0 0 32px;">
        Thank you for choosing Mountain Nest Hotel. We have received your reservation request and will confirm availability within <strong style="color:#1C2B1A;">4 hours</strong>. A member of our team will contact you at ${d.guestEmail} to finalise your stay.
      </p>

      <h2 style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#6B6558;font-family:system-ui,sans-serif;font-weight:400;margin:0 0 4px;">Reservation Summary</h2>
      <div style="border-top:1px solid #DDD8CE;margin-bottom:4px;"></div>

      ${row('Reference', d.bookingId.slice(0, 8).toUpperCase())}
      ${row('Room', d.roomName)}
      ${row('Check-in', fmtDate(d.checkIn))}
      ${row('Check-out', fmtDate(d.checkOut))}
      ${row('Nights', String(d.nights))}
      ${row('Guests', d.children > 0 ? `${d.adults} adults, ${d.children} children` : `${d.adults} adults`)}
      ${row('Estimated Total', `USD $${d.totalUsd.toLocaleString('en-US', { minimumFractionDigits: 0 })}`)}

      ${d.specialRequests ? `
      <div style="margin-top:24px;padding:16px;background:#F5F0E8;border-left:3px solid #C4704F;">
        <p style="${LABEL}margin:0 0 6px;">Special Requests</p>
        <p style="font-family:system-ui,sans-serif;font-size:14px;color:#1C2B1A;margin:0;line-height:1.5;">${d.specialRequests}</p>
      </div>` : ''}

      <p style="font-family:system-ui,sans-serif;font-size:13px;color:#6B6558;margin:32px 0 0;line-height:1.6;">
        For urgent enquiries, WhatsApp us directly or reply to this email.<br>
        We look forward to welcoming you to the Himalayas.
      </p>
    </div>

    <div style="background:#1C2B1A;padding:20px 40px;text-align:center;">
      <p style="font-family:system-ui,sans-serif;font-size:11px;color:#8B7355;margin:0;letter-spacing:0.06em;">
        Mountain Nest Hotel &nbsp;·&nbsp; Nepali Himalayas
      </p>
    </div>
  </div>
</body>
</html>`;
}

export function adminNotificationEmail(d: BookingEmailData): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${BASE}">
  <div style="${WRAP}">
    <div style="${HEADER}">
      <p style="color:#C4704F;font-family:system-ui,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 8px;">Admin · Mountain Nest</p>
      <h1 style="color:#F5F0E8;font-size:24px;font-weight:400;margin:0;">New Reservation Request</h1>
    </div>

    <div style="${BODY}">
      <h2 style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#6B6558;font-family:system-ui,sans-serif;font-weight:400;margin:0 0 4px;">Guest</h2>
      <div style="border-top:1px solid #DDD8CE;margin-bottom:4px;"></div>
      ${row('Name', d.guestName)}
      ${row('Email', d.guestEmail)}
      ${row('Phone', d.guestPhone)}
      ${d.nationality ? row('Nationality', d.nationality) : ''}

      <h2 style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#6B6558;font-family:system-ui,sans-serif;font-weight:400;margin:24px 0 4px;">Booking</h2>
      <div style="border-top:1px solid #DDD8CE;margin-bottom:4px;"></div>
      ${row('Ref', d.bookingId.slice(0, 8).toUpperCase())}
      ${row('Room', d.roomName)}
      ${row('Check-in', fmtDate(d.checkIn))}
      ${row('Check-out', fmtDate(d.checkOut))}
      ${row('Nights', String(d.nights))}
      ${row('Guests', d.children > 0 ? `${d.adults} adults, ${d.children} children` : `${d.adults} adults`)}
      ${row('Estimated Total', `USD $${d.totalUsd.toLocaleString('en-US', { minimumFractionDigits: 0 })}`)}

      ${d.specialRequests ? `
      <div style="margin-top:24px;padding:16px;background:#F5F0E8;border-left:3px solid #C4704F;">
        <p style="${LABEL}margin:0 0 6px;">Special Requests</p>
        <p style="font-family:system-ui,sans-serif;font-size:14px;color:#1C2B1A;margin:0;line-height:1.5;">${d.specialRequests}</p>
      </div>` : ''}

      <div style="margin-top:32px;padding:20px;background:#2D4A2A;border-radius:2px;">
        <p style="font-family:system-ui,sans-serif;font-size:14px;color:#F5F0E8;margin:0;text-align:center;line-height:1.6;">
          Log in to the admin dashboard to confirm or decline this reservation.
        </p>
      </div>
    </div>

    <div style="background:#1C2B1A;padding:20px 40px;text-align:center;">
      <p style="font-family:system-ui,sans-serif;font-size:11px;color:#8B7355;margin:0;">Mountain Nest Hotel — Admin Notifications</p>
    </div>
  </div>
</body>
</html>`;
}
