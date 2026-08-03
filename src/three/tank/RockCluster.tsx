import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

export type RockKind = 'stone' | 'driftwood';

interface RockSpec {
  position: [number, number, number];
  scale: [number, number, number];
  rotationY: number;
  tone: string;
}

interface RockClusterProps {
  count: number;
  area: number;
  y?: number;
  seed?: number;
  kind?: RockKind;
}

const STONE_TONES = ['#64748b', '#475569', '#78716c', '#94a3b8'];

/**
 * A cluster of procedural rocks or lũa (driftwood) cylinders, placed
 * deterministically so the user sees the same composition after each
 * render. Used for decor items added to the tank.
 */
export function RockCluster({ count, area, y = -0.8, seed = 11, kind = 'stone' }: RockClusterProps) {
  const rocks = useMemo<RockSpec[]>(() => {
    const rng = mulberry32(seed);
    return Array.from({ length: count }, () => {
      const x = (rng() - 0.5) * area * 0.9;
      const z = (rng() - 0.5) * (area * 0.6);
      const sx = 0.4 + rng() * 0.5;
      const sy = 0.3 + rng() * 0.4;
      const sz = 0.4 + rng() * 0.5;
      const rotationY = rng() * Math.PI * 2;
      const tone = STONE_TONES[Math.floor(rng() * STONE_TONES.length)];
      return { position: [x, y + sy * 0.4, z], scale: [sx, sy, sz], rotationY, tone };
    });
  }, [count, area, y, seed]);

  return (
    <group>
      {rocks.map((r, i) =>
        kind === 'driftwood' ? (
          <Driftwood key={i} {...r} />
        ) : (
          <Stone key={i} {...r} />
        )
      )}
    </group>
  );
}

function Stone({ position, scale, rotationY, tone }: RockSpec) {
  return (
    <mesh position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <icosahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial color={tone} roughness={1} flatShading />
    </mesh>
  );
}

function Driftwood({ position, scale, rotationY }: RockSpec) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.z = Math.sin(t * 0.4 + position[0]) * 0.04;
  });
  return (
    <group ref={group} position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <mesh rotation={[0, 0, Math.PI / 2.2]}>
        <cylinderGeometry args={[0.16, 0.12, 1.2, 8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 0.3, 0]} rotation={[0, 0, -Math.PI / 3]}>
        <cylinderGeometry args={[0.1, 0.07, 0.7, 8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.95} />
      </mesh>
      <mesh position={[-0.3, 0.2, 0.05]} rotation={[0, 0, Math.PI / 2.5]}>
        <cylinderGeometry args={[0.08, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.95} />
      </mesh>
    </group>
  );
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
