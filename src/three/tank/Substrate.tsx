import { useMemo } from 'react';
import { Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import type { BackgroundTheme } from './AquariumTank';

const GRAVEL_BASE: Record<BackgroundTheme, string> = {
  'deep-blue': '#2b2f3a',
  'amazon-forest': '#3a3327',
  'ancient-ruins': '#3d342a',
};

const PEBBLE_TINTS: Record<BackgroundTheme, string[]> = {
  'deep-blue': ['#4b5563', '#374151', '#64748b', '#1f2937', '#94a3b8'],
  'amazon-forest': ['#5b4a2f', '#6b5a3a', '#41381f', '#7c6a45', '#3f3a26'],
  'ancient-ruins': ['#6b5d4a', '#544636', '#7d6a52', '#4a3c2c', '#8a7860'],
};

/**
 * A realistic tank bed: a rough gravel plane strewn with a deterministic
 * scatter of small rounded pebbles in varied earthy tints. Instanced so
 * dozens of stones cost a single draw call.
 */
export function Substrate({
  w,
  d,
  y,
  theme,
  count = 64,
}: {
  w: number;
  d: number;
  y: number;
  theme: BackgroundTheme;
  count?: number;
}) {
  const pebbles = useMemo(() => {
    let seed = 91;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const tints = PEBBLE_TINTS[theme];
    return Array.from({ length: count }, () => {
      const s = 0.05 + rand() * 0.11;
      return {
        position: [
          (rand() - 0.5) * w * 0.92,
          y + s * 0.4,
          (rand() - 0.5) * d * 0.9,
        ] as [number, number, number],
        rotation: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI] as [
          number,
          number,
          number,
        ],
        scale: [s * (0.8 + rand() * 0.6), s * 0.7, s * (0.8 + rand() * 0.6)] as [
          number,
          number,
          number,
        ],
        color: tints[Math.floor(rand() * tints.length)],
      };
    });
  }, [w, d, y, theme, count]);

  return (
    <group>
      {/* Gravel bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={GRAVEL_BASE[theme]} roughness={1} metalness={0} />
      </mesh>

      {/* Scattered pebbles — single instanced draw call */}
      <Instances limit={count} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.85} metalness={0.05} vertexColors />
        {pebbles.map((p, i) => (
          <Instance
            key={i}
            position={p.position}
            rotation={p.rotation}
            scale={p.scale}
            color={new THREE.Color(p.color)}
          />
        ))}
      </Instances>
    </group>
  );
}
