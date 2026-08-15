import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { ProjectKind } from '@/data/projects';
import { cn } from '@/lib/utils';

interface ProjectVisualSceneProps {
  src: string;
  alt: string;
  kind: ProjectKind;
  index?: string;
  className?: string;
  eager?: boolean;
}

export function ProjectVisualScene({
  src,
  alt,
  kind,
  index,
  className,
  eager = false,
}: ProjectVisualSceneProps) {
  const sceneRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const pointerX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20, mass: 0.35 });
  const pointerY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20, mass: 0.35 });
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], reducedMotion ? ['0%', '0%'] : ['-4%', '4%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], reducedMotion ? [1.05, 1.05, 1.05] : [1.14, 1.04, 1.13]);
  const depthY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [34, -34]);
  const orbitRotate = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [-22, 34]);
  const glowX = useTransform(scrollYProgress, [0, 1], reducedMotion ? ['0%', '0%'] : ['-18%', '22%']);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 8);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * -7);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.figure
      ref={sceneRef}
      className={cn('ai-scene', `ai-scene--${kind}`, className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      style={{ rotateX: pointerY, rotateY: pointerX, transformPerspective: 1200 }}
    >
      <motion.div className="ai-scene__depth ai-scene__depth--back" style={{ y: depthY }} aria-hidden="true">
        <img src={src} alt="" loading="lazy" decoding="async" />
      </motion.div>

      <div className="ai-scene__frame">
        <motion.img
          className="ai-scene__image"
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          style={{ y: imageY, scale: imageScale }}
        />
        <div className="ai-scene__grade" aria-hidden="true" />
        <motion.div className="ai-scene__light" style={{ x: glowX }} aria-hidden="true" />
      </div>

      <motion.div className="ai-scene__orbit" style={{ rotate: orbitRotate }} aria-hidden="true">
        <i />
        <i />
      </motion.div>
      <div className="ai-scene__corner ai-scene__corner--one" aria-hidden="true" />
      <div className="ai-scene__corner ai-scene__corner--two" aria-hidden="true" />
      {index && <figcaption><span>{index}</span><small>SCROLL / MOVE</small></figcaption>}
    </motion.figure>
  );
}
