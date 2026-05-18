'use client';

import { useEffect } from 'react';

export function ScrollVelocityEffect() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lastY = window.scrollY;
    let lastTime = performance.now();
    let skew = 0;
    let rafId: number;

    // Cache targets once — section backgrounds stay on <section>, only inner
    // content skews so color edges never distort.
    const getTargets = () =>
      Array.from(document.querySelectorAll<HTMLElement>('main .container'));

    const targets = getTargets();

    const tick = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(now - lastTime, 1);
      const velocity = (y - lastY) / dt; // px per ms

      // Max ±1.2° — perceptible to designers, invisible to casual eyes
      const targetSkew = Math.max(-1.2, Math.min(1.2, velocity * 9));
      // Low lerp coefficient = heavy, physical feel
      skew += (targetSkew - skew) * 0.07;

      const transform = Math.abs(skew) > 0.008
        ? `skewY(${skew.toFixed(3)}deg)`
        : '';

      for (const el of targets) {
        el.style.transform = transform;
      }

      lastY = y;
      lastTime = now;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      for (const el of targets) {
        el.style.transform = '';
      }
    };
  }, []);

  return null;
}
