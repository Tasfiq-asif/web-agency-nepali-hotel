'use client';

import { gsap } from './gsap';

export type SplitType = 'chars' | 'words' | 'lines';

function splitTextIntoUnits(el: HTMLElement, type: SplitType): HTMLElement[] {
  const text = el.textContent || '';
  el.setAttribute('aria-label', text);
  el.textContent = '';

  const units = type === 'chars'
    ? text.split('')
    : type === 'words'
    ? text.split(' ')
    : text.split('\n');

  return units.map((unit, i) => {
    const mask = document.createElement('span');
    mask.className = 'split__mask';
    mask.setAttribute('aria-hidden', 'true');

    const inner = document.createElement('span');
    inner.className = 'split__text';
    inner.style.setProperty('--splitTextDelay', `${i * 0.02}s`);
    inner.textContent = unit === ' ' ? ' ' : unit;

    if (type === 'words' && i < units.length - 1) {
      inner.textContent += ' ';
    }

    mask.appendChild(inner);
    el.appendChild(mask);
    return inner;
  });
}

export function initTextReveal(
  selector: string,
  type: SplitType = 'words',
  options?: { start?: string; stagger?: number; duration?: number }
): void {
  const elements = document.querySelectorAll<HTMLElement>(selector);

  elements.forEach((el) => {
    const units = splitTextIntoUnits(el, type);

    gsap.from(units, {
      yPercent: 110,
      duration: options?.duration ?? 0.75,
      ease: 'power3.out',
      stagger: options?.stagger ?? 0.04,
      scrollTrigger: {
        trigger: el,
        start: options?.start ?? 'top 88%',
      },
    });
  });
}

export function initScrollReveal(selector: string = '[data-reveal]'): void {
  const elements = document.querySelectorAll<HTMLElement>(selector);

  elements.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 32,
      duration: 0.8,
      delay: Number(el.dataset.delay ?? 0),
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      },
    });
  });
}
