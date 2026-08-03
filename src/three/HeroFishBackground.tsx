import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AquariumLights } from './lighting';
import { Bubbles } from './Bubbles';
import { PlantCluster } from './Plants';
import { FishSchool, ProceduralFish } from './ProceduralFish';

/**
 * Subtle camera parallax: follows mouse position smoothly.
 * Mouse coords are normalized to [-1, 1].
 */
function CameraRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    const targetX = mouse.x * 0.6;
    const targetY = mouse.y * 0.4;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

interface HeroSceneProps {
  variant?: 'home' | 'showcase';
}

/**
 * The actual 3D scene composition for the hero.
 * Two schools of fish swim in opposite directions, plants in foreground,
 * bubbles rising, soft tank lighting.
 */
function HeroScene({ variant = 'home' }: HeroSceneProps) {
  return (
    <>
      <AquariumLights />
      <CameraRig />

      {/* Foreground plants on the sides */}
      <PlantCluster count={5} area={10} z={-1.5} />
      <PlantCluster count={3} area={8} z={1.5} />

      {/* Center focal fish — a single big procedural guppy */}
      <ProceduralFish
        species="guppy"
        swimCenter={[0, 0.2, 0.3]}
        swimRadius={1.2}
        swimSpeed={0.5}
        size={0.55}
        swimAxis="xy"
        phaseOffset={0.3}
      />

      {/* Background school */}
      <FishSchool count={4} species="neon-tetra" area={4} z={-2} />
      {/* Foreground school */}
      <FishSchool count={3} species="cardinal" area={3} z={1} />

      {/* Bubbles */}
      <Bubbles count={50} spread={10} speed={0.5} size={0.05} />

      {/* Subtle tank walls (very faint) */}
      {variant === 'showcase' && (
        <>
          <mesh position={[0, 0, -3]}>
            <planeGeometry args={[14, 8]} />
            <meshBasicMaterial color="#0c2b22" transparent opacity={0.3} />
          </mesh>
        </>
      )}
    </>
  );
}

interface HeroFishBackgroundProps {
  height?: string;
  variant?: 'home' | 'showcase';
}

/**
 * Wrapper Canvas for the hero fish background. R3F Canvas with
 * sensible defaults for a backdrop.
 */
export function HeroFishBackground({ height = '100%', variant = 'home' }: HeroFishBackgroundProps) {
  return (
    <div
      className="canvas-hero-bg"
      style={{
        width: '100%',
        height,
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(94, 234, 212, 0.18) 0%, rgba(20, 61, 49, 0.35) 50%, rgba(6, 26, 20, 0.85) 100%)',
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <HeroScene variant={variant} />
      </Canvas>
    </div>
  );
}
