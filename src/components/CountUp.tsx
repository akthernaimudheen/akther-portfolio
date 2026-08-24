import { useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/** Splits "37,250+" into its prefix, digits and suffix so only the number moves. */
const NUMERIC = /^([^\d]*)([\d,]+)(.*)$/;

const DURATION = 1100;

interface CountUpProps {
  /** The final, verbatim figure. Rendered as-is whenever the count cannot run. */
  value: string;
  className?: string;
}

/**
 * Counts a reported figure up once, the first time it enters view.
 *
 * The animated span is hidden from assistive technology and paired with a
 * visually hidden copy of the real value, so a screen reader is never read a
 * half-counted number. Under reduced motion — or if `value` carries no digits to
 * animate — the figure simply renders at its final value and nothing moves.
 */
export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const node = ref.current;
    const match = value.match(NUMERIC);
    if (!node || !match || reduced) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ''));
    if (!Number.isFinite(target)) return;

    const grouped = digits.includes(',');
    const render = (current: number) => {
      node.textContent = `${prefix}${grouped ? current.toLocaleString('en-US') : current}${suffix}`;
    };

    /* Parked at zero until it scrolls into view, so the figure never visibly
       resets from its final value in front of the reader. */
    if (!inView) {
      render(0);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1);
      /* Ease out cubic: fast enough to read as a result, not a slot machine. */
      render(Math.round(target * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
