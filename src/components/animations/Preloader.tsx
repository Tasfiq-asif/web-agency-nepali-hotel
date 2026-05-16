'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { markPreloaderDone } from '@/lib/preloader';

export function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const countRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current!;
    const countEl = countRef.current!;

    // Skip entirely for reduced-motion users
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      overlay.style.display = 'none';
      markPreloaderDone();
      return;
    }

    let progress = 0;

    const tick = setInterval(() => {
      const remaining = 100 - progress;
      progress += Math.max(0.5, Math.random() * Math.min(remaining * 0.25, 9));
      progress  = Math.min(progress, 100);
      countEl.textContent = Math.floor(progress) + '%';

      if (progress >= 100) {
        clearInterval(tick);

        // Brief pause at 100% so the eye registers it
        setTimeout(() => {
          gsap.timeline({
            onComplete: () => {
              overlay.style.display = 'none';
              markPreloaderDone();
            },
          })
            .to(countEl, {
              opacity: 0,
              y: -14,
              duration: 0.3,
              ease: 'power2.in',
            })
            // Curtain wipes upward off screen
            .to(overlay, {
              yPercent: -100,
              duration: 0.9,
              ease: 'power4.inOut',
            }, '+=0.05');
        }, 180);
      }
    }, 75);

    return () => clearInterval(tick);
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'var(--dark)',       // #0A0A0A — matches hero, no flash
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    >
      <span
        ref={countRef}
        style={{
          fontFamily:         'var(--font-display)',
          fontSize:           'clamp(5rem, 14vw, 12rem)',
          fontWeight:         600,
          letterSpacing:      '-0.04em',
          lineHeight:         1,
          color:              'var(--text-inverse)',
          fontVariantNumeric: 'tabular-nums',
          userSelect:         'none',
          willChange:         'opacity, transform',
        }}
      >
        0%
      </span>
    </div>
  );
}
