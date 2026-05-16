'use client';

// Option A — Dark curtain wipe
// A full-screen #0A0A0A panel falls from the top to cover the outgoing page,
// then rises from the bottom to reveal the incoming page. Same visual language
// as the Preloader (which also wipes upward in dark). Award-level, on-brand.
//
// Usage: wrap each page's root element with this component.
// <PageTransitionCurtain><main>...</main></PageTransitionCurtain>

import { motion, useIsPresent } from 'framer-motion';

export function PageTransitionCurtain({ children }: { children: React.ReactNode }) {
  // isPresent: true = entering (initial→animate), false = exiting (→exit)
  const isPresent = useIsPresent();

  return (
    <>
      {/* Curtain overlay — origin switches direction between enter/exit */}
      <motion.div
        aria-hidden
        initial={{ scaleY: 1 }}
        animate={{
          scaleY: 0,
          transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
        }}
        exit={{
          scaleY: 1,
          transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] },
        }}
        style={{
          position:        'fixed',
          inset:           0,
          background:      'var(--dark)',
          zIndex:          9999,
          pointerEvents:   'none',
          // Enter: rises from bottom → transformOrigin bottom (top edge lifts)
          // Exit:  falls from top → transformOrigin top (bottom edge drops)
          transformOrigin: isPresent ? 'bottom center' : 'top center',
          willChange:      'transform',
        }}
      />

      {/* Page content — fades in after curtain starts opening */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.35, ease: 'easeOut', delay: 0.3 },
        }}
        exit={{
          opacity: 1,
          transition: { duration: 0 },
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
