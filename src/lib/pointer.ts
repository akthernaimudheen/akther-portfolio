import { useEffect, type RefObject } from 'react';

/**
 * One pointer source for every cursor-reactive effect on the site.
 *
 * Subscribers get raw and spring-smoothed pointer coordinates from a single
 * `requestAnimationFrame` loop. Nothing in here touches React state: listeners
 * are expected to write straight to a transform, which is what keeps a
 * `pointermove` burst off the render path entirely.
 *
 * The loop only exists while at least one listener is attached, and parks
 * itself the moment the spring has settled, so a page nobody is pointing at
 * runs no animation frames at all — there is no continuous decorative motion.
 */

export interface PointerFrame {
  /** Raw pointer position, viewport pixels. */
  x: number;
  y: number;
  /** Spring-smoothed pointer position, viewport pixels. */
  sx: number;
  sy: number;
  /** Smoothed position normalised to -1..1 around the viewport centre. */
  nx: number;
  ny: number;
  /** False until a real pointer event has been seen, so nothing jumps from 0,0. */
  active: boolean;
}

type Listener = (frame: PointerFrame) => void;

/* Firm, controlled response. With damping > 2*sqrt(stiffness*mass) (=35.8 here)
   the follower is slightly overdamped: it catches up fast and never rings past
   the pointer. Explicit Euler stays stable well beyond the clamped step below. */
const STIFFNESS = 400;
const DAMPING = 42;
const MASS = 0.8;

/** Clamped step, so returning to a backgrounded tab cannot fling the follower. */
const MAX_STEP = 1 / 30;
const SETTLE_DISTANCE = 0.06;
const SETTLE_VELOCITY = 0.06;

const FINE_POINTER = '(pointer: fine)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * Both gates the brief requires before any pointer decoration mounts: a real
 * fine pointer, and no reduced-motion preference.
 */
export function pointerEffectsEnabled(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(FINE_POINTER).matches && !window.matchMedia(REDUCED_MOTION).matches;
}

/** Re-evaluates the two gates whenever either media query changes. */
export function watchPointerEffects(onChange: (enabled: boolean) => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  const queries = [window.matchMedia(FINE_POINTER), window.matchMedia(REDUCED_MOTION)];
  const notify = () => onChange(pointerEffectsEnabled());
  queries.forEach((query) => query.addEventListener('change', notify));
  return () => queries.forEach((query) => query.removeEventListener('change', notify));
}

const listeners = new Set<Listener>();
const frame: PointerFrame = { x: 0, y: 0, sx: 0, sy: 0, nx: 0, ny: 0, active: false };

let velocityX = 0;
let velocityY = 0;
let rafId = 0;
let lastTime = 0;

function normalise() {
  const halfWidth = window.innerWidth / 2 || 1;
  const halfHeight = window.innerHeight / 2 || 1;
  frame.nx = Math.max(-1, Math.min(1, (frame.sx - halfWidth) / halfWidth));
  frame.ny = Math.max(-1, Math.min(1, (frame.sy - halfHeight) / halfHeight));
}

function emit() {
  listeners.forEach((listener) => listener(frame));
}

function tick(now: number) {
  const step = Math.min((now - lastTime) / 1000, MAX_STEP);
  lastTime = now;

  if (step > 0) {
    velocityX += ((STIFFNESS * (frame.x - frame.sx) - DAMPING * velocityX) / MASS) * step;
    velocityY += ((STIFFNESS * (frame.y - frame.sy) - DAMPING * velocityY) / MASS) * step;
    frame.sx += velocityX * step;
    frame.sy += velocityY * step;
  }

  const settled =
    Math.abs(frame.x - frame.sx) < SETTLE_DISTANCE &&
    Math.abs(frame.y - frame.sy) < SETTLE_DISTANCE &&
    Math.abs(velocityX) < SETTLE_VELOCITY &&
    Math.abs(velocityY) < SETTLE_VELOCITY;

  if (settled) {
    frame.sx = frame.x;
    frame.sy = frame.y;
    velocityX = 0;
    velocityY = 0;
    rafId = 0;
    normalise();
    emit();
    return;
  }

  normalise();
  emit();
  rafId = requestAnimationFrame(tick);
}

function start() {
  if (rafId) return;
  lastTime = performance.now();
  rafId = requestAnimationFrame(tick);
}

function handlePointerMove(event: PointerEvent) {
  /* Touch taps would park the follower under the last finger position. */
  if (event.pointerType === 'touch') return;
  frame.x = event.clientX;
  frame.y = event.clientY;
  if (!frame.active) {
    frame.active = true;
    frame.sx = frame.x;
    frame.sy = frame.y;
  }
  start();
}

/**
 * Attaches `listener` to the shared loop and returns its detach function. The
 * listener is called once immediately so a fresh element can position itself
 * without waiting for the next pointer movement.
 */
export function subscribePointer(listener: Listener): () => void {
  if (typeof window === 'undefined') return () => {};

  if (listeners.size === 0) {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
  }
  listeners.add(listener);
  listener(frame);

  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    window.removeEventListener('pointermove', handlePointerMove);
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  };
}

export interface DriftOptions {
  /** Maximum horizontal travel in pixels at the edge of the viewport. */
  x?: number;
  /** Maximum vertical travel in pixels. */
  y?: number;
  /** Maximum tilt in degrees. Kept at or below 1.5deg for the portrait. */
  rotate?: number;
}

/**
 * Moves one element a few pixels toward the pointer.
 *
 * The transform is written directly to the node from the shared loop, so this
 * never re-renders and never animates a layout property. When pointer effects
 * are off (touch, or reduced motion) nothing subscribes and the element simply
 * stays where the stylesheet put it.
 */
export function usePointerDrift(ref: RefObject<HTMLElement | null>, options: DriftOptions) {
  const { x = 0, y = 0, rotate = 0 } = options;

  useEffect(() => {
    let detach: (() => void) | undefined;

    const attach = (enabled: boolean) => {
      detach?.();
      detach = undefined;

      const node = ref.current;
      if (!node) return;

      if (!enabled) {
        node.style.transform = '';
        return;
      }

      detach = subscribePointer((pointer) => {
        if (!pointer.active) return;
        const translate = `translate3d(${(pointer.nx * x).toFixed(2)}px, ${(pointer.ny * y).toFixed(2)}px, 0)`;
        node.style.transform = rotate
          ? `${translate} rotate(${(pointer.nx * rotate).toFixed(3)}deg)`
          : translate;
      });
    };

    attach(pointerEffectsEnabled());
    const stopWatching = watchPointerEffects(attach);

    return () => {
      stopWatching();
      detach?.();
    };
  }, [ref, x, y, rotate]);
}
