'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlipLink } from '@/components/ui/FlipLink';

const NAV_LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'Rooms',      href: '/rooms' },
  { label: 'Activities', href: '/activities' },
  { label: 'Reserve',    href: '/book' },
] as const;

const WHATSAPP_NUMBER = '+977-98XXXXXXXX';
const WHATSAPP_HREF   = `https://wa.me/97798XXXXXXXX`;

/* ── Navbar ────────────────────────────────────────────────────── */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const onDark = menuOpen || !scrolled;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          right:           0,
          zIndex:          50,
          backgroundColor: menuOpen
            ? 'transparent'
            : scrolled
              ? 'var(--color-canvas)'
              : 'transparent',
          borderBottom: `1px solid ${!menuOpen && scrolled ? 'var(--color-hairline)' : 'transparent'}`,
          transition:   'background-color 0.5s ease, border-color 0.5s ease',
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

            {/* Logo */}
            <a
              href="/"
              style={{
                fontFamily:     'var(--font-display)',
                fontSize:       20,
                fontWeight:     400,
                letterSpacing:  '-0.02em',
                color:          onDark ? 'var(--color-text-inverse)' : 'var(--color-ink)',
                textDecoration: 'none',
                transition:     'color 0.5s ease',
                position:       'relative',
                zIndex:         60,
                lineHeight:     1,
              }}
            >
              Mountain Nest
            </a>

            {/* Desktop nav */}
            <nav aria-label="Main navigation" className="hidden md:flex" style={{ alignItems: 'center', gap: 36 }}>
              {NAV_LINKS.map(({ label, href }) => (
                <FlipLink
                  key={label}
                  href={href}
                  label={label}
                  defaultColor={scrolled ? 'var(--color-text-secondary)' : 'rgba(245,240,232,0.55)'}
                  activeColor={scrolled ? 'var(--color-ink)' : 'var(--color-text-inverse)'}
                />
              ))}
            </nav>

            {/* Desktop right — WhatsApp + CTA */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 20 }}>
              <WhatsAppIcon onDark={onDark} href={WHATSAPP_HREF} />
              <ReserveButton scrolled={scrolled} />
            </div>

            {/* Mobile right — WhatsApp + Burger */}
            <div className="flex md:hidden items-center" style={{ gap: 16 }}>
              <WhatsAppIcon onDark={onDark} href={WHATSAPP_HREF} />
              <BurgerButton open={menuOpen} onToggle={() => setMenuOpen(v => !v)} onDark={onDark} />
            </div>

          </div>
        </div>
      </motion.header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        whatsappHref={WHATSAPP_HREF}
        whatsappNumber={WHATSAPP_NUMBER}
      />
    </>
  );
}

/* ── WhatsApp icon ─────────────────────────────────────────────── */
function WhatsAppIcon({ onDark, href }: { onDark: boolean; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        display:    'flex',
        alignItems: 'center',
        padding:    '13px',
        margin:     '-13px',
        color:      onDark ? 'rgba(245,240,232,0.6)' : 'var(--color-text-secondary)',
        transition: 'color 0.3s ease',
        position:   'relative',
        zIndex:     60,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-accent)'; }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.color = onDark
          ? 'rgba(245,240,232,0.6)'
          : 'var(--color-text-secondary)';
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    </a>
  );
}

/* ── 2-line burger ─────────────────────────────────────────────── */
function BurgerButton({ open, onToggle, onDark }: { open: boolean; onToggle: () => void; onDark: boolean }) {
  const lineColor = onDark ? 'var(--color-text-inverse)' : 'var(--color-ink)';

  return (
    <button
      onClick={onToggle}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      style={{
        position:      'relative',
        zIndex:        60,
        background:    'none',
        border:        'none',
        cursor:        'pointer',
        padding:       '17px 8px',
        display:       'flex',
        flexDirection: 'column',
        gap:           8,
        alignItems:    'flex-end',
      }}
    >
      <motion.span
        animate={open
          ? { rotate: 45,  y: 4.5, width: 28, background: 'var(--color-text-inverse)' }
          : { rotate: 0,   y: 0,   width: 28, background: lineColor }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'block', height: 1, width: 28, borderRadius: 1, transformOrigin: 'center' }}
      />
      <motion.span
        animate={open
          ? { rotate: -45, y: -4.5, width: 28, background: 'var(--color-text-inverse)' }
          : { rotate: 0,   y: 0,    width: 18, background: lineColor }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'block', height: 1, width: 18, borderRadius: 1, transformOrigin: 'center' }}
      />
    </button>
  );
}

