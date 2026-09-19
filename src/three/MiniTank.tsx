import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Organic3DFish } from './Organic3DFish';
import { AquaticFlora, RiverRocks } from './AquaticFlora';
import { Bubbles } from './Bubbles';
import { CausticsFloor } from './tank/CausticsFloor';
import { LightShafts } from './tank/LightShafts';

/**
 * Crystal-clear aquarium glass tank with illuminated backdrop,
 * golden sand bed, and polished glass edges.
 */
function LuxuryGlassTank() {
  const w = 4.2;
  const h = 3.6;
  const d = 3.2;

  // Backdrop gradient plane (Azure sunlight fading to sapphire depths)
  const backdropMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      side: THREE.FrontSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color('#38bdf8') },     // Bright azure surface
        midColor: { value: new THREE.Color('#0284c7') },     // Cyan ocean
        bottomColor: { value: new THREE.Color('#082f49') },  // Deep aquatic marine
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        void main() {
          vec3 col = mix(bottomColor, midColor, smoothstep(0.0, 0.55, vUv.y));
          col = mix(col, topColor, smoothstep(0.55, 1.0, vUv.y));
          gl_FragColor = vec4(col, 0.95);
        }
      `,
      transparent: true,
    });
  }, []);

  // Glass Material with high transmission and pristine crystal specular
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#e0f2fe',
      transparent: true,
      opacity: 0.15,
      roughness: 0.04,
      metalness: 0.05,
      transmission: 0.92,
      thickness: 0.4,
      ior: 1.45,
      reflectivity: 0.8,
    });
  }, []);

  return (
    <group>
      {/* ── Illuminated Backdrop Pane ── */}
      <mesh position={[0, 0, -d / 2 - 0.02]} material={backdropMaterial}>
        <planeGeometry args={[w * 1.05, h * 1.05]} />
      </mesh>

      {/* ── Golden Sand Substrate Bed ── */}
      <mesh position={[0, -h / 2 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w - 0.1, d - 0.1]} />
        <meshStandardMaterial
          color="#d4b996"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* Substrate Sand Depth Rim */}
      <mesh position={[0, -h / 2 + 0.05, 0]}>
        <boxGeometry args={[w - 0.08, 0.1, d - 0.08]} />
        <meshStandardMaterial color="#c2a37c" roughness={0.95} />
      </mesh>

      {/* ── Animated Water Surface Caustics dancing on the sand ── */}
      <CausticsFloor
        w={w - 0.2}
        d={d - 0.2}
        y={-h / 2 + 0.12}
        color="#a5f3fc"
        intensity={1.4}
      />

      {/* ── Volumetric Sunbeams / Light Shafts streaming down ── */}
      <LightShafts
        count={5}
        color="#cffafe"
        intensity={0.85}
        topY={h / 2 - 0.1}
      />

      {/* ── Top Water Surface (Rippling Meniscus) ── */}
      <mesh position={[0, h / 2 - 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w - 0.1, d - 0.1]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Crystal Glass Tank Walls ── */}
      {/* Front Wall */}
      <mesh position={[0, 0, d / 2]} material={glassMaterial}>
        <planeGeometry args={[w, h]} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-w / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={glassMaterial}>
        <planeGeometry args={[d, h]} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[w / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={glassMaterial}>
        <planeGeometry args={[d, h]} />
      </mesh>

      {/* Polished Glass Rims / Frame Lines */}
      {[-1, 1].map((x) => (
        <mesh key={`v-${x}`} position={[x * (w / 2), 0, d / 2]}>
          <boxGeometry args={[0.03, h, 0.03]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Realistic Aquascaping Elements (Lush Plants + Driftwood + Mossy Boulders)
 */
function TankScenery() {
  return (
    <group position={[0, -1.8 + 0.12, 0]}>
      {/* Left Back: Tall Emerald Aquatic Ribbon Plant */}
      <AquaticFlora position={[-1.2, 0, -0.7]} scale={1.1} hue="emerald" stemCount={9} />

      {/* Center Back: Mossy River Boulder & Ancient Stones */}
      <RiverRocks position={[0.4, 0, -0.6]} />

      {/* Right Back: Lush Lime Green Plant */}
      <AquaticFlora position={[1.3, 0, -0.5]} scale={0.95} hue="lime" stemCount={8} />

      {/* Left Mid: Small Plant Accent */}
      <AquaticFlora position={[-0.7, 0, 0.3]} scale={0.65} hue="deep-green" stemCount={6} />

      {/* Scattered Smooth Sand River Pebbles */}
      {[
        { p: [-0.4, 0.05, 0.6], s: 0.12, c: '#78716c' },
        { p: [-0.1, 0.04, 0.8], s: 0.09, c: '#a8a29e' },
        { p: [0.8, 0.06, 0.4], s: 0.14, c: '#57534e' },
        { p: [1.1, 0.04, 0.7], s: 0.08, c: '#d6d3d1' },
      ].map((peb, i) => (
        <mesh key={i} position={peb.p as [number, number, number]} scale={peb.s}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={peb.c} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Studio Lighting Setup for maximum clarity, vivid colors, and refractive caustics
 */
function StudioAquariumLights() {
  return (
    <>
      {/* Soft Ambient Aqua Fill */}
      <ambientLight intensity={0.85} color="#e0f2fe" />

      {/* Main Overhead LED Full-Spectrum Bar */}
      <directionalLight
        position={[0, 6, 2]}
        intensity={2.2}
        color="#ffffff"
        castShadow={false}
      />

      {/* Golden Warm Key Light (bringing out fish scales) */}
      <pointLight position={[3, 4, 3]} intensity={3.5} color="#fed7aa" distance={12} />

      {/* Cyan Ocean Rim Light (creating edge silhouettes) */}
      <pointLight position={[-3, 2, 2]} intensity={2.8} color="#38bdf8" distance={10} />

      {/* Bottom Substrate Bounce */}
      <pointLight position={[0, -2, 1]} intensity={0.9} color="#7dd3fc" distance={6} />
    </>
  );
}

/**
 * The Upgraded Luxury Mini Tank Component
 */
export function MiniTank({ height = '460px' }: { height?: string }) {
  return (
    <div className="mini-tank-frame" style={{ width: '100%', height, position: 'relative' }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.4, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <StudioAquariumLights />

          {/* Luxury Tank Structure with Illuminated Backdrop & Caustics */}
          <LuxuryGlassTank />

          {/* Lush Aquascape & Mossy Rocks */}
          <TankScenery />

          {/* ── Main 3D Fish: Imperial Kohaku Koi (Balanced Scale & Central Cruise) ── */}
          <Organic3DFish
            type="koi"
            swimCenter={[0, 0.05, 0]}
            scale={0.58}
            swimRadius={1.15}
            swimSpeed={0.75}
            swimHeight={0.25}
            phaseOffset={0}
          />

          {/* ── Companion Fish: Royal Blue Betta (Lower Zone near Aquascape) ── */}
          <Organic3DFish
            type="betta"
            swimCenter={[0.7, -0.45, 0.15]}
            scale={0.38}
            swimRadius={0.5}
            swimSpeed={0.9}
            swimHeight={0.16}
            phaseOffset={Math.PI * 0.8}
          />

          {/* ── Schooling Fish: Radiant Neon Tetra (Upper Open Water Zone) ── */}
          <Organic3DFish
            type="neon"
            swimCenter={[-0.75, 0.5, -0.1]}
            scale={0.24}
            swimRadius={0.45}
            swimSpeed={1.2}
            swimHeight={0.15}
            phaseOffset={2.8}
          />

          {/* ── Luminous Shimmering Rising Bubbles ── */}
          <Bubbles count={40} spread={3.0} speed={0.45} size={0.035} />

          {/* ── Smooth Camera Orbit Controls ── */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3.2}
            maxDistance={7.5}
            minPolarAngle={Math.PI / 3.5}
            maxPolarAngle={Math.PI / 1.75}
            autoRotate={false}
            enableDamping
            dampingFactor={0.08}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
