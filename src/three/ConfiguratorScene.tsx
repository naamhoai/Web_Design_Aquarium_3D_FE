import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  ContactShadows,
  Environment,
  SoftShadows,
  Sparkles,
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useControls, folder, Leva } from 'leva';
import * as THREE from 'three';
import { AquariumTank, type TankShape, type StandStyle, type BackgroundTheme } from './tank/AquariumTank';
import { BackgroundDome } from './tank/BackgroundDome';
import { PlantCluster } from './tank/PlantCluster';
import { RockCluster, type RockKind } from './tank/RockCluster';
import { LightingRig, type LightingPreset } from './tank/LightingRig';
import { LightShafts } from './tank/LightShafts';
import { ProceduralFish, type FishSpecies } from './ProceduralFish';
import { Bubbles } from './Bubbles';

export type CameraPreset = 'front' | 'iso' | 'top' | 'closeup';

const CAMERA_POSITIONS: Record<CameraPreset, [number, number, number]> = {
  front: [0, 0.2, 4.6],
  iso: [3.4, 2.2, 3.6],
  top: [0.0, 4.0, 2.2],
  closeup: [1.6, 0.2, 2.6],
};

export interface SceneItem {
  id: string;
  name: string;
  type: 'fish' | 'decor';
  price: number;
  color?: string;
  canvasType: string;
  decorGeometry?: RockKind;
  plantHue?: 'green' | 'emerald' | 'moss';
  species?: FishSpecies;
  swimRadius?: number;
}

export interface ConfiguratorSceneProps {
  shape: TankShape;
  stand: StandStyle;
  backgroundTheme: BackgroundTheme;
  items: SceneItem[];
  lightingPreset: LightingPreset;
  lightingIntensity: number;
  cameraPreset: CameraPreset;
  autoRotate: boolean;
}

const SPECIES_BY_CANVAS: Record<string, FishSpecies> = {
  goldfish: 'goldfish',
  angelfish: 'angelfish',
  tetra: 'neon-tetra',
  clown: 'goldfish', // override color
  discus: 'goldfish',
};

/**
 * The premium 3D aquarium configurator. Combines a parametric refractive
 * glass tank, themed background dome, deterministic decor clusters, animated
 * caustics, suspended particles, god-ray shafts and a school of procedural
 * fish that maps to the user's items — finished with cinematic bloom.
 */
