import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, RoundedBox, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { Substrate } from './Substrate';
import { CausticsFloor } from './CausticsFloor';

export type TankShape = 'rectangle' | 'hexagon' | 'bowl';
export type StandStyle = 'wood' | 'metal' | 'none';
export type BackgroundTheme = 'deep-blue' | 'amazon-forest' | 'ancient-ruins';

export interface AquariumTankProps {
  shape: TankShape;
  stand: StandStyle;
  backgroundTheme: BackgroundTheme;
  glassTransmission?: number;
  glassThickness?: number;
  glassIor?: number;
}

const WATER_TINT: Record<BackgroundTheme, string> = {
  'deep-blue': '#1c4f6b',
  'amazon-forest': '#1d5a48',
  'ancient-ruins': '#2f4a4a',
};
const CAUSTIC_COLOR: Record<BackgroundTheme, string> = {
  'deep-blue': '#93e9ff',
  'amazon-forest': '#8ffce0',
  'ancient-ruins': '#c8e6c9',
};
const BACKWALL_TINT: Record<BackgroundTheme, string> = {
  'deep-blue': '#0a2b3d',
  'amazon-forest': '#0a2b22',
  'ancient-ruins': '#1c140d',
};

const STAND_WOOD_COLOR = '#7c4a1f';
const STAND_METAL_COLOR = '#475569';

/**
 * A realistic glass aquarium. The shell is a single refractive volume
 * rendered with MeshTransmissionMaterial (true refraction + chromatic
 * aberration), filled with tinted water, a gravel bed with scattered
 * pebbles and animated caustics on the floor.
 */
export function AquariumTank({
  shape,
  stand,
  backgroundTheme,
  glassTransmission = 1,
  glassThickness = 0.4,
  glassIor = 1.34,
}: AquariumTankProps) {
  const dims = shapeDims(shape);
  const { w, h, d, halfH, halfD } = dims;
  const floorY = -halfH + 0.02;
  const waterY = halfH - 0.06;
  const waterTint = WATER_TINT[backgroundTheme];

  const glass = {
    transmission: glassTransmission,
    thickness: glassThickness,
    ior: glassIor,
  };

  return (
    <group>
      {/* Colored back pane so fish read against the background (planted tanks) */}
      {shape !== 'bowl' && (
        <mesh position={[0, 0, -halfD - 0.01]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial
            color={BACKWALL_TINT[backgroundTheme]}
            roughness={0.5}
            metalness={0.05}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {/* Substrate: gravel bed + scattered pebbles */}
      <Substrate w={w * 0.94} d={d * 0.94} y={floorY} theme={backgroundTheme} />

      {/* Caustics: shimmering light web just above the bed */}
      <CausticsFloor
        w={w * 0.92}
        d={d * 0.9}
        y={floorY + 0.03}
        color={CAUSTIC_COLOR[backgroundTheme]}
        intensity={1.15}
      />

      {/* Water body — tinted, faintly rippling surface with a bright meniscus */}
      <WaterVolume
        w={shape === 'bowl' ? w * 0.66 : w * 0.965}
        d={shape === 'bowl' ? d * 0.66 : d * 0.965}
        top={waterY}
        bottom={floorY}
        color={waterTint}
      />

      {/* Glass shell */}
      {shape === 'rectangle' && <RectangleGlass w={w} h={h} d={d} {...glass} />}
      {shape === 'hexagon' && <HexagonGlass w={w} h={h} d={d} {...glass} />}
      {shape === 'bowl' && <BowlGlass radius={Math.max(w, d) * 0.42} {...glass} />}

      {/* Stand */}
      {stand === 'wood' && <WoodStand w={w} d={d} y={-halfH - 0.5} h={1} />}
      {stand === 'metal' && <MetalStand w={w} d={d} y={-halfH - 0.6} h={1.2} />}
    </group>
  );
}

function shapeDims(shape: TankShape) {
  if (shape === 'rectangle') return { w: 3.0, h: 1.8, d: 1.4, halfW: 1.5, halfH: 0.9, halfD: 0.7 };
  if (shape === 'hexagon') return { w: 2.6, h: 1.8, d: 1.6, halfW: 1.3, halfH: 0.9, halfD: 0.8 };
  return { w: 2.0, h: 1.6, d: 2.0, halfW: 1.0, halfH: 0.8, halfD: 1.0 }; // bowl
}

interface GlassProps {
  transmission: number;
  thickness: number;
  ior: number;
}

/** Shared transmission-material config for every glass shell. */
function glassMaterial(w: number, h: number, d: number, p: GlassProps) {
  return (
    <MeshTransmissionMaterial
      samples={4}
      resolution={256}
      thickness={p.thickness}
      transmission={p.transmission}
      roughness={0.05}
      ior={p.ior}
      chromaticAberration={0.04}
      anisotropy={0.12}
      distortion={0.1}
      distortionScale={0.25}
      temporalDistortion={0.06}
      clearcoat={1}
      clearcoatRoughness={0.05}
      attenuationColor="#cfeee8"
      attenuationDistance={Math.max(w, h, d) * 1.4}
      color="#eafffb"
      background={new THREE.Color('#06201a')}
    />
  );
}

function RectangleGlass({ w, h, d, ...p }: { w: number; h: number; d: number } & GlassProps) {
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.05} smoothness={4}>
        {glassMaterial(w, h, d, p)}
      </RoundedBox>
      {/* Aqua rim highlight along the edges */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshBasicMaterial visible={false} />
        <Edges threshold={15} scale={1.001} color="#5eead4" />
      </mesh>
    </group>
  );
}

function HexagonGlass({ w, h, d, ...p }: { w: number; h: number; d: number } & GlassProps) {
  const r = Math.max(w, d) / 2;
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[r, r, h, 6, 1]} />
        {glassMaterial(w, h, d, p)}
      </mesh>
      <mesh>
        <cylinderGeometry args={[r, r, h, 6, 1]} />
        <meshBasicMaterial visible={false} />
        <Edges threshold={15} scale={1.001} color="#5eead4" />
      </mesh>
    </group>
  );
}

