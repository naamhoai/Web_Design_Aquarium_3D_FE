import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type FishSpecies =
  | 'neon-tetra'   // red/blue stripe
  | 'goldfish'     // orange/gold
  | 'angelfish'    // silver/black
  | 'cardinal'     // red/blue
  | 'guppy';       // multi-color

interface ProceduralFishProps {
  species?: FishSpecies;
  position?: [number, number, number];
  swimRadius?: number;
  swimSpeed?: number;
  swimCenter?: [number, number, number];
  size?: number;
  swimAxis?: 'xy' | 'xz' | 'yz';
  phaseOffset?: number;
}

const SPECIES_PALETTE: Record<FishSpecies, { body: string; belly: string; fin: string; accent?: string }> = {
  'neon-tetra': { body: '#dc2626', belly: '#fb7185', fin: '#1e3a8a', accent: '#5eead4' },
  'goldfish': { body: '#f59e0b', belly: '#fde047', fin: '#ea580c' },
  'angelfish': { body: '#e2e8f0', belly: '#f1f5f9', fin: '#0f172a', accent: '#475569' },
  'cardinal': { body: '#b91c1c', belly: '#ef4444', fin: '#1e40af', accent: '#3b82f6' },
  'guppy': { body: '#22c55e', belly: '#86efac', fin: '#f472b6', accent: '#fcd34d' },
};

/**
 * Procedural fish: body (ellipsoid) + tail (cone) + side fins.
 * The body swims along a Lissajous curve and the tail wags in sync.
 * Used for the background schools where GLTF loading would be expensive.
 */
export function ProceduralFish({
  species = 'neon-tetra',
  position = [0, 0, 0],
  swimRadius = 2,
  swimSpeed = 0.5,
  swimCenter,
  size = 0.4,
  swimAxis = 'xz',
  phaseOffset = 0,
}: ProceduralFishProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const palette = SPECIES_PALETTE[species];

  const center = useMemo<[number, number, number]>(
    () => swimCenter ?? position,
    [swimCenter, position]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime * swimSpeed + phaseOffset;
    if (!groupRef.current) return;

    // Lissajous path for organic swimming motion
    let x: number, y: number, z: number;
    if (swimAxis === 'xz') {
      x = center[0] + Math.cos(t) * swimRadius;
      y = center[1] + Math.sin(t * 0.7) * swimRadius * 0.3;
      z = center[2] + Math.sin(t) * swimRadius * 0.6;
    } else if (swimAxis === 'xy') {
      x = center[0] + Math.cos(t) * swimRadius;
      y = center[1] + Math.sin(t) * swimRadius;
      z = center[2] + Math.sin(t * 0.5) * swimRadius * 0.3;
    } else {
      x = center[0] + Math.cos(t) * swimRadius * 0.5;
      y = center[1] + Math.sin(t * 0.6) * swimRadius * 0.4;
      z = center[2] + Math.sin(t) * swimRadius;
    }

    // Heading direction
    const heading = Math.atan2(
      swimAxis === 'xz' ? Math.cos(t + 0.05) - Math.cos(t) : 0,
      swimAxis === 'xz' ? Math.sin(t + 0.05) - Math.sin(t) : 0
    );

    groupRef.current.position.set(x, y, z);
    groupRef.current.rotation.y = -heading;

    // Tail wag
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * 8) * 0.6;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body — ellipsoid */}
      <mesh scale={[size * 1.6, size * 0.9, size * 0.7]}>
        <sphereGeometry args={[0.5, 12, 10]} />
        <meshStandardMaterial color={palette.body} roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Belly highlight */}
      <mesh position={[0, -size * 0.3, 0]} scale={[size * 1.5, size * 0.3, size * 0.6]}>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial color={palette.belly} roughness={0.6} />
      </mesh>

      {/* Lateral stripe (accent) */}
      {palette.accent && (
        <mesh scale={[size * 1.5, size * 0.05, size * 0.65]}>
          <sphereGeometry args={[0.5, 10, 8]} />
          <meshStandardMaterial
            color={palette.accent}
            emissive={palette.accent}
            emissiveIntensity={0.4}
            roughness={0.4}
          />
        </mesh>
      )}

      {/* Tail */}
      <group ref={tailRef} position={[-size * 0.9, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} scale={[size * 0.6, size * 0.5, size * 0.05]}>
          <coneGeometry args={[0.5, 1, 6]} />
          <meshStandardMaterial color={palette.fin} roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Top dorsal fin */}
      <mesh position={[0, size * 0.5, 0]} scale={[size * 0.5, size * 0.3, size * 0.05]}>
        <coneGeometry args={[0.5, 1, 6]} />
        <meshStandardMaterial color={palette.fin} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Side fins */}
      <mesh position={[size * 0.2, -size * 0.2, size * 0.4]} rotation={[0.3, 0, 0]} scale={[size * 0.3, size * 0.2, size * 0.03]}>
        <sphereGeometry args={[0.5, 6, 6]} />
        <meshStandardMaterial color={palette.fin} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[size * 0.2, -size * 0.2, -size * 0.4]} rotation={[-0.3, 0, 0]} scale={[size * 0.3, size * 0.2, size * 0.03]}>
        <sphereGeometry args={[0.5, 6, 6]} />
        <meshStandardMaterial color={palette.fin} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Eye */}
      <mesh position={[size * 0.55, size * 0.15, size * 0.25]}>
        <sphereGeometry args={[size * 0.12, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[size * 0.6, size * 0.15, size * 0.28]}>
        <sphereGeometry args={[size * 0.06, 8, 8]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

interface FishSchoolProps {
  count?: number;
  species?: FishSpecies;
  area?: number;
  z?: number;
}

/**
 * A small school of fish that swim together across an area.
 */
export function FishSchool({
  count = 5,
  species = 'neon-tetra',
  area = 6,
  z = 0,
}: FishSchoolProps) {
  const fish = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        species,
        center: [
          (Math.random() - 0.5) * area * 0.4,
          (Math.random() - 0.5) * 1.5,
          z + (Math.random() - 0.5) * 1.5,
        ] as [number, number, number],
        radius: area * (0.3 + Math.random() * 0.4),
        speed: 0.3 + Math.random() * 0.4,
        size: 0.3 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
      })),
    [count, species, area, z]
  );

  return (
    <>
      {fish.map((f, i) => (
        <ProceduralFish
          key={i}
          species={f.species}
          swimCenter={f.center}
          swimRadius={f.radius}
          swimSpeed={f.speed}
          size={f.size}
          phaseOffset={f.phase}
          swimAxis="xz"
        />
      ))}
    </>
  );
}
