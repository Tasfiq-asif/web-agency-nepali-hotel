'use client';

import { useState } from 'react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--color-canvas)',
  border: '1px solid var(--color-hairline)',
  padding: '0.875rem 1rem',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body)',
  color: 'var(--color-ink)',
  outline: 'none',
  transition: 'border-color 0.25s',
  borderRadius: 0,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-sm)',
  color: 'var(--color-text-secondary)',
  marginBottom: '0.375rem',
};

export function ContactForm() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus]   = useState<FormStatus>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'var(--text-display-sm)',
          color: 'var(--color-ink)',
          lineHeight: 1.4,
          maxWidth: '32ch',
        }}
      >
        Your message has reached us. We&apos;ll reply within 4 hours.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 'clamp(1.5rem, 2vw, 2rem)',
          color: 'var(--color-ink)',
          marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
        }}
      >
        Send us a message
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label htmlFor="contact-name" style={labelStyle}>
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-hairline)'; }}
          />
        </div>

        <div>
          <label htmlFor="contact-email" style={labelStyle}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-hairline)'; }}
          />
        </div>

        <div>
          <label htmlFor="contact-message" style={labelStyle}>
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              ...inputStyle,
              resize: 'vertical',
              minHeight: 130,
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-hairline)'; }}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={status === 'submitting'}
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-canvas)',
              border: 'none',
              padding: '1rem 2.5rem',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-sm)',
              letterSpacing: '0.04em',
              cursor: status === 'submitting' ? 'wait' : 'pointer',
              opacity: status === 'submitting' ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => {
              if (status !== 'submitting') (e.currentTarget as HTMLButtonElement).style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              if (status !== 'submitting') (e.currentTarget as HTMLButtonElement).style.opacity = '1';
            }}
          >
            {status === 'submitting' ? 'Sending…' : 'Send Message'}
          </button>

          {status === 'error' && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-accent)',
                marginTop: '0.75rem',
              }}
            >
              Something went wrong. Please try WhatsApp instead.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
