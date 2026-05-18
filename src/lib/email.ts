import { Resend } from 'resend';
import { guestConfirmationEmail, adminNotificationEmail, type BookingEmailData } from './email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM  = process.env.RESEND_FROM_EMAIL ?? 'bookings@mountainnest.com';
const ADMIN = process.env.ADMIN_EMAIL        ?? '';

export async function sendBookingEmails(data: BookingEmailData) {
  if (!process.env.RESEND_API_KEY) return; // silently skip in dev without key

  await Promise.allSettled([
    resend.emails.send({
      from:    FROM,
      to:      data.guestEmail,
      subject: `Reservation received — ${data.roomName}, ${data.checkIn}`,
      html:    guestConfirmationEmail(data),
    }),
    ADMIN
      ? resend.emails.send({
          from:    FROM,
          to:      ADMIN,
          subject: `New reservation: ${data.guestName} · ${data.roomName} · ${data.checkIn}`,
          html:    adminNotificationEmail(data),
        })
      : Promise.resolve(),
  ]);
}
