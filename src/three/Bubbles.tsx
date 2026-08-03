import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BubblesProps {
  count?: number;
  spread?: number;
  speed?: number;
  size?: number;
}

interface BubbleData {
  baseX: number;
  baseY: number;
  baseZ: number;
  speed: number;
  size: number;
  wobbleSeed: number;
}

/**
 * Lightweight bubble particle system. Uses a single InstancedMesh for
 * performance so we can render 100+ bubbles at 60fps.
 */
export function Bubbles({ count = 80, spread = 12, speed = 0.4, size = 0.06 }: BubblesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const bubbles = useMemo<BubbleData[]>(() => {
    return Array.from({ length: count }, () => ({
      baseX: (Math.random() - 0.5) * spread,
      baseY: (Math.random() - 0.5) * spread,
      baseZ: (Math.random() - 0.5) * (spread / 2),
      speed: speed + Math.random() * speed * 0.6,
      size: size * (0.6 + Math.random() * 0.9),
      wobbleSeed: Math.random() * Math.PI * 2,
    }));
  }, [count, spread, speed, size]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    bubbles.forEach((b, i) => {
      // Bubbles rise upward, wrapping back to the bottom when they exit.
      const y = ((b.baseY + t * b.speed) % spread) - spread / 2;
      const x = b.baseX + Math.sin(t * 0.8 + b.wobbleSeed) * 0.18;
      const z = b.baseZ + Math.cos(t * 0.6 + b.wobbleSeed) * 0.12;

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(b.size);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#bbf7d0"
        transparent
        opacity={0.35}
        roughness={0.1}
        metalness={0.1}
        emissive="#5eead4"
        emissiveIntensity={0.18}
      />
    </instancedMesh>
  );
}
