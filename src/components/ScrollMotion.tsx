import { useRef, type ReactNode } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

type RevealDirection = 'up' | 'left' | 'right' | 'scale';

export function ScrollProgress() {
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: reducedMotion ? 1000 : 150,
    damping: reducedMotion ? 100 : 28,
    mass: 0.28,
  });

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="scroll-rail" aria-hidden="true">
        <span>SCROLL</span>
        <i><motion.b style={{ scaleY: progress }} /></i>
      </div>
    </>
  );
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  amount = 0.22,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
  amount?: number;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const offsets = {
    up: { x: 0, y: 56, scale: 1 },
    left: { x: -64, y: 0, scale: 1 },
    right: { x: 64, y: 0, scale: 1 },
    scale: { x: 0, y: 28, scale: 0.94 },
  }[direction];

  return (
    <motion.div
      className={`motion-reveal ${className}`.trim()}
      initial={reducedMotion ? false : { opacity: 0, ...offsets, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount, margin: '0px 0px -8% 0px' }}
      transition={{ duration: reducedMotion ? 0 : 0.78, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Parallax({
  children,
  className = '',
  distance = 70,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [distance, -distance]);

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

const marqueeLine = 'WEB DEVELOPMENT  /  SEO  /  DIGITAL MARKETING  /  3D EXPERIENCES  /  AI-ASSISTED WORKFLOWS  /  ';

export function ScrollMarquee() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const forward = useTransform(scrollYProgress, [0, 1], reducedMotion ? ['0%', '0%'] : ['-8%', '-34%']);
  const reverse = useTransform(scrollYProgress, [0, 1], reducedMotion ? ['-18%', '-18%'] : ['-38%', '-10%']);

  return (
    <section ref={ref} className="motion-marquee" aria-label="Core disciplines">
      <motion.div className="motion-marquee__track" style={{ x: forward }}>
        <span>{marqueeLine.repeat(3)}</span>
      </motion.div>
      <motion.div className="motion-marquee__track motion-marquee__track--outline" style={{ x: reverse }} aria-hidden="true">
        <span>{marqueeLine.repeat(3)}</span>
      </motion.div>
    </section>
  );
}
