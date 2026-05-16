'use client';

import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 20 },
  enter:   { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -20 },
};

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
