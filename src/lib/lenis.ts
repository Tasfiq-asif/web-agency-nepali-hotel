'use client';

import Lenis from 'lenis';
import { gsap } from './gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis: Lenis | null = null;

export function initLenis(): Lenis {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  // Connect Lenis to GSAP ticker
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Connect Lenis scroll to ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function destroyLenis(): void {
  lenis?.destroy();
  lenis = null;
}