function BowlGlass({ radius, ...p }: { radius: number } & GlassProps) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
      {glassMaterial(radius, radius, radius, p)}
    </mesh>
  );
}

/**
 * The water — a tinted, gently rippling top surface with a bright meniscus
 * ring plus a faint volumetric tint fading toward the floor.
 */
function WaterVolume({
  w,
  d,
  top,
  bottom,
  color,
}: {
  w: number;
  d: number;
  top: number;
  bottom: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(w, d, 28, 20), [w, d]);
  const base = useMemo(
    () => new Float32Array(geometry.attributes.position.array),
    [geometry]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const wave =
        Math.sin(x * 3.4 + t * 1.1) * 0.02 + Math.cos(y * 2.6 + t * 0.85) * 0.02;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
  });

  return (
    <group>
      {/* Volumetric tint fading down (adds depth to the water column) */}
      <mesh position={[0, (top + bottom) / 2, 0]}>
        <boxGeometry args={[w, top - bottom, d]} />
        <meshBasicMaterial color={color} transparent opacity={0.16} depthWrite={false} />
      </mesh>

      {/* Rippling surface */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, top, 0]} geometry={geometry}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.55}
          roughness={0.08}
          metalness={0.35}
          side={THREE.DoubleSide}
          envMapIntensity={1.4}
        />
      </mesh>
    </group>
  );
}

function WoodStand({ w, d, y, h }: { w: number; d: number; y: number; h: number }) {
  return (
    <group position={[0, y - h / 2, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w * 0.95, h, d * 0.95]} />
        <meshStandardMaterial color={STAND_WOOD_COLOR} roughness={0.8} metalness={0.05} />
      </mesh>
      <mesh position={[w * 0.4, -h * 0.7, 0]} castShadow>
        <boxGeometry args={[0.15, h * 0.6, d * 0.85]} />
        <meshStandardMaterial color={STAND_WOOD_COLOR} roughness={0.9} />
      </mesh>
      <mesh position={[-w * 0.4, -h * 0.7, 0]} castShadow>
        <boxGeometry args={[0.15, h * 0.6, d * 0.85]} />
        <meshStandardMaterial color={STAND_WOOD_COLOR} roughness={0.9} />
      </mesh>
    </group>
  );
}

function MetalStand({ w, d, y, h }: { w: number; d: number; y: number; h: number }) {
  return (
    <group position={[0, y - h / 2, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w * 0.95, 0.06, d * 0.95]} />
        <meshStandardMaterial color={STAND_METAL_COLOR} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[w * 0.42, -h * 0.4, 0]} castShadow>
        <boxGeometry args={[0.08, h * 0.8, d * 0.9]} />
        <meshStandardMaterial color={STAND_METAL_COLOR} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-w * 0.42, -h * 0.4, 0]} castShadow>
        <boxGeometry args={[0.08, h * 0.8, d * 0.9]} />
        <meshStandardMaterial color={STAND_METAL_COLOR} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -h * 0.4, d * 0.42]} castShadow>
        <boxGeometry args={[w * 0.85, h * 0.8, 0.08]} />
        <meshStandardMaterial color={STAND_METAL_COLOR} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -h * 0.4, -d * 0.42]} castShadow>
        <boxGeometry args={[w * 0.85, h * 0.8, 0.08]} />
        <meshStandardMaterial color={STAND_METAL_COLOR} metalness={0.8} roughness={0.3} />
      </mesh>
      {[
        [w * 0.42, -h * 0.85, d * 0.42],
        [-w * 0.42, -h * 0.85, d * 0.42],
        [w * 0.42, -h * 0.85, -d * 0.42],
        [-w * 0.42, -h * 0.85, -d * 0.42],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.05, 0.07, 0.08, 8]} />
          <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}
