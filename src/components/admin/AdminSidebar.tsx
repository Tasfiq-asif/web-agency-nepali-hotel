'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';

const NAV = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="1" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1" y="9" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="9" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    exact: true,
  },
  {
    href: '/admin/bookings',
    label: 'Reservations',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="11" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M1 7h14" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 10.5l1.5 1.5L11 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/admin/calendar',
    label: 'Calendar',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="11" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M1 7h14" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    href: '/admin/rooms',
    label: 'Rooms',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 12V7a1 1 0 011-1h12a1 1 0 011 1v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M1 12h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M4 6V4a2 2 0 014 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/admin/gallery',
    label: 'Gallery',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="14" height="14" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="5.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1 11l4-4 3 3 2-2 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/admin/content',
    label: 'Content',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10.5 2.5l3 3-7 7H3.5v-3l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M9 4l3 3" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    href: '/admin/seo',
    label: 'SEO',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  async function handleSignOut() {
    await signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside
      style={{
        width: 240,
        minWidth: 240,
        minHeight: '100vh',
        backgroundColor: '#1C2B1A',
        borderRight: '1px solid rgba(221,216,206,0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '1.75rem 1.25rem 1.25rem', borderBottom: '1px solid rgba(221,216,206,0.08)' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(245,240,232,0.4)',
            marginBottom: '0.25rem',
          }}
        >
          Mountain Nest
        </p>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '1.125rem',
            color: '#F5F0E8',
            lineHeight: 1.2,
          }}
        >
          Admin
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0' }}>
        {NAV.map(item => {
          const active = isActive(item.href, 'exact' in item ? item.exact : undefined);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.625rem 1.25rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 400,
                color: active ? '#F5F0E8' : 'rgba(245,240,232,0.45)',
                backgroundColor: active ? 'rgba(196,112,79,0.12)' : 'transparent',
                borderLeft: active ? '2px solid #C4704F' : '2px solid transparent',
                textDecoration: 'none',
                transition: 'color 0.15s, background-color 0.15s',
              }}
            >
              <span style={{ color: active ? '#C4704F' : 'rgba(245,240,232,0.35)', flexShrink: 0 }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(221,216,206,0.08)' }}>
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 400,
            color: 'rgba(245,240,232,0.35)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.375rem 0',
            width: '100%',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,240,232,0.7)')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,240,232,0.35)')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H2.5A.5.5 0 002 2.5v11a.5.5 0 00.5.5H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M11 5l3 3-3 3M14 8H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
