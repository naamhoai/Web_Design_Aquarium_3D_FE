import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BackgroundTheme } from './AquariumTank';

const PALETTE: Record<BackgroundTheme, { top: string; bottom: string; fog: string }> = {
  'deep-blue': { top: '#0b3a52', bottom: '#020a1a', fog: '#03101e' },
  'amazon-forest': { top: '#1d5444', bottom: '#021410', fog: '#04120c' },
  'ancient-ruins': { top: '#3a2615', bottom: '#0e0805', fog: '#1a0e07' },
};

/**
 * Inverted sphere that wraps the scene with a soft gradient and fog
 * tinted by the active background theme.
 */
export function BackgroundDome({ theme }: { theme: BackgroundTheme }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => {
    const p = PALETTE[theme];
    return new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        topColor: { value: new THREE.Color(p.top) },
        bottomColor: { value: new THREE.Color(p.bottom) },
        offset: { value: 33 },
        exponent: { value: 0.6 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
    });
  }, [theme]);

  useFrame(({ scene }) => {
    scene.fog = new THREE.FogExp2(PALETTE[theme].fog, 0.08);
  });

  return (
    <>
      <mesh ref={meshRef} material={mat}>
        <sphereGeometry args={[40, 32, 16]} />
      </mesh>
      <ambientLight intensity={0.25} color={PALETTE[theme].top} />
    </>
  );
}
