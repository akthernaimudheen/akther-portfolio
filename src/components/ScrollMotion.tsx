import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type RevealDirection = 'up' | 'left' | 'right' | 'scale';

export function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
  amount?: number;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const offsets = {
    up: { x: 0, y: 20, scale: 1 },
    left: { x: -20, y: 0, scale: 1 },
    right: { x: 20, y: 0, scale: 1 },
    scale: { x: 0, y: 16, scale: 0.99 },
  }[direction];

  return (
    <motion.div
      className={`reveal ${className}`.trim()}
      initial={reducedMotion ? false : { opacity: 0, ...offsets }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount, margin: '0px 0px -5% 0px' }}
      transition={{ duration: reducedMotion ? 0 : 0.44, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
