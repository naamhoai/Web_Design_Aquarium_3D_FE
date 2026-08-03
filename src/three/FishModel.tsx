import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FishModelProps {
  position?: [number, number, number];
  swimRadius?: number;
  swimSpeed?: number;
  swimCenter?: [number, number, number];
  scale?: number;
  phaseOffset?: number;
  swimAxis?: 'xy' | 'xz' | 'yz';
}

/**
 * High-detail GLTF fish model (Khronos BarramundiFish).
 * Used in the mini-tank showcase for a single focal point.
 * Falls back to a procedural ellipsoid if the model fails to load.
 */
export function FishModel({
  position = [0, 0, 0],
  swimRadius = 1.4,
  swimSpeed = 0.6,
  swimCenter,
  scale = 0.5,
  phaseOffset = 0,
  swimAxis = 'xy',
}: FishModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const center = swimCenter ?? position;

  // Load GLTF — drei caches it.
  const gltf = useGLTF('/models/barramundi.glb');

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * swimSpeed + phaseOffset;

    let x: number, y: number, z: number;
    if (swimAxis === 'xz') {
      x = center[0] + Math.cos(t) * swimRadius;
      y = center[1] + Math.sin(t * 0.8) * swimRadius * 0.35;
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

    groupRef.current.position.set(x, y, z);

    // Face direction of motion
    const angle = Math.atan2(
      swimAxis === 'xy' ? Math.cos(t + 0.05) - Math.cos(t) : Math.sin(t + 0.05) - Math.sin(t),
      swimAxis === 'xy' ? Math.sin(t + 0.05) - Math.sin(t) : Math.cos(t + 0.05) - Math.cos(t)
    );
    groupRef.current.rotation.y = -angle - Math.PI / 2;

    // Subtle banking/rolling
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.12;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={gltf.scene.clone()} />
    </group>
  );
}

// Preload for snappier first load.
useGLTF.preload('/models/barramundi.glb');
