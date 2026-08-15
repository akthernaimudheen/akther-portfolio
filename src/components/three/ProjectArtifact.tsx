import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, OrbitControls } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import type { ProjectKind } from '@/data/projects';

function Artifact({ kind, active, reducedMotion }: { kind: ProjectKind; active: boolean; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { pointer } = useThree();
  useFrame(({ clock }, delta) => {
    if (!group.current || reducedMotion) return;
    const targetY = pointer.x * .55 + clock.getElapsedTime() * (active ? 0.28 : 0.13);
    const targetX = pointer.y * -.35 + Math.sin(clock.getElapsedTime() * 0.42) * 0.1;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, hovered ? 1.2 : 1.02, 5, delta));
  });

  const material = (
    <meshPhysicalMaterial
      color={active ? '#d8ff00' : '#7590ff'}
      emissive={active ? '#496000' : '#07144d'}
      emissiveIntensity={active ? 1.15 : 0.65}
      roughness={0.22}
      metalness={0.42}
      clearcoat={0.8}
    />
  );

  return (
    <Float speed={reducedMotion ? 0 : 1.6} rotationIntensity={0.18} floatIntensity={0.3}>
      <group ref={group} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        {kind === 'signal' && (
          <>
            <mesh rotation={[Math.PI / 2, 0, 0]}>{material}<torusGeometry args={[0.95, 0.18, 24, 72]} /></mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>{material}<torusGeometry args={[0.62, 0.09, 18, 56]} /></mesh>
            <mesh>{material}<icosahedronGeometry args={[0.38, 1]} /></mesh>
          </>
        )}
        {kind === 'hotel' && (
          <>
            <mesh position={[0, 0.1, 0]}>{material}<boxGeometry args={[1.25, 1.65, 0.6]} /></mesh>
            {[-0.36, 0, 0.36].map((x) =>
              [-0.42, 0, 0.42].map((y) => (
                <mesh key={`${x}-${y}`} position={[x, y + 0.12, 0.32]}>
                  <boxGeometry args={[0.16, 0.16, 0.03]} />
                  <meshBasicMaterial color="#ff6a36" toneMapped={false} />
                </mesh>
              )),
            )}
          </>
        )}
        {kind === 'web' && (
          <>
            <mesh position={[-0.36, 0.18, 0]} rotation={[0.1, -0.24, -0.08]}>{material}<boxGeometry args={[1.25, 0.82, 0.12]} /></mesh>
            <mesh position={[0.34, -0.16, 0.2]} rotation={[-0.08, 0.22, 0.09]}>
              <boxGeometry args={[1.25, 0.82, 0.12]} />
              <meshPhysicalMaterial color="#ff6638" emissive="#4b0d00" emissiveIntensity={0.65} roughness={0.25} />
            </mesh>
          </>
        )}
        {kind === 'lab' && (
          <>
            <mesh>{material}<octahedronGeometry args={[0.82, 0]} /></mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.18, 0.035, 12, 64]} />
              <meshBasicMaterial color="#ff6030" toneMapped={false} />
            </mesh>
            <mesh rotation={[0.7, 0.3, 0]}>
              <torusGeometry args={[1.0, 0.025, 12, 64]} />
              <meshBasicMaterial color="#d8ff00" toneMapped={false} />
            </mesh>
          </>
        )}
      </group>
    </Float>
  );
}

export function ProjectArtifact({
  kind,
  active,
  reducedMotion,
}: {
  kind: ProjectKind;
  active: boolean;
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      className="artifact-canvas"
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={2.3} color="#9fb3ff" />
      <pointLight position={[-3, -2, 3]} intensity={22} distance={8} color="#ff522c" />
      <Artifact kind={kind} active={active} reducedMotion={reducedMotion} />
      <Environment preset="city" environmentIntensity={0.5} />
      {!reducedMotion && <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.65} />}
    </Canvas>
  );
}