export function ConfiguratorScene(props: ConfiguratorSceneProps) {
  return (
    <div className="configurator-stage">
      <Leva
        collapsed
        oneLineLabels
        titleBar={{ title: 'Dev 3D', drag: true, filter: false }}
      />
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: CAMERA_POSITIONS.iso, fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContents {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function SceneContents({
  shape,
  stand,
  backgroundTheme,
  items,
  lightingPreset,
  lightingIntensity,
  cameraPreset,
  autoRotate,
}: ConfiguratorSceneProps) {
  const { gl } = useThree();

  // leva — dev controls for glass / water / render
  const dev = useControls({
    glass: folder(
      {
        transmission: { value: 1, min: 0, max: 1, step: 0.01 },
        thickness: { value: 0.4, min: 0, max: 2, step: 0.05 },
        ior: { value: 1.34, min: 1, max: 2, step: 0.01 },
      },
      { collapsed: true }
    ),
    render: folder(
      {
        exposure: { value: 1.15, min: 0.4, max: 2, step: 0.05, onChange: (v) => (gl.toneMappingExposure = v) },
        bloom: { value: 0.7, min: 0, max: 2, step: 0.05 },
        autoRotateSpeed: { value: 0.4, min: 0, max: 2, step: 0.05 },
      },
      { collapsed: true }
    ),
  });

  const plants = useMemo(() => items.filter((it) => !!it.plantHue), [items]);
  const stones = useMemo(() => items.filter((it) => it.decorGeometry === 'stone'), [items]);
  const woods = useMemo(() => items.filter((it) => it.decorGeometry === 'driftwood'), [items]);
  const fishes = useMemo(() => items.filter((it) => it.type === 'fish'), [items]);

  const halfH = shape === 'bowl' ? 0.8 : 0.9;
  const groundY = stand === 'none' ? -halfH - 0.02 : -halfH - 1.02;

  return (
    <>
      <SoftShadows size={26} samples={12} focus={0.85} />

      <BackgroundDome theme={backgroundTheme} />
      <LightingRig preset={lightingPreset} intensity={lightingIntensity} />

      {/* Shadow-casting sun through the water surface */}
      <directionalLight
        castShadow
        position={[2.5, 6, 3]}
        intensity={0.9 * lightingIntensity}
        color="#ffffff"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={22}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0004}
      />

      <Environment preset="city" environmentIntensity={0.7} />

      <AquariumTank
        shape={shape}
        stand={stand}
        backgroundTheme={backgroundTheme}
        glassTransmission={dev.transmission}
        glassThickness={dev.thickness}
        glassIor={dev.ior}
      />

      {/* God-ray shafts sinking from the surface */}
      <LightShafts topY={halfH - 0.1} count={4} intensity={0.9 * lightingIntensity} />

      {/* Suspended micro-particles for underwater depth */}
      <Sparkles
        count={45}
        scale={[shape === 'bowl' ? 1.6 : 2.7, 1.5, shape === 'bowl' ? 1.6 : 1.2]}
        position={[0, 0, 0]}
        size={2.2}
        speed={0.25}
        opacity={0.5}
        color="#c7fff3"
      />

      {/* Fish school: deterministic perimeter slots */}
      <FishSchool items={fishes} shape={shape} />

      {/* Decor: clusters, deterministic positions */}
      {plants.length > 0 && (
        <PlantCluster count={Math.min(plants.length * 2, 6)} area={2.2} y={-0.8} seed={plants.length * 7 + 3} />
      )}
      {stones.length > 0 && (
        <RockCluster count={Math.min(stones.length * 3, 6)} area={2.0} y={-0.8} seed={stones.length * 11 + 5} kind="stone" />
      )}
      {woods.length > 0 && (
        <RockCluster count={Math.min(woods.length * 2, 4)} area={2.0} y={-0.8} seed={woods.length * 13 + 7} kind="driftwood" />
      )}

      {/* Ambient bubbles */}
      <Bubbles count={22} spread={2.6} speed={0.32} size={0.04} />

      <ContactShadows
        position={[0, groundY, 0]}
        opacity={0.6}
        scale={7}
        blur={2.8}
        far={4}
        resolution={512}
        color="#000"
      />

      <CameraRig preset={cameraPreset} />
      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={7}
        minPolarAngle={Math.PI * 0.16}
        maxPolarAngle={Math.PI * 0.56}
        autoRotate={autoRotate}
        autoRotateSpeed={dev.autoRotateSpeed}
        enableDamping
        dampingFactor={0.08}
      />

      <EffectComposer enableNormalPass={false}>
        <Bloom
          intensity={dev.bloom}
          luminanceThreshold={0.75}
          luminanceSmoothing={0.28}
          mipmapBlur
          radius={0.68}
        />
        <Vignette offset={0.3} darkness={0.5} eskil={false} />
      </EffectComposer>
    </>
  );
}

function FishSchool({ items, shape }: { items: SceneItem[]; shape: TankShape }) {
  // Clamp total fish for performance
  const slots = useMemo(() => buildSlots(Math.max(items.length, 1), shape), [items.length, shape]);
  if (items.length === 0) return null;
  return (
    <group>
      {items.slice(0, 16).map((it, i) => {
        const slot = slots[i % slots.length];
        const species = it.species ?? SPECIES_BY_CANVAS[it.canvasType] ?? 'goldfish';
        return (
          <ProceduralFish
            key={it.id}
            species={species}
            swimCenter={slot.center}
            swimRadius={slot.radius}
            swimSpeed={0.3 + (i % 4) * 0.05}
            size={species === 'neon-tetra' ? 0.18 : 0.3}
            swimAxis="xz"
            phaseOffset={(i * 1.7) % (Math.PI * 2)}
          />
        );
      })}
    </group>
  );
}

function buildSlots(n: number, shape: TankShape) {
  // Distribute n fish in 4 perimeter bands
  const bandRadius = shape === 'bowl' ? 0.7 : 1.0;
  const slots: { center: [number, number, number]; radius: number }[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / Math.max(n, 1)) * Math.PI * 2;
    const x = Math.cos(angle) * bandRadius;
    const z = Math.sin(angle) * bandRadius;
    slots.push({ center: [x, 0, z], radius: 0.4 + (i % 3) * 0.1 });
  }
  return slots;
}

function CameraRig({ preset }: { preset: CameraPreset }) {
  const { camera } = useThree();
  const targetRef = useRef<THREE.Vector3>(new THREE.Vector3(...CAMERA_POSITIONS[preset]));

  useFrame(() => {
    targetRef.current.set(...CAMERA_POSITIONS[preset]);
    camera.position.lerp(targetRef.current, 0.08);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });

  return null;
}