/* ── Full-screen mobile menu ────────────────────────────────────── */
function MobileMenu({
  open,
  onClose,
  whatsappHref,
  whatsappNumber,
}: {
  open: boolean;
  onClose: () => void;
  whatsappHref: string;
  whatsappNumber: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initial={{ clipPath: 'inset(0 0 100% 0)', WebkitClipPath: 'inset(0 0 100% 0)' } as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          animate={{ clipPath: 'inset(0 0 0% 0)',   WebkitClipPath: 'inset(0 0 0% 0)' } as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          exit={{    clipPath: 'inset(0 0 100% 0)', WebkitClipPath: 'inset(0 0 100% 0)' } as any}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position:      'fixed',
            inset:         0,
            zIndex:        40,
            background:    'var(--color-ink)',
            display:       'flex',
            flexDirection: 'column',
            padding:       'clamp(96px, 18vh, 130px) clamp(24px, 6vw, 60px) clamp(36px, 8vh, 60px)',
            overflowY:     'auto',
          }}
        >
          {/* Decorative left vertical line — terracotta */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            style={{
              position:        'absolute',
              left:            'clamp(24px, 6vw, 60px)',
              top:             'clamp(96px, 18vh, 130px)',
              bottom:          'clamp(36px, 8vh, 60px)',
              width:           1,
              background:      'linear-gradient(to bottom, var(--color-accent), transparent)',
              opacity:         0.35,
              transformOrigin: 'top',
              pointerEvents:   'none',
            }}
          />

          {/* Top label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      9,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         'rgba(245,240,232,0.25)',
              marginBottom:  'clamp(32px, 6vh, 56px)',
              paddingLeft:   20,
            }}
          >
            Navigate
          </motion.p>

          {/* Nav links */}
          <nav
            aria-label="Mobile navigation"
            style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: 20 }}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {NAV_LINKS.map(({ label, href }, i) => {
              const isDimmed = hoveredIdx !== null && hoveredIdx !== i;

              return (
                <motion.a
                  key={label}
                  href={href}
                  onClick={onClose}
                  onMouseEnter={() => setHoveredIdx(i)}
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.07 }}
                  style={{
                    display:        'flex',
                    alignItems:     'baseline',
                    gap:            16,
                    textDecoration: 'none',
                    paddingBlock:   'clamp(10px, 2.5vh, 18px)',
                    borderBottom:   '1px solid rgba(245,240,232,0.06)',
                    opacity:        isDimmed ? 0.2 : 1,
                    transform:      isDimmed ? 'translateX(-4px)' : 'translateX(0)',
                    transition:     'opacity 0.3s ease, transform 0.3s ease',
                  }}
                >
                  <span style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      10,
                    letterSpacing: '0.15em',
                    color:         hoveredIdx === i ? 'var(--color-accent)' : 'rgba(196,112,79,0.4)',
                    flexShrink:    0,
                    transition:    'color 0.3s ease',
                    marginBottom:  2,
                  }}>
                    0{i + 1}
                  </span>

                  <span style={{
                    fontFamily:    'var(--font-display)',
                    fontSize:      'clamp(48px, 13vw, 80px)',
                    fontWeight:    400,
                    letterSpacing: '-0.03em',
                    lineHeight:    1,
                    color:         hoveredIdx === i ? 'var(--color-text-inverse)' : 'rgba(245,240,232,0.7)',
                    transition:    'color 0.3s ease, font-style 0.3s ease',
                  }}>
                    {label}
                  </span>

                  <motion.span
                    animate={{ opacity: hoveredIdx === i ? 1 : 0, x: hoveredIdx === i ? 0 : -8 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize:   'clamp(24px, 6vw, 36px)',
                      fontStyle:  'italic',
                      color:      'var(--color-accent)',
                      lineHeight: 1,
                      marginLeft: 'auto',
                      flexShrink: 0,
                    }}
                  >
                    →
                  </motion.span>
                </motion.a>
              );
            })}
          </nav>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              marginTop:      'clamp(24px, 4vh, 40px)',
              paddingLeft:    20,
            }}
          >
            <p style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      9,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         'rgba(245,240,232,0.2)',
            }}>
              Mountain Nest Hotel · Nepal
            </p>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Call or message on WhatsApp: ${whatsappNumber}`}
              style={{
                display:       'inline-flex',
                alignItems:    'center',
                gap:           10,
                fontFamily:    'var(--font-mono)',
                fontSize:      10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color:         'var(--color-accent)',
                textDecoration:'none',
                border:        '1px solid rgba(196,112,79,0.3)',
                padding:       '10px 18px',
                transition:    'border-color 0.3s ease, background 0.3s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(196,112,79,0.08)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(196,112,79,0.7)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(196,112,79,0.3)';
              }}
            >
              {whatsappNumber}
              <span style={{ display: 'inline-block', width: 20, height: 1, background: 'var(--color-accent)' }} />
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Desktop "Reserve Your Stay" CTA ───────────────────────────── */
function ReserveButton({ scrolled }: { scrolled: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="/book"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        gap:            12,
        padding:        '10px 20px',
        background:     hovered
          ? 'var(--color-accent)'
          : scrolled
            ? 'var(--color-ink)'
            : 'transparent',
        color:          hovered
          ? 'var(--color-text-inverse)'
          : 'var(--color-text-inverse)',
        fontFamily:     'var(--font-mono)',
        fontSize:       10,
        letterSpacing:  '0.12em',
        textTransform:  'uppercase',
        textDecoration: 'none',
        border:         `1px solid ${
          hovered
            ? 'var(--color-accent)'
            : scrolled
              ? 'var(--color-ink)'
              : 'rgba(245,240,232,0.35)'
        }`,
        transition: 'background 0.35s ease, border-color 0.35s ease, color 0.35s ease',
      }}
    >
      Reserve Your Stay
      <span
        style={{
          display:    'inline-block',
          height:     1,
          background: 'currentColor',
          width:      hovered ? 32 : 20,
          transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </a>
  );
}
