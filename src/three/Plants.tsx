import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlantProps {
  position?: [number, number, number];
  scale?: number;
  hue?: 'green' | 'emerald' | 'moss';
  swayPhase?: number;
}

/**
 * A simple aquarium plant — curved stem + leaves, gently swaying.
 * Built from primitives (cylinder + cone/leaf planes) so it stays
 * lightweight and procedural.
 */
export function Plant({
  position = [0, 0, 0],
  scale = 1,
  hue = 'green',
  swayPhase = 0,
}: PlantProps) {
  const groupRef = useRef<THREE.Group>(null);

  const palette = {
    green: { stem: '#15803d', leaf: '#22c55e' },
    emerald: { stem: '#065f46', leaf: '#10b981' },
    moss: { stem: '#3f6212', leaf: '#84cc16' },
  }[hue];

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.z = Math.sin(t * 0.7 + swayPhase) * 0.12;
    groupRef.current.rotation.x = Math.cos(t * 0.5 + swayPhase) * 0.08;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1.2, 6]} />
        <meshStandardMaterial color={palette.stem} roughness={0.9} />
      </mesh>

      {/* Leaves — 4 angled around the top */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.18, 1.0 + Math.sin(i) * 0.1, Math.sin(angle) * 0.18]}
            rotation={[0, angle, Math.PI / 4]}
          >
            <coneGeometry args={[0.12, 0.4, 6]} />
            <meshStandardMaterial color={palette.leaf} roughness={0.7} />
          </mesh>
        );
      })}

      {/* Base rocks */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.18, 8, 6]} />
        <meshStandardMaterial color="#3f3f46" roughness={1} />
      </mesh>
    </group>
  );
}

interface PlantClusterProps {
  count?: number;
  area?: number;
  z?: number;
}

/**
 * A cluster of plants scattered across the foreground.
 */
export function PlantCluster({ count = 5, area = 8, z = -2 }: PlantClusterProps) {
  const plants = Array.from({ length: count }, (_, i) => ({
    x: (Math.random() - 0.5) * area,
    y: -2 + Math.random() * 0.3,
    z: z + (Math.random() - 0.5) * 1.5,
    scale: 0.6 + Math.random() * 0.6,
    hue: (['green', 'emerald', 'moss'] as const)[i % 3],
    phase: Math.random() * Math.PI * 2,
  }));

  return (
    <>
      {plants.map((p, i) => (
        <Plant
          key={i}
          position={[p.x, p.y, p.z]}
          scale={p.scale}
          hue={p.hue}
          swayPhase={p.phase}
        />
      ))}
    </>
  );
}
