import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlantClusterProps {
  position?: [number, number, number];
  scale?: number;
  hue?: 'emerald' | 'lime' | 'deep-green';
  stemCount?: number;
}

/**
 * Realistic aquatic plant cluster with curved, waving ribbon leaves (Vallisneria / Amazon Sword)
 * that gently undulate with fluid dynamics.
 */
export function AquaticFlora({
  position = [0, 0, 0],
  scale = 1,
  hue = 'emerald',
  stemCount = 7,
}: PlantClusterProps) {
  const groupRef = useRef<THREE.Group>(null);

  const colors = {
    emerald: { base: '#065f46', tip: '#10b981', specular: '#34d399' },
    lime: { base: '#15803d', tip: '#84cc16', specular: '#bef264' },
    'deep-green': { base: '#064e3b', tip: '#059669', specular: '#6ee7b7' },
  }[hue];

  // Generate randomized curved ribbon leaves radiating from the base
  const leaves = useMemo(() => {
    return Array.from({ length: stemCount }, (_, i) => {
      const angle = (i / stemCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const height = 1.4 + Math.random() * 0.9;
      const spread = 0.3 + Math.random() * 0.4;
      const leanX = Math.cos(angle) * spread;
      const leanZ = Math.sin(angle) * spread;
      const swaySpeed = 1.2 + Math.random() * 0.8;
      const phase = Math.random() * Math.PI * 2;
      return { angle, height, leanX, leanZ, swaySpeed, phase };
    });
  }, [stemCount]);

  const leafRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    leaves.forEach((l, i) => {
      const g = leafRefs.current[i];
      if (!g) return;
      // Fluid sinusoidal sway that bends at the top
      const sway = Math.sin(t * l.swaySpeed + l.phase) * 0.15;
      g.rotation.z = sway + l.leanX * 0.5;
      g.rotation.x = Math.cos(t * l.swaySpeed * 0.8 + l.phase) * 0.12 + l.leanZ * 0.5;
    });
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Root cluster base stone */}
      <mesh position={[0, 0.05, 0]}>
        <dodecahedronGeometry args={[0.22, 1]} />
        <meshStandardMaterial color="#44403c" roughness={0.8} />
      </mesh>

      {leaves.map((l, i) => (
        <group
          key={i}
          ref={(el) => { leafRefs.current[i] = el; }}
          position={[0, 0.05, 0]}
        >
          {/* Stem / Lower blade */}
          <mesh position={[0, l.height * 0.3, 0]} scale={[0.04, l.height * 0.6, 0.012]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={colors.base}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>

          {/* Upper flowing blade tip */}
          <mesh position={[0, l.height * 0.75, 0]} scale={[0.07, l.height * 0.5, 0.008]}>
            <coneGeometry args={[0.5, 1, 8]} />
            <meshPhysicalMaterial
              color={colors.tip}
              transparent
              opacity={0.9}
              roughness={0.25}
              transmission={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Natural sculpted mossy river stone cluster
 */
export function RiverRocks({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main ancient boulder */}
      <mesh position={[0, 0.25, 0]} rotation={[0.2, 0.5, -0.1]} scale={[0.7, 0.5, 0.55]}>
        <dodecahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial color="#57534e" roughness={0.85} />
      </mesh>
      {/* Moss cap */}
      <mesh position={[0.05, 0.48, 0.02]} rotation={[0.1, 0.4, 0]} scale={[0.5, 0.12, 0.4]}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial color="#3f6212" roughness={0.9} />
      </mesh>
      {/* Small companion pebble 1 */}
      <mesh position={[-0.55, 0.12, 0.3]} scale={[0.3, 0.22, 0.25]}>
        <dodecahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#78716c" roughness={0.8} />
      </mesh>
      {/* Small companion pebble 2 */}
      <mesh position={[0.6, 0.1, -0.2]} scale={[0.35, 0.18, 0.28]}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#a8a29e" roughness={0.75} />
      </mesh>
    </group>
  );
}
