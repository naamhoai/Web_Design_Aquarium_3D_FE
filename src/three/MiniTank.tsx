import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { MiniTankLights } from './lighting';
import { Bubbles } from './Bubbles';
import { Plant } from './Plants';
import { FishModel } from './FishModel';

/**
 * A glass tank box — six transparent planes forming a cube.
 * Slightly reflective via emissive intensity trick.
 */
function GlassTank() {
  const size = 4;
  return (
    <group>
      {/* Back wall (slightly opaque so fish don't disappear) */}
      <mesh position={[0, 0, -size / 2]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          color="#143d31"
          transparent
          opacity={0.85}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      {/* Floor with gravel */}
      <mesh position={[0, -size / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#3f3f46" roughness={1} />
      </mesh>
      {/* Gravel pebbles */}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = (Math.random() - 0.5) * (size - 0.4);
        const z = (Math.random() - 0.5) * (size - 0.4);
        return (
          <mesh key={i} position={[x, -size / 2 + 0.04 + Math.random() * 0.04, z]}>
            <sphereGeometry args={[0.08 + Math.random() * 0.06, 8, 6]} />
            <meshStandardMaterial
              color={['#57534e', '#78716c', '#44403c', '#a8a29e'][i % 4]}
              roughness={1}
            />
          </mesh>
        );
      })}
      {/* Side walls — transparent glass */}
      <mesh position={[-size / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[size, size]} />
        <meshPhysicalMaterial
          color="#5eead4"
          transparent
          opacity={0.06}
          roughness={0.05}
          metalness={0.1}
          transmission={0.92}
        />
      </mesh>
      <mesh position={[size / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[size, size]} />
        <meshPhysicalMaterial
          color="#5eead4"
          transparent
          opacity={0.06}
          roughness={0.05}
          metalness={0.1}
          transmission={0.92}
        />
      </mesh>
      {/* Top — water surface */}
      <mesh position={[0, size / 2 - 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          color="#5eead4"
          transparent
          opacity={0.18}
          roughness={0.1}
          metalness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/**
 * A subtle auto-rotation for the GLTF fish inside the tank
 * — gives the showcase more life even without user interaction.
 */
function AutoRotateFish() {
  // No-op wrapper — FishModel already does its own swim loop.
  return null;
}

/**
 * The mini tank scene composition. Used inside FishShowcase.
 */
export function MiniTank() {
  return (
    <div className="mini-tank-frame">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.5, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <MiniTankLights />
          <GlassTank />

          {/* GLTF fish swimming inside */}
          <FishModel
            swimCenter={[0, 0, 0]}
            swimRadius={1.3}
            swimSpeed={0.5}
            scale={0.55}
            swimAxis="xy"
          />

          {/* Plants inside the tank */}
          <Plant position={[-1.4, -1.7, 0]} scale={0.7} hue="green" swayPhase={0.3} />
          <Plant position={[1.3, -1.7, -0.5]} scale={0.6} hue="emerald" swayPhase={1.1} />
          <Plant position={[0.8, -1.7, 1]} scale={0.5} hue="moss" swayPhase={2.1} />

          {/* Bubbles */}
          <Bubbles count={25} spread={3.5} speed={0.4} size={0.04} />

          <AutoRotateFish />

          {/* User controls — limited to subtle orbit only */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={4}
            maxDistance={8}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.7}
            autoRotate={false}
            enableDamping
            dampingFactor={0.08}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
