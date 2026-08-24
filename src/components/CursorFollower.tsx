import { useEffect, useRef, useState } from 'react';
import { pointerEffectsEnabled, subscribePointer, watchPointerEffects } from '@/lib/pointer';

/**
 * A decorative pointer follower: a small ink dot pinned to the pointer and a
 * spring-damped outline ring trailing it.
 *
 * The native system cursor is never hidden — nothing here sets `cursor: none` —
 * so every affordance the browser communicates (text I-beam, resize, link hand)
 * survives. This is purely an extra layer, marked `aria-hidden` and
 * `pointer-events: none` in the stylesheet so it can neither be read out nor
 * swallow a click.
 *
 * It mounts only when `(pointer: fine)` matches and reduced motion is not
 * requested, and unmounts again if either preference changes mid-session.
 *
 * Positions are written straight to `transform` from the shared pointer loop in
 * `@/lib/pointer`. Hover states are written as data attributes and eased by CSS
 * transitions, so no `pointermove` handler ever calls `setState`.
 */

/** Ring diameter in pixels; the brief's 30–38px band. */
const RING_SIZE = 34;
const DOT_SIZE = 6;

/** How far the ring is allowed to lean toward a hovered control. */
const MAX_ATTRACTION = 6;
const ATTRACTION_RATIO = 0.16;
const PULL_EASING = 0.2;

const INTERACTIVE = 'a[href], button, summary, [role="button"], [data-cursor-target]';
/** Controls that need precision — the decoration steps aside and leaves the native cursor alone. */
const PRECISION = 'input, textarea, select, [contenteditable="true"], [contenteditable=""]';
/** Regions dark enough that `mix-blend-mode: difference` is predictable. */
const INVERTING = '[data-cursor-invert]';

export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEnabled(pointerEffectsEnabled());
    return watchPointerEffects(setEnabled);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    /* Rect of the control currently under the pointer, or null. Captured on
       enter and dropped on scroll rather than measured every frame, so the
       follower never forces a layout inside the animation loop. */
    let hoveredRect: DOMRect | null = null;
    let pullX = 0;
    let pullY = 0;

    const clamp = (value: number) => Math.max(-MAX_ATTRACTION, Math.min(MAX_ATTRACTION, value));

    const detach = subscribePointer((pointer) => {
      if (!pointer.active) return;

      dot.style.transform = `translate3d(${pointer.x - DOT_SIZE / 2}px, ${pointer.y - DOT_SIZE / 2}px, 0)`;

      let targetX = 0;
      let targetY = 0;
      if (hoveredRect) {
        targetX = clamp((hoveredRect.left + hoveredRect.width / 2 - pointer.sx) * ATTRACTION_RATIO);
        targetY = clamp((hoveredRect.top + hoveredRect.height / 2 - pointer.sy) * ATTRACTION_RATIO);
      }
      /* Ease the few pixels of attraction in and out so entering a link nudges
         the ring rather than snapping it. */
      pullX += (targetX - pullX) * PULL_EASING;
      pullY += (targetY - pullY) * PULL_EASING;

      ring.style.transform = `translate3d(${pointer.sx + pullX - RING_SIZE / 2}px, ${
        pointer.sy + pullY - RING_SIZE / 2
      }px, 0)`;

      if (!ring.dataset.ready) {
        ring.dataset.ready = 'true';
        dot.dataset.ready = 'true';
      }
    });

    const setState = (name: 'hover' | 'hidden' | 'invert', on: boolean) => {
      for (const node of [ring, dot]) {
        if (on) node.dataset[name] = 'true';
        else delete node.dataset[name];
      }
    };

    const evaluate = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null;
      const interactive = element?.closest(INTERACTIVE) ?? null;

      hoveredRect = interactive ? interactive.getBoundingClientRect() : null;
      setState('hover', Boolean(interactive));
      setState('invert', Boolean(element?.closest(INVERTING)));
      setState('hidden', Boolean(element?.closest(PRECISION)));
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      evaluate(event.target);
    };
    const onPointerDown = () => setState('hover', true);
    const onPointerUp = (event: PointerEvent) => evaluate(event.target);
    const onLeave = () => {
      hoveredRect = null;
      setState('hidden', true);
    };
    const onEnter = (event: PointerEvent) => {
      setState('hidden', false);
      evaluate(event.target);
    };
    /* A hovered control moves with the page, so the cached rect is dropped
       rather than recomputed; the next pointer event re-measures it. */
    const onScroll = () => {
      hoveredRect = null;
    };

    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('pointerenter', onEnter, { passive: true });
    document.addEventListener('pointerleave', onLeave, { passive: true });
    window.addEventListener('blur', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      detach();
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointerenter', onEnter);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <span />
      </div>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
