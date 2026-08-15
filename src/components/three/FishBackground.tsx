import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Fish({ reducedMotion }: { reducedMotion: boolean }) {
  const fish = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const finLeft = useRef<THREE.Mesh>(null);
  const finRight = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!fish.current) return;
    const t = reducedMotion ? 1.8 : clock.getElapsedTime();
    const progress = reducedMotion ? 0.62 : (0.35 + t * 0.026) % 1;
    fish.current.position.x = THREE.MathUtils.lerp(-7.2, 7.2, progress);
    fish.current.position.y = Math.sin(progress * Math.PI * 2) * 1.15 + 0.15;
    fish.current.position.z = -1.3 + Math.sin(progress * Math.PI * 4) * 0.4;
    fish.current.rotation.z = Math.sin(t * 0.52) * 0.08;
    fish.current.rotation.y = Math.sin(t * 0.3) * 0.08;

    if (tail.current) tail.current.rotation.y = Math.sin(t * 4.4) * 0.36;
    if (finLeft.current) finLeft.current.rotation.x = -0.9 + Math.sin(t * 3.2) * 0.24;
    if (finRight.current) finRight.current.rotation.x = 0.9 - Math.sin(t * 3.2) * 0.24;
  });

  return (
    <group ref={fish} scale={0.76} rotation={[0.05, 0, -0.03]}>
      <mesh scale={[1.75, 0.72, 0.58]}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshPhysicalMaterial
          color="#2458ff"
          roughness={0.23}
          metalness={0.28}
          clearcoat={0.8}
          clearcoatRoughness={0.12}
          emissive="#071a5f"
          emissiveIntensity={0.65}
        />
      </mesh>
      <mesh position={[1.28, 0.05, 0]} scale={[0.72, 0.64, 0.55]}>
        <sphereGeometry args={[1, 40, 28]} />
        <meshPhysicalMaterial color="#ff582f" roughness={0.28} metalness={0.18} clearcoat={0.7} />
      </mesh>
      <mesh position={[1.62, 0.17, 0.42]}>
        <sphereGeometry args={[0.11, 18, 18]} />
        <meshStandardMaterial color="#d8ff00" emissive="#d8ff00" emissiveIntensity={2.2} />
      </mesh>
      <mesh position={[1.62, 0.17, -0.42]}>
        <sphereGeometry args={[0.11, 18, 18]} />
        <meshStandardMaterial color="#d8ff00" emissive="#d8ff00" emissiveIntensity={2.2} />
      </mesh>

      <group ref={tail} position={[-1.52, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} scale={[1.05, 0.18, 1.25]}>
          <coneGeometry args={[0.74, 1.7, 3]} />
          <meshPhysicalMaterial
            color="#ff5a2a"
            roughness={0.3}
            metalness={0.08}
            transparent
            opacity={0.88}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      <mesh position={[-0.2, 0.64, 0]} rotation={[0, 0, -0.15]} scale={[0.72, 0.14, 0.62]}>
        <coneGeometry args={[0.58, 1.3, 3]} />
        <meshPhysicalMaterial color="#a8c2ff" transparent opacity={0.58} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={finLeft} position={[0.15, -0.3, 0.48]} rotation={[-0.9, 0.2, 0]} scale={[0.62, 0.12, 0.7]}>
        <coneGeometry args={[0.48, 1.12, 3]} />
        <meshPhysicalMaterial color="#ff7b43" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={finRight} position={[0.15, -0.3, -0.48]} rotation={[0.9, -0.2, 0]} scale={[0.62, 0.12, 0.7]}>
        <coneGeometry args={[0.48, 1.12, 3]} />
        <meshPhysicalMaterial color="#ff7b43" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Particles() {
  const points = useRef<THREE.Points>(null);
  const positions = new Float32Array([
    -5, 2, -2, -3.5, -1.5, -1, -1, 2.5, -3, 1.5, -2, -2, 3.5, 1.8, -1, 5, -1.4, -3,
    6, 2.4, -2, -6, -2.2, -3,
  ]);

  useFrame(({ clock }) => {
    if (points.current) points.current.rotation.z = clock.getElapsedTime() * 0.012;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#8ca8ff" size={0.075} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export function FishBackground({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="fish-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8.7], fov: 46 }}
        dpr={[1, 1.45]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.72} />
        <directionalLight position={[4, 5, 6]} intensity={2.4} color="#93a9ff" />
        <pointLight position={[-4, -2, 4]} intensity={28} distance={10} color="#ff481f" />
        <Fish reducedMotion={reducedMotion} />
        <Particles />
        <Environment preset="city" environmentIntensity={0.22} />
      </Canvas>
    </div>
  );
}
