import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = process.env.RESEND_FROM_EMAIL ?? 'hello@mountainnest.com';
const ADMIN  = process.env.ADMIN_EMAIL       ?? 'admin@mountainnest.com';

const BASE   = 'font-family:Georgia,serif;background:#F5F0E8;margin:0;padding:0;';
const WRAP   = 'max-width:560px;margin:40px auto;background:#FFFFFF;border:1px solid #DDD8CE;';
const HEADER = 'background:#1C2B1A;padding:32px 40px;text-align:center;';
const BODY   = 'padding:40px;';
const ROW    = 'display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #DDD8CE;font-family:system-ui,sans-serif;font-size:14px;color:#1C2B1A;';
const LABEL  = 'color:#6B6558;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;';

function row(label: string, value: string) {
  return `<div style="${ROW}"><span style="${LABEL}">${label}</span><span style="font-weight:500;">${value}</span></div>`;
}

function contactInquiryEmail(name: string, email: string, message: string, timestamp: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${BASE}">
  <div style="${WRAP}">
    <div style="${HEADER}">
      <p style="color:#C4704F;font-family:system-ui,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 8px;">Mountain Nest Hotel</p>
      <h1 style="color:#F5F0E8;font-size:24px;font-weight:400;margin:0;">New Inquiry</h1>
    </div>
    <div style="${BODY}">
      <h2 style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#6B6558;font-family:system-ui,sans-serif;font-weight:400;margin:0 0 4px;">Contact Details</h2>
      <div style="border-top:1px solid #DDD8CE;margin-bottom:4px;"></div>
      ${row('Name', name)}
      ${row('Email', email)}
      ${row('Received', timestamp)}
      <h2 style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#6B6558;font-family:system-ui,sans-serif;font-weight:400;margin:24px 0 4px;">Message</h2>
      <div style="border-top:1px solid #DDD8CE;margin-bottom:16px;"></div>
      <div style="padding:16px;background:#F5F0E8;border-left:3px solid #C4704F;">
        <p style="font-family:system-ui,sans-serif;font-size:14px;color:#1C2B1A;margin:0;line-height:1.6;">${message.replace(/\n/g, '<br>')}</p>
      </div>
      <p style="font-family:system-ui,sans-serif;font-size:13px;color:#6B6558;margin:24px 0 0;line-height:1.6;">
        Reply directly to this email to respond to ${name}.
      </p>
    </div>
    <div style="background:#1C2B1A;padding:20px 40px;text-align:center;">
      <p style="font-family:system-ui,sans-serif;font-size:11px;color:#8B7355;margin:0;letter-spacing:0.06em;">Mountain Nest Hotel &nbsp;·&nbsp; Nepali Himalayas</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  const name    = typeof b.name    === 'string' ? b.name.trim()    : '';
  const email   = typeof b.email   === 'string' ? b.email.trim()   : '';
  const message = typeof b.message === 'string' ? b.message.trim() : '';

  if (!name || !email || message.length < 10) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kathmandu',
    dateStyle: 'long',
    timeStyle: 'short',
  });

  console.log('[contact inquiry]', { name, email, timestamp, messageLength: message.length });

  if (process.env.RESEND_API_KEY) {
    Promise.allSettled([
      resend.emails.send({
        from:    FROM,
        to:      ADMIN,
        replyTo: email,
        subject: `New Inquiry from ${name} — Mountain Nest`,
        html:    contactInquiryEmail(name, email, message, timestamp),
      }),
    ]).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
