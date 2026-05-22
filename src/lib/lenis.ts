'use client';

import Lenis from 'lenis';
import { gsap } from './gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis: Lenis | null = null;

export function initLenis(onScroll?: (velocity: number) => void): Lenis {
  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  // Connect Lenis to GSAP ticker — single RAF source, no competing loops
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  lenis.on('scroll', (e: { velocity: number }) => {
    ScrollTrigger.update();
    onScroll?.(e.velocity);
  });

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function destroyLenis(): void {
  lenis?.destroy();
  lenis = null;
}
