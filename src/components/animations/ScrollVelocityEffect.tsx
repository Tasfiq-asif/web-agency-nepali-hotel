'use client';

import { useEffect } from 'react';
import { initLenis, destroyLenis } from '@/lib/lenis';

export function ScrollVelocityEffect() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      initLenis();
      return () => destroyLenis();
    }

    const targets: HTMLElement[] = [];
    let skew = 0;

    const getTargets = () => {
      targets.length = 0;
      document.querySelectorAll<HTMLElement>('main .container').forEach(el => targets.push(el));
    };
    getTargets();

    // Lenis velocity is normalized (roughly -1 to 1 range at normal scroll speed)
    const applySkew = (velocity: number) => {
      const targetSkew = Math.max(-1.2, Math.min(1.2, velocity * 3));
      skew += (targetSkew - skew) * 0.07;
      const transform = Math.abs(skew) > 0.008 ? `skewY(${skew.toFixed(3)}deg)` : '';
      for (const el of targets) el.style.transform = transform;
    };

    initLenis(applySkew);

    return () => {
      destroyLenis();
      for (const el of targets) el.style.transform = '';
    };
  }, []);

  return null;
}
