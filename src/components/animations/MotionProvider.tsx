'use client';

import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

// Wraps the app in AnimatePresence so page transitions fire on route changes.
// initial={false} prevents the enter animation on first load — the Preloader
// handles the initial reveal.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <div key={pathname}>{children}</div>
    </AnimatePresence>
  );
}
