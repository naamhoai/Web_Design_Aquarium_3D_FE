import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type FishType = 'koi' | 'goldfish' | 'betta' | 'neon' | 'discus';

interface RealisticFishProps {
  type?: FishType;
  position?: [number, number, number];
  scale?: number;
  swimRadius?: number;
  swimSpeed?: number;
  swimCenter?: [number, number, number];
  swimHeight?: number;
  phaseOffset?: number;
}

interface FishPalette {
  primary: string;
  secondary: string;
  belly: string;
  fin: string;
  finTip: string;
  eyeIris: string;
  glow: string;
}

const PALETTES: Record<FishType, FishPalette> = {
  koi: {
    primary: '#ff5e00',      // Vivid fiery orange
    secondary: '#ffffff',    // Pearlescent white patches
    belly: '#fff5eb',        // Soft cream belly
    fin: '#ff772e',          // Semi-translucent orange fins
    finTip: '#ffffff',       // White tipped fins
    eyeIris: '#fbbf24',      // Golden amber iris
    glow: '#ff884d',
  },
  goldfish: {
    primary: '#f97316',      // Golden orange
    secondary: '#e11d48',    // Crimson accents
    belly: '#fef3c7',
    fin: '#fb923c',
    finTip: '#fed7aa',
    eyeIris: '#f59e0b',
    glow: '#fdba74',
  },
  betta: {
    primary: '#0284c7',      // Royal sapphire blue
    secondary: '#06b6d4',    // Cyan iridescence
    belly: '#082f49',
    fin: '#38bdf8',
    finTip: '#a5f3fc',
    eyeIris: '#38bdf8',
    glow: '#0284c7',
  },
  neon: {
    primary: '#ef4444',      // Neon red lower body
    secondary: '#00f2fe',    // Neon cyan luminous upper stripe
    belly: '#ffffff',
    fin: '#bae6fd',
    finTip: '#e0f2fe',
    eyeIris: '#38bdf8',
    glow: '#00f2fe',
  },
  discus: {
    primary: '#ec4899',      // Magenta / pink
    secondary: '#3b82f6',    // Electric blue striations
    belly: '#fdf2f8',
    fin: '#f472b6',
    finTip: '#60a5fa',
    eyeIris: '#ef4444',      // Red discus eye
    glow: '#ec4899',
  },
};

/**
 * High-end procedural organic 3D fish with:
 * - Multi-segment spinal wave articulation (carangiform fish physics)
 * - Flowing translucent fins that flutter and ripple
 * - Glossy clearcoat wet scales that catch studio lights
 * - Expressive eyes with corneal specular sheen
 * - Organic swimming trajectory with natural banking/rolling on curves
 */
