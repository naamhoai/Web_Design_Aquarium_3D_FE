import { useMemo } from 'react';
import { Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShaftConfig {
  x: number;
  z: number;
  width: number;
  height: number;
  tilt: number;
  opacity: number;
}

/**
 * Volumetric-looking light shafts (god rays) sinking from the water
 * surface. Each shaft is an additive, camera-facing quad with a soft
 * gaussian falloff — the classic underwater "sunbeam" without the cost
 * of true volumetric rendering.
 */
export function LightShafts({
  color = '#bdfff2',
  count = 4,
  topY = 1.0,
  intensity = 1,
}: {
  color?: string;
  count?: number;
  topY?: number;
  intensity?: number;
}) {
  const shafts = useMemo<ShaftConfig[]>(() => {
    const out: ShaftConfig[] = [];
    let seed = 7;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < count; i++) {
      out.push({
        x: (rand() - 0.5) * 2.4,
        z: (rand() - 0.5) * 1.4,
        width: 0.5 + rand() * 0.7,
        height: 2.4 + rand() * 0.8,
        tilt: (rand() - 0.5) * 0.5,
        opacity: 0.25 + rand() * 0.3,
      });
    }
    return out;
  }, [count]);

  return (
    <group position={[0, topY, 0]}>
      {shafts.map((s, i) => (
        <Shaft key={i} config={s} color={color} intensity={intensity} phase={i} />
      ))}
    </group>
  );
}

function Shaft({
  config,
  color,
  intensity,
  phase,
}: {
  config: ShaftConfig;
  color: string;
  intensity: number;
  phase: number;
}) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: config.opacity * intensity },
          uTime: { value: 0 },
          uPhase: { value: phase * 1.7 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3  uColor;
          uniform float uOpacity;
          uniform float uTime;
          uniform float uPhase;
          varying vec2  vUv;
          void main() {
            // Horizontal gaussian → soft-edged beam.
            float h = exp(-pow((vUv.x - 0.5) * 3.4, 2.0));
            // Bright at the surface, fading as it sinks.
            float v = smoothstep(0.0, 0.25, vUv.y) * pow(vUv.y, 1.3);
            // Gentle breathing shimmer.
            float flick = 0.75 + 0.25 * sin(uTime * 0.9 + uPhase);
            gl_FragColor = vec4(uColor, h * v * uOpacity * flick);
          }
        `,
      }),
    [color, config.opacity, intensity, phase]
  );

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <Billboard position={[config.x, 0, config.z]} rotation={[0, 0, config.tilt]}>
      <mesh>
        <planeGeometry args={[config.width, config.height]} />
        <primitive object={material} attach="material" />
      </mesh>
    </Billboard>
  );
}
