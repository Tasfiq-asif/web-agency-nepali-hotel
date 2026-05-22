'use client';

const QUICK_LINKS = [
  { label: 'Rooms & Suites', href: '/rooms' },
  { label: 'Dining',         href: '/dining' },
  { label: 'Activities',     href: '/activities' },
  { label: 'Gallery',        href: '/gallery' },
  { label: 'About Us',       href: '/about' },
  { label: 'Contact',        href: '/contact' },
];

const WHATSAPP_HREF   = 'https://wa.me/97798XXXXXXXX';
const WHATSAPP_NUMBER = '+977-98XXXXXXXX';

/* ── Footer ────────────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer
      style={{
        background:  'var(--color-ink)',
        color:       'var(--color-text-inverse)',
        paddingTop:  'clamp(4rem, 8vw, 7rem)',
      }}
    >
      <div className="container">

        {/* Top grid */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap:                 'clamp(2.5rem, 5vw, 4rem)',
            paddingBottom:       'clamp(3rem, 6vw, 5rem)',
            borderBottom:        '1px solid rgba(245,240,232,0.08)',
          }}
        >

          {/* Column 1 — Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <a
              href="/"
              style={{
                display:        'block',
                fontFamily:     'var(--font-display)',
                fontSize:       'clamp(1.5rem, 2.5vw, 2rem)',
                fontWeight:     400,
                letterSpacing:  '-0.02em',
                color:          'var(--color-text-inverse)',
                textDecoration: 'none',
                marginBottom:   '1rem',
                lineHeight:     1,
              }}
            >
              Mountain Nest Hotel
            </a>
            <p
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color:         'rgba(245,240,232,0.6)',
                lineHeight:    1.6,
                maxWidth:      220,
              }}
            >
              Your Himalayan sanctuary — a boutique lodge above the clouds in Nepal.
            </p>

            {/* WhatsApp CTA */}
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            10,
                marginTop:      '2rem',
                padding:        '11px 20px',
                border:         '1px solid rgba(196,112,79,0.4)',
                color:          'var(--color-text-inverse)',
                fontFamily:     'var(--font-mono)',
                fontSize:       11,
                letterSpacing:  '0.12em',
                textTransform:  'uppercase',
                textDecoration: 'none',
                transition:     'border-color 0.3s ease, background 0.3s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background   = 'rgba(196,112,79,0.08)';
                el.style.borderColor  = 'rgba(196,112,79,0.75)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background   = 'transparent';
                el.style.borderColor  = 'rgba(196,112,79,0.4)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Column 2 — Contact */}
          <div>
            <p style={colHeadStyle}>Contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <FooterContact label="Address" value="Namche Bazaar, Solukhumbu District, Sagarmatha Zone, Nepal" />
              <FooterContact label="Phone" value={WHATSAPP_NUMBER} href={`tel:${WHATSAPP_NUMBER.replace(/\D/g, '')}`} />
              <FooterContact label="Email" value="stay@mountainnesthotel.com" href="mailto:stay@mountainnesthotel.com" />
              <FooterContact label="Season" value="Open year-round · Peak: Mar–May, Oct–Nov" />
            </div>
          </div>

          {/* Column 3 — Quick links */}
          <div>
            <p style={colHeadStyle}>Explore</p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {QUICK_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    fontFamily:     'var(--font-body)',
                    fontSize:       'var(--text-body-sm)',
                    color:          'rgba(245,240,232,0.65)',
                    textDecoration: 'none',
                    transition:     'color 0.25s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-inverse)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(245,240,232,0.65)'; }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 4 — Reserve CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <p style={colHeadStyle}>Reserve Your Stay</p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize:   'var(--text-body-sm)',
                color:      'rgba(245,240,232,0.65)',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
              }}>
                Book direct and skip the OTA fees. We confirm within 4 hours.
              </p>
              <a
                href="/book"
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  gap:            12,
                  padding:        '13px 24px',
                  background:     'var(--color-text-inverse)',
                  color:          'var(--color-ink)',
                  fontFamily:     'var(--font-mono)',
                  fontSize:       11,
                  letterSpacing:  '0.12em',
                  textTransform:  'uppercase',
                  textDecoration: 'none',
                  transition:     'opacity 0.3s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
              >
                Check Availability
                <span style={{ display: 'inline-block', width: 20, height: 1, background: 'currentColor' }} />
              </a>
            </div>

            {/* Socials */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: 16, alignItems: 'center' }}>
              <SocialLink href="#" label="Instagram" icon={<InstagramIcon />} />
              <SocialLink href="#" label="Facebook"  icon={<FacebookIcon />} />
              <SocialLink href="#" label="TripAdvisor" icon={<TripAdvisorIcon />} />
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          style={{
            display:        'flex',
            flexWrap:       'wrap',
            justifyContent: 'space-between',
            alignItems:     'center',
            gap:            '1rem',
            paddingBlock:   '1.5rem',
          }}
        >
          <p style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color:         'rgba(245,240,232,0.58)',
          }}>
            © {new Date().getFullYear()} Mountain Nest Hotel · NTB Reg. No. XXXXXXX · All rights reserved
          </p>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms & Conditions'].map(label => (
              <a
                key={label}
                href="#"
                style={{
                  fontFamily:     'var(--font-mono)',
                  fontSize:       11,
                  letterSpacing:  '0.12em',
                  textTransform:  'uppercase',
                  color:          'rgba(245,240,232,0.58)',
                  textDecoration: 'none',
                  transition:     'color 0.25s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(245,240,232,0.9)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(245,240,232,0.58)'; }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

/* ── Helpers ────────────────────────────────────────────────────── */

const colHeadStyle: React.CSSProperties = {
  fontFamily:    'var(--font-mono)',
  fontSize:      11,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color:         '#D58060',
  marginBottom:  '1.25rem',
};

function FooterContact({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color:         'rgba(245,240,232,0.6)',
        display:       'block',
        marginBottom:  3,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize:   'var(--text-body-sm)',
        color:      'rgba(245,240,232,0.6)',
        lineHeight: 1.55,
      }}>
        {value}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        style={{ textDecoration: 'none', transition: 'opacity 0.25s ease' }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
      >
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        color:      'rgba(245,240,232,0.3)',
        transition: 'color 0.25s ease',
        display:    'flex',
        alignItems: 'center',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-accent)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(245,240,232,0.3)'; }}
    >
      {icon}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TripAdvisorIcon() {
  return (
    <svg width="18" height="16" viewBox="0 0 32 28" fill="currentColor">
      <path d="M16 9.5C11.86 9.5 8.5 12.86 8.5 17S11.86 24.5 16 24.5 23.5 21.14 23.5 17 20.14 9.5 16 9.5zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM7.25 6A12.73 12.73 0 0 0 0 17c0 3.49 1.4 6.65 3.67 8.97L0 28h6.5A13 13 0 0 0 16 30c3.6 0 6.87-1.46 9.24-3.83h.01L31.5 28l-3.5-2.15A12.96 12.96 0 0 0 29 17C29 9.82 23.18 4 16 4c-3.1 0-5.95 1.08-8.19 2.86L7.25 6zM16 6c6.07 0 11 4.93 11 11S22.07 28 16 28 5 23.07 5 17 9.93 6 16 6z" />
    </svg>
  );
}
