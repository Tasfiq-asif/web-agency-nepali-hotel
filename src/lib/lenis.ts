'use client';

import Lenis from 'lenis';
import { gsap } from './gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis: Lenis | null = null;

export function initLenis(): Lenis {
  lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
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
