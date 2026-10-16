import { useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/** Splits "160+" or "4" into its prefix, digits and suffix so only the number moves. */
const NUMERIC = /^([^\d]*)([\d,]+)(.*)$/;
const DURATION = 900;

interface CountUpProps {
  /** The final, verbatim figure. Always accessible to screen readers. */
  value: string;
  className?: string;
}

/**
 * Displays a verified metric value immediately.
 * Under normal motion, smoothly counts up once when scrolled into view.
 * Under reduced motion, displays the final value statically with zero layout shift.
 * Screen readers always receive exactly one stable, final string without false zero readings.
 */
export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion() ?? false;
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced || !inView || hasAnimated.current) return;

    const match = value.match(NUMERIC);
    if (!match) return;

    hasAnimated.current = true;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ''));
    if (!Number.isFinite(target)) return;

    const grouped = digits.includes(',');
    const render = (current: number) => {
      node.textContent = `${prefix}${grouped ? current.toLocaleString('en-US') : current}${suffix}`;
    };

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1);
      /* Ease-out cubic for natural deceleration */
      render(Math.round(target * (1 - (1 - progress) ** 3)));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        node.textContent = value;
      }
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
