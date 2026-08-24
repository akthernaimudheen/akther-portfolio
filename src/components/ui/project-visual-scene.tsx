import { useEffect, useRef, type RefObject } from 'react';
import { cn } from '@/lib/utils';
import { pointerEffectsEnabled, watchPointerEffects } from '@/lib/pointer';

interface ProjectVisualSceneProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  /** Adds the pointer-following highlight. Off for purely decorative thumbnails. */
  interactive?: boolean;
}

const SCENE_WIDTH = 1536;
const SCENE_HEIGHT = 864;
const SRCSET_STEPS = [768, 1152];
const SCENE_SIZES = '(max-width: 780px) 92vw, (max-width: 1280px) 70vw, 76rem';

function sceneSrcSet(src: string) {
  if (!src.endsWith('.webp')) return undefined;
  const base = src.slice(0, -'.webp'.length);
  return [...SRCSET_STEPS.map((width) => `${base}-${width}.webp ${width}w`), `${src} ${SCENE_WIDTH}w`].join(', ');
}

/**
 * Tracks the pointer across one figure and publishes its position as two CSS
 * custom properties, which the stylesheet turns into a soft highlight.
 *
 * Writes are coalesced into one `requestAnimationFrame` per frame and go
 * straight to the node — no React state is touched while the pointer moves.
 * Nothing is attached on touch devices or under reduced motion.
 */
function useHighlight(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;

    let detach: (() => void) | undefined;

    const attach = (enabled: boolean) => {
      detach?.();
      detach = undefined;

      const node = ref.current;
      if (!node || !enabled) return;

      let frame = 0;
      let nextX = 50;
      let nextY = 50;

      const write = () => {
        frame = 0;
        node.style.setProperty('--highlight-x', `${nextX.toFixed(1)}%`);
        node.style.setProperty('--highlight-y', `${nextY.toFixed(1)}%`);
      };

      const onMove = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        const rect = node.getBoundingClientRect();
        nextX = ((event.clientX - rect.left) / rect.width) * 100;
        nextY = ((event.clientY - rect.top) / rect.height) * 100;
        if (!frame) frame = requestAnimationFrame(write);
      };

      node.addEventListener('pointermove', onMove, { passive: true });
      detach = () => {
        node.removeEventListener('pointermove', onMove);
        if (frame) cancelAnimationFrame(frame);
        node.style.removeProperty('--highlight-x');
        node.style.removeProperty('--highlight-y');
      };
    };

    attach(pointerEffectsEnabled());
    const stopWatching = watchPointerEffects(attach);

    return () => {
      stopWatching();
      detach?.();
    };
  }, [ref, active]);
}

export function ProjectVisualScene({
  src,
  alt,
  className,
  eager = false,
  interactive = false,
}: ProjectVisualSceneProps) {
  const srcSet = sceneSrcSet(src);
  const figureRef = useRef<HTMLElement>(null);
  useHighlight(figureRef, interactive);

  return (
    <figure
      ref={figureRef}
      className={cn('project-image', interactive && 'project-image--interactive', className)}
    >
      <img
        src={src}
        srcSet={srcSet}
        sizes={srcSet ? SCENE_SIZES : undefined}
        width={SCENE_WIDTH}
        height={SCENE_HEIGHT}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
      />
    </figure>
  );
}
