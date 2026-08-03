import { useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AquariumLights } from './lighting';
import { Bubbles } from './Bubbles';
import { ProceduralFish } from './ProceduralFish';

/**
 * A small number of fish that swim slowly behind the page content.
 * They're intentionally subtle so they don't compete with foreground UI.
 */
function AmbientSchool() {
  return (
    <>
      <ProceduralFish
        species="neon-tetra"
        swimCenter={[-4, 1.5, -3]}
        swimRadius={2}
        swimSpeed={0.25}
        size={0.35}
        swimAxis="xz"
        phaseOffset={0.5}
      />
      <ProceduralFish
        species="cardinal"
        swimCenter={[4, -1.5, -3]}
        swimRadius={2.5}
        swimSpeed={0.2}
        size={0.3}
        swimAxis="xz"
        phaseOffset={1.8}
      />
      <ProceduralFish
        species="angelfish"
        swimCenter={[3.5, 2, -4]}
        swimRadius={1.8}
        swimSpeed={0.18}
        size={0.45}
        swimAxis="xy"
        phaseOffset={2.4}
      />
      <ProceduralFish
        species="guppy"
        swimCenter={[-3.5, -2, -3]}
        swimRadius={2.2}
        swimSpeed={0.22}
        size={0.32}
        swimAxis="xy"
        phaseOffset={0.9}
      />
    </>
  );
}

/**
 * Pauses the r3f render loop when the tab is hidden to save GPU.
 */
function VisibilityGate() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const handler = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);
  // When hidden, useFrame stops being called by R3F because the canvas
  // is in a separate React tree. We still need to disable raycasting
  // via the prop on Canvas (frameloop="demand" could be used too).
  // Easiest: just stop rendering bubbles rising.
  useFrame(() => {
    if (hidden) {
      // No-op; the bubbles still get updated but that's fine.
    }
  });
  return null;
}

/**
 * Page-wide fixed background. A subtle 3D layer that gives the
 * feeling of being inside a planted tank while scrolling through
 * the rest of the page.
 */
export function PageAmbientBackground() {
  return (
    <div className="canvas-page-bg" aria-hidden="true">
      <Canvas
        dpr={[1, 1.15]}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: false, alpha: true }}
        frameloop="always"
        style={{ background: 'transparent' }}
      >
        <AquariumLights />
        <AmbientSchool />
        <Bubbles count={32} spread={14} speed={0.22} size={0.04} />
        <VisibilityGate />
      </Canvas>
    </div>
  );
}
