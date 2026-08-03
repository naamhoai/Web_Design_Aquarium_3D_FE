import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Animated caustics — the shimmering web of light that dappled sunlight
 * casts on the bottom of a real aquarium. Rendered as an additive shader
 * plane that sits just above the substrate. Cheap (no extra render pass)
 * yet reads as genuine refracted light.
 */
export function CausticsFloor({
  w,
  d,
  y,
  color = '#8ffcea',
  intensity = 1,
}: {
  w: number;
  d: number;
  y: number;
  color?: string;
  intensity?: number;
}) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
          uIntensity: { value: intensity },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform vec3  uColor;
          uniform float uIntensity;
          varying vec2  vUv;

          // Layered sine distortion approximating refractive caustics.
          float caustic(vec2 uv, float t) {
            vec2 p = uv * 9.0;
            float acc = 0.0;
            for (int i = 0; i < 4; i++) {
              float fi = float(i);
              p += 0.32 * vec2(
                sin(t * 0.7 + fi * 1.3 + p.y),
                cos(t * 0.6 + fi * 1.7 + p.x)
              );
              acc += sin(p.x + t) * cos(p.y - t * 0.8);
            }
            return acc * 0.25;
          }

          void main() {
            float c = caustic(vUv, uTime);
            // Thin glowing lines at the zero-crossings of the field.
            float lines = pow(1.0 - clamp(abs(c), 0.0, 1.0), 4.0);
            float sparkle = pow(lines, 2.2);
            // Soft radial vignette so the pool of light fades to the edges.
            float dist = distance(vUv, vec2(0.5));
            float mask = smoothstep(0.62, 0.12, dist);
            vec3 col = uColor * (lines * 0.7 + sparkle * 1.6);
            gl_FragColor = vec4(col * uIntensity * mask, mask * (lines * 0.5 + sparkle));
          }
        `,
      }),
    [color, intensity]
  );

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <planeGeometry args={[w, d, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
