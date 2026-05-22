'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { markPreloaderDone } from '@/lib/preloader';

export function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<SVGRectElement>(null);
  const mountainRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current!;
    const fill = fillRef.current!;
    const mountain = mountainRef.current!;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      overlay.style.display = 'none';
      markPreloaderDone();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        overlay.style.display = 'none';
        markPreloaderDone();
      },
    });

    tl.fromTo(
      fill,
      { attr: { y: 200, height: 0 } },
      { attr: { y: 0, height: 200 }, duration: 0.45, ease: 'power2.out' }
    )
      .to(mountain, { opacity: 0, y: -10, duration: 0.12, ease: 'power2.in' }, '-=0.05')
      .to(overlay, { yPercent: -100, duration: 0.35, ease: 'power3.inOut' }, '-=0.05');

    return () => { tl.kill(); };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'var(--dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    >
      <svg
        ref={mountainRef}
        viewBox="0 0 240 200"
        width="120"
        height="100"
        fill="none"
        style={{ willChange: 'opacity, transform' }}
      >
        <defs>
          <clipPath id="mountain-clip">
            <path d="M120 20 L40 180 H200 Z" />
            <path d="M175 60 L130 180 H220 Z" />
          </clipPath>
        </defs>
        <path
          d="M120 20 L40 180 H200 Z"
          stroke="var(--color-warm-mid)"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <path
          d="M175 60 L130 180 H220 Z"
          stroke="var(--color-warm-mid)"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <rect
          ref={fillRef}
          x="0"
          y="200"
          width="240"
          height="0"
          fill="var(--color-accent)"
          clipPath="url(#mountain-clip)"
        />
      </svg>
    </div>
  );
}
