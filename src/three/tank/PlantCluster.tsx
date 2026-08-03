import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

export type PlantHue = 'green' | 'emerald' | 'moss';

const PALETTE: Record<PlantHue, { stem: string; leaf: string }> = {
  green: { stem: '#15803d', leaf: '#22c55e' },
  emerald: { stem: '#065f46', leaf: '#10b981' },
  moss: { stem: '#3f6212', leaf: '#84cc16' },
};

interface PlantSpec {
  position: [number, number, number];
  scale: number;
  hue: PlantHue;
  phase: number;
}

interface PlantClusterProps {
  count: number;
  area: number;
  y?: number;
  seed?: number;
  hue?: PlantHue;
}

/**
 * Cluster of procedural plants at deterministic positions so the
 * layout doesn't reshuffle on re-render. Used inside the tank
 * to add foreground foliage for any added "plant" decor items.
 */
export function PlantCluster({ count, area, y = -0.85, seed = 7, hue }: PlantClusterProps) {
  const plants = useMemo<PlantSpec[]>(() => {
    const rng = mulberry32(seed);
    return Array.from({ length: count }, () => {
      const x = (rng() - 0.5) * area;
      const z = (rng() - 0.5) * (area * 0.7);
      const scale = 0.45 + rng() * 0.4;
      const phase = rng() * Math.PI * 2;
      const chosenHue: PlantHue =
        hue ?? (['green', 'emerald', 'moss'] as PlantHue[])[Math.floor(rng() * 3)];
      return { position: [x, y, z], scale, hue: chosenHue, phase };
    });
  }, [count, area, y, seed, hue]);

  return (
    <group>
      {plants.map((p) => (
        <Plant key={`${p.position[0].toFixed(2)}-${p.position[2].toFixed(2)}`} {...p} />
      ))}
    </group>
  );
}

interface PlantProps {
  position: [number, number, number];
  scale: number;
  hue: PlantHue;
  phase: number;
}

function Plant({ position, scale, hue, phase }: PlantProps) {
  const groupRef = useRef<Group>(null);
  const palette = PALETTE[hue];

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.z = Math.sin(t * 0.6 + phase) * 0.12;
    groupRef.current.rotation.x = Math.cos(t * 0.45 + phase) * 0.08;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.035, 0.06, 1.0, 6]} />
        <meshStandardMaterial color={palette.stem} roughness={0.9} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.18, 0.9 + Math.sin(i) * 0.08, Math.sin(angle) * 0.18]}
            rotation={[0, angle, Math.PI / 4]}
          >
            <coneGeometry args={[0.12, 0.4, 6]} />
            <meshStandardMaterial color={palette.leaf} roughness={0.7} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.16, 8, 6]} />
        <meshStandardMaterial color="#3f3f46" roughness={1} />
      </mesh>
    </group>
  );
}

/** Tiny seeded RNG so the layout is stable across renders. */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