export function RealisticFish({
  type = 'koi',
  position = [0, 0, 0],
  scale = 1,
  swimRadius = 1.3,
  swimSpeed = 0.8,
  swimCenter,
  swimHeight = 0.35,
  phaseOffset = 0,
}: RealisticFishProps) {
  const mainGroup = useRef<THREE.Group>(null);
  const spine1 = useRef<THREE.Group>(null); // Mid body
  const spine2 = useRef<THREE.Group>(null); // Posterior
  const spine3 = useRef<THREE.Group>(null); // Tail peduncle
  const caudalFin = useRef<THREE.Group>(null); // Main tail fan
  const dorsalFin = useRef<THREE.Mesh>(null);
  const leftPecFin = useRef<THREE.Group>(null);
  const rightPecFin = useRef<THREE.Group>(null);

  const palette = PALETTES[type];
  const center = useMemo<[number, number, number]>(
    () => swimCenter ?? position,
    [swimCenter, position]
  );

  // Fin Material: translucent, double sided with soft sheen
  const finMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: palette.fin,
        transparent: true,
        opacity: 0.82,
        roughness: 0.15,
        transmission: 0.45,
        thickness: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false,
        emissive: palette.glow,
        emissiveIntensity: 0.25,
      }),
    [palette]
  );

  // Body Skin Material: wet glossy fish scales with clearcoat
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: palette.primary,
        roughness: 0.18,
        metalness: 0.12,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1,
      }),
    [palette]
  );

  // Belly Material: pearlescent soft underbelly
  const bellyMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: palette.belly,
        roughness: 0.25,
        metalness: 0.05,
        clearcoat: 0.7,
      }),
    [palette]
  );

  useFrame((state) => {
    if (!mainGroup.current) return;
    const t = state.clock.elapsedTime * swimSpeed + phaseOffset;

    // Organic swimming path (Figure-8 / Lissajous loop)
    const x = center[0] + Math.sin(t) * swimRadius;
    const z = center[1] + Math.sin(t * 2) * (swimRadius * 0.45);
    const y = center[2] + Math.sin(t * 1.4) * swimHeight;

    // Velocity derivatives to compute tangent direction
    const dx = Math.cos(t) * swimRadius;
    const dz = Math.cos(t * 2) * 2 * (swimRadius * 0.45);
    const heading = Math.atan2(dx, dz);

    mainGroup.current.position.set(x, y, z);
    mainGroup.current.rotation.y = heading - Math.PI / 2;

    // Bank into turns (like a real fish rolling into a curve)
    const turnCurvature = Math.sin(t * 2);
    mainGroup.current.rotation.x = THREE.MathUtils.lerp(
      mainGroup.current.rotation.x,
      -turnCurvature * 0.22,
      0.1
    );
    mainGroup.current.rotation.z = THREE.MathUtils.lerp(
      mainGroup.current.rotation.z,
      (Math.cos(t * 1.4) * 0.1),
      0.1
    );

    // Carangiform Wave Propagation along the spine:
    // Wave moves from head to tail with increasing amplitude and phase lag
    const waveFreq = 7.5 * (swimSpeed * 1.1);
    const waveT = state.clock.elapsedTime * waveFreq + phaseOffset;

    if (spine1.current) {
      spine1.current.rotation.y = Math.sin(waveT) * 0.14;
    }
    if (spine2.current) {
      spine2.current.rotation.y = Math.sin(waveT - 0.7) * 0.25;
    }
    if (spine3.current) {
      spine3.current.rotation.y = Math.sin(waveT - 1.4) * 0.42;
    }
    if (caudalFin.current) {
      // Tail fan has the largest wave whip motion
      caudalFin.current.rotation.y = Math.sin(waveT - 2.1) * 0.55;
      caudalFin.current.rotation.z = Math.cos(waveT - 2.1) * 0.12;
    }

    // Dorsal fin subtle wave ripple
    if (dorsalFin.current) {
      dorsalFin.current.rotation.z = Math.sin(waveT - 0.5) * 0.08;
    }

    // Pectoral fins flap rhythmically to steer
    const flap = Math.sin(waveT * 0.8) * 0.32;
    if (leftPecFin.current) {
      leftPecFin.current.rotation.y = 0.4 + flap;
      leftPecFin.current.rotation.z = 0.2 + flap * 0.5;
    }
    if (rightPecFin.current) {
      rightPecFin.current.rotation.y = -0.4 - flap;
      rightPecFin.current.rotation.z = -0.2 - flap * 0.5;
    }
  });

  return (
    <group ref={mainGroup} scale={scale}>
      {/* ── Head & Thorax ── */}
      <group position={[0.4, 0, 0]}>
        {/* Snout & Head cone/sphere */}
        <mesh position={[0.2, 0.02, 0]} scale={[0.5, 0.35, 0.32]}>
          <sphereGeometry args={[0.5, 24, 20]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>

        {/* Shiny Pearl Under-jaw */}
        <mesh position={[0.18, -0.06, 0]} scale={[0.42, 0.22, 0.28]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <primitive object={bellyMaterial} attach="material" />
        </mesh>

        {/* Eyes (Left & Right) with Glassy Cornea & Golden Iris */}
        {[-1, 1].map((side) => (
          <group key={side} position={[0.28, 0.08, side * 0.15]} rotation={[0, side * 0.2, 0]}>
            {/* Sclera & Iris */}
            <mesh scale={[0.07, 0.07, 0.05]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color={palette.eyeIris} roughness={0.1} metalness={0.8} />
            </mesh>
            {/* Pupil */}
            <mesh position={[0.02, 0, side * 0.03]} scale={[0.038, 0.038, 0.03]}>
              <sphereGeometry args={[1, 14, 14]} />
              <meshBasicMaterial color="#050811" />
            </mesh>
            {/* Cornea reflection ring */}
            <mesh position={[0.03, 0.01, side * 0.04]} scale={[0.012, 0.012, 0.01]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}

        {/* Operculum (Gill covers) */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[0.06, 0.01, side * 0.17]}
            rotation={[0, side * 0.25, side * 0.1]}
            scale={[0.16, 0.25, 0.02]}
          >
            <sphereGeometry args={[0.5, 12, 12]} />
            <meshStandardMaterial
              color={palette.secondary}
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>
        ))}

        {/* Pectoral Fins (Left & Right) */}
        <group ref={leftPecFin} position={[0.05, -0.08, 0.16]}>
          <mesh position={[0, -0.12, 0.14]} rotation={[0.4, 0.2, -0.5]} scale={[0.18, 0.32, 0.015]}>
            <coneGeometry args={[0.5, 1, 16]} />
            <primitive object={finMaterial} attach="material" />
          </mesh>
        </group>
        <group ref={rightPecFin} position={[0.05, -0.08, -0.16]}>
          <mesh position={[0, -0.12, -0.14]} rotation={[-0.4, -0.2, -0.5]} scale={[0.18, 0.32, 0.015]}>
            <coneGeometry args={[0.5, 1, 16]} />
            <primitive object={finMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ── Mid Body (Articulated Spine Segment 1) ── */}
      <group ref={spine1} position={[0.05, 0, 0]}>
        {/* Main torso */}
        <mesh scale={[0.58, 0.44, 0.34]}>
          <sphereGeometry args={[0.5, 24, 20]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>
        {/* Belly contour */}
        <mesh position={[0, -0.08, 0]} scale={[0.54, 0.28, 0.3]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <primitive object={bellyMaterial} attach="material" />
        </mesh>

        {/* Majestic Dorsal Fin (along back) */}
        <mesh
          ref={dorsalFin}
          position={[-0.05, 0.3, 0]}
          rotation={[0, 0, 0.1]}
          scale={[0.45, 0.28, 0.018]}
        >
          <coneGeometry args={[0.5, 1.2, 20]} />
          <primitive object={finMaterial} attach="material" />
        </mesh>

        {/* ── Posterior / Mid-tail (Spine Segment 2) ── */}
        <group ref={spine2} position={[-0.28, 0, 0]}>
          <mesh scale={[0.46, 0.34, 0.24]}>
            <sphereGeometry args={[0.5, 20, 18]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.05, 0]} scale={[0.44, 0.22, 0.21]}>
            <sphereGeometry args={[0.5, 14, 14]} />
            <primitive object={bellyMaterial} attach="material" />
          </mesh>

          {/* Ventral Fin underneath */}
          <mesh position={[0.02, -0.22, 0]} rotation={[0, 0, -0.3]} scale={[0.26, 0.18, 0.015]}>
            <coneGeometry args={[0.5, 1, 14]} />
            <primitive object={finMaterial} attach="material" />
          </mesh>

          {/* ── Tail Peduncle (Spine Segment 3) ── */}
          <group ref={spine3} position={[-0.24, 0, 0]}>
            <mesh scale={[0.34, 0.24, 0.14]}>
              <sphereGeometry args={[0.5, 18, 16]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>

            {/* ── Flowing Caudal Tail Fin Fan ── */}
            <group ref={caudalFin} position={[-0.2, 0, 0]}>
              {/* Upper caudal lobe */}
              <mesh position={[-0.22, 0.12, 0]} rotation={[0, 0, 1.25]} scale={[0.42, 0.22, 0.015]}>
                <coneGeometry args={[0.6, 1.2, 20]} />
                <primitive object={finMaterial} attach="material" />
              </mesh>
              {/* Lower caudal lobe */}
              <mesh position={[-0.22, -0.12, 0]} rotation={[0, 0, 1.85]} scale={[0.42, 0.22, 0.015]}>
                <coneGeometry args={[0.6, 1.2, 20]} />
                <primitive object={finMaterial} attach="material" />
              </mesh>
              {/* Flowing central veil */}
              <mesh position={[-0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.35, 0.35, 0.012]}>
                <coneGeometry args={[0.5, 1.4, 16]} />
                <primitive object={finMaterial} attach="material" />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
