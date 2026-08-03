import type { ReactNode } from 'react';

/**
 * Shared lighting setup that mimics a planted tropical aquarium:
 * - Soft ambient base (warm-cream tinted)
 * - Top-down directional light (sunlight passing through water)
 * - Side fill point lights (cyan + emerald) for tank rim glow
 */
export function AquariumLights(): ReactNode {
  return (
    <>
      <ambientLight intensity={0.55} color="#f0fdf4" />
      <directionalLight
        position={[0, 8, 4]}
        intensity={0.9}
        color="#ffffff"
        castShadow={false}
      />
      <pointLight position={[-5, 3, 4]} intensity={0.6} color="#5eead4" distance={14} />
      <pointLight position={[5, -2, 4]} intensity={0.45} color="#34d399" distance={12} />
      <hemisphereLight args={['#bef264', '#143d31', 0.35]} />
    </>
  );
}

/**
 * Brighter, slightly different lighting for the mini tank showcase —
 * emphasizes the GLTF fish with a key light + rim light.
 */
export function MiniTankLights(): ReactNode {
  return (
    <>
      <ambientLight intensity={0.5} color="#ecfeff" />
      <directionalLight position={[3, 5, 4]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-3, 1, 3]} intensity={0.7} color="#5eead4" distance={10} />
      <pointLight position={[3, -1, 2]} intensity={0.5} color="#fbbf24" distance={8} />
      <spotLight
        position={[0, 6, 3]}
        angle={0.6}
        penumbra={0.5}
        intensity={0.6}
        color="#ffffff"
      />
    </>
  );
}
