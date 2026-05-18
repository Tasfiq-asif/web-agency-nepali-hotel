'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await signIn.email({ email, password });

    if (signInError) {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-ink)' }}>
      <div
        className="w-full max-w-sm mx-4 rounded-sm"
        style={{ backgroundColor: 'var(--color-canvas)', padding: '2.5rem 2rem' }}
      >
        {/* Branding */}
        <div className="text-center mb-8">
          <p className="label mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            Mountain Nest Hotel
          </p>
          <h1
            className="font-display italic"
            style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--color-ink)', lineHeight: 1.1 }}
          >
            Admin Portal
          </h1>
          <div
            className="mx-auto mt-4"
            style={{ width: 32, height: 1, backgroundColor: 'var(--color-accent)' }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="label"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                color: 'var(--color-ink)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-hairline)',
                borderRadius: '2px',
                padding: '0.625rem 0.75rem',
                outline: 'none',
                width: '100%',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--color-hairline)')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="label"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                color: 'var(--color-ink)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-hairline)',
                borderRadius: '2px',
                padding: '0.625rem 0.75rem',
                outline: 'none',
                width: '100%',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--color-hairline)')}
            />
          </div>

          {error && (
            <p
              className="label text-center"
              style={{ color: 'var(--color-accent)', letterSpacing: '0.05em' }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-inverse)',
              backgroundColor: loading ? 'var(--color-warm-mid)' : 'var(--color-accent)',
              border: 'none',
              borderRadius: '2px',
              padding: '0.75rem 1.5rem',
              cursor: loading ? 'default' : 'pointer',
              transition: 'background-color 0.2s',
              width: '100%',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
