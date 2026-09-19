import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type OrganicFishType = 'koi' | 'goldfish' | 'clown' | 'betta' | 'neon';

interface Organic3DFishProps {
  type?: OrganicFishType;
  position?: [number, number, number];
  scale?: number;
  swimRadius?: number;
  swimSpeed?: number;
  swimCenter?: [number, number, number];
  swimHeight?: number;
  phaseOffset?: number;
}

/**
 * Creates a high-resolution canvas texture with realistic fish scales,
 * skin patterns, gill contours, and pearlescent gradients.
 */
function generateFishTexture(type: OrganicFishType): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  if (type === 'koi') {
    // Japanese Kohaku Koi: Pearl ivory base with vivid vermilion / orange flame markings
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Subtle ivory-gold pearlescent sheen on flanks
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.2, '#ffffff');
    grad.addColorStop(0.8, '#ffffff');
    grad.addColorStop(1, '#fef08a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Vermilion flame patches (classic Kohaku pattern)
    ctx.fillStyle = '#ea580c';
    // Head hi (patch)
    ctx.beginPath();
    ctx.ellipse(90, 128, 60, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body patches
    ctx.beginPath();
    ctx.ellipse(220, 100, 75, 55, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(330, 140, 60, 42, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Deep crimson inner accents
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.ellipse(90, 128, 40, 30, 0, 0, Math.PI * 2);
    ctx.ellipse(220, 100, 50, 36, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Delicate fish scales mesh across the torso
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.22)';
    ctx.lineWidth = 1.2;
    for (let x = 120; x < 400; x += 14) {
      for (let y = 50; y < 210; y += 10) {
        ctx.beginPath();
        ctx.arc(x + (y % 20 === 0 ? 7 : 0), y, 6, 0, Math.PI);
        ctx.stroke();
      }
    }

    // Gill arch line
    ctx.strokeStyle = 'rgba(154, 52, 18, 0.5)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(125, 75, 28, 0.4, 2.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(125, 180, 28, -2.4, -0.4);
    ctx.stroke();

  } else if (type === 'clown') {
    // Clownfish (Nemo): Fiery orange body with bold white bars outlined in jet black
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 0, width, height);

    // Deep orange gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#f97316');
    grad.addColorStop(0.5, '#ea580c');
    grad.addColorStop(1, '#c2410c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 3 Distinct White Vertical Bands with crisp black borders
    const bands = [110, 240, 380];
    bands.forEach((bx, idx) => {
      const bw = idx === 0 ? 32 : idx === 1 ? 38 : 24;
      // Black border
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(bx - 3, 0, bw + 6, height);
      // White bar
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bx, 0, bw, height);
    });

  } else if (type === 'betta') {
    // Royal Sapphire Blue Betta with iridescent cyan highlights
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0369a1');
    grad.addColorStop(0.5, '#0284c7');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Iridescent cyan scales
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.4;
    for (let x = 80; x < 440; x += 12) {
      for (let y = 30; y < 225; y += 8) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI);
        ctx.stroke();
      }
    }

  } else if (type === 'neon') {
    // Neon Tetra: Glowing electric cyan horizontal stripe on top, vivid scarlet red lower half
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Glowing cyan lateral stripe
    const cyanGrad = ctx.createLinearGradient(0, 80, 0, 120);
    cyanGrad.addColorStop(0, 'rgba(0, 242, 254, 0)');
    cyanGrad.addColorStop(0.5, '#00f2fe');
    cyanGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
    ctx.fillStyle = cyanGrad;
    ctx.fillRect(60, 80, 380, 40);

    // Neon red posterior / belly
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(180, 120, 260, 90);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(60, 120, 120, 80);

  } else {
    // Goldfish: Golden amber to brilliant fiery red
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(0.4, '#ea580c');
    grad.addColorStop(1, '#dc2626');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Scales
    ctx.strokeStyle = 'rgba(254, 243, 199, 0.3)';
    ctx.lineWidth = 1.2;
    for (let x = 80; x < 420; x += 12) {
      for (let y = 40; y < 220; y += 9) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Builds an aerodynamically contoured, smooth single-piece fish mesh.
 * Returns the BufferGeometry and the original vertex arrays for wave deformation.
 */
function buildSeamlessFishGeometry(uSegments = 36, vSegments = 24) {
  const geom = new THREE.BufferGeometry();
  const restPositions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const uList: number[] = [];

  // Fish length along X: Nose at x = +1.1, Tail peduncle at x = -1.5
  const totalLength = 2.6;
  const noseX = 1.1;

  for (let i = 0; i <= uSegments; i++) {
    const u = i / uSegments;
    const x = noseX - totalLength * u;

    // Radius profiles along the spine
    let ry = 0;
    if (u < 0.18) {
      // Head / snout cone
      ry = Math.sin((u / 0.18) * (Math.PI / 2)) * 0.42;
    } else if (u < 0.48) {
      // Forehead to deep mid-body
      const t = (u - 0.18) / 0.30;
      ry = 0.42 + 0.16 * Math.sin(t * Math.PI * 0.5);
    } else if (u < 0.85) {
      // Torso tapering to caudal peduncle
      const t = (u - 0.48) / 0.37;
      ry = 0.58 - 0.43 * Math.sin(t * Math.PI * 0.5);
    } else {
      // Slender caudal peduncle
      const t = (u - 0.85) / 0.15;
      ry = 0.15 - 0.08 * t;
    }

    // Lateral compression (fish is narrower than it is tall)
    const rz = ry * 0.54;

    // Arched dorsal spine & flat belly
    const yCenter = Math.sin(u * Math.PI) * 0.08 - (u > 0.45 ? (u - 0.45) * 0.12 : 0);

    for (let j = 0; j <= vSegments; j++) {
      const v = j / vSegments;
      const theta = v * Math.PI * 2;
      const y = yCenter + Math.sin(theta) * ry;
      const z = Math.cos(theta) * rz;

      restPositions.push(x, y, z);
      uList.push(u);
      uvs.push(u, v);
    }
  }

  for (let i = 0; i < uSegments; i++) {
    for (let j = 0; j < vSegments; j++) {
      const a = i * (vSegments + 1) + j;
      const b = (i + 1) * (vSegments + 1) + j;
      const c = (i + 1) * (vSegments + 1) + (j + 1);
      const d = i * (vSegments + 1) + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(restPositions, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  return { geom, restPositions, uList };
}

/**
 * Builds a gorgeous multi-segmented, rippling silk caudal tail fin
 */
function buildCaudalFinGeometry(radials = 16, length = 1.1) {
  const geom = new THREE.BufferGeometry();
  const restPositions: number[] = [];
  const indices: number[] = [];
  const uvs: number[] = [];

  // Fan shape originating at root (0, 0, 0)
  for (let r = 0; r <= radials; r++) {
    const fraction = r / radials; // -0.5 to 0.5
    const angle = (fraction - 0.5) * (Math.PI * 0.65);

    // Inner root point
    restPositions.push(0, (fraction - 0.5) * 0.14, 0);
    uvs.push(0, fraction);

    // Mid ray point
    const midL = length * 0.55;
    restPositions.push(-Math.cos(angle) * midL, Math.sin(angle) * midL * 1.1, 0);
    uvs.push(0.5, fraction);

    // Outer edge tip (forked tail shape with lobes)
    const isLobe = Math.abs(fraction - 0.5) > 0.25;
    const outerL = length * (isLobe ? 1.05 : 0.85);
    restPositions.push(-Math.cos(angle) * outerL, Math.sin(angle) * outerL * 1.25, 0);
    uvs.push(1.0, fraction);
  }

  for (let r = 0; r < radials; r++) {
    const i0 = r * 3;
    const i1 = (r + 1) * 3;

    // Quad 1: root to mid
    indices.push(i0, i1, i1 + 1);
    indices.push(i0, i1 + 1, i0 + 1);

    // Quad 2: mid to tip
    indices.push(i0 + 1, i1 + 1, i1 + 2);
    indices.push(i0 + 1, i1 + 2, i0 + 2);
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(restPositions, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  return { geom, restPositions };
}

/**
 * Realistic Three.js 3D Organic Fish
 */
export function Organic3DFish({
  type = 'koi',
  position = [0, 0, 0],
  scale = 1,
  swimRadius = 1.2,
  swimSpeed = 0.85,
  swimCenter,
  swimHeight = 0.3,
  phaseOffset = 0,
}: Organic3DFishProps) {
  const mainGroup = useRef<THREE.Group>(null);
  const tailGroup = useRef<THREE.Group>(null);
  const dorsalRef = useRef<THREE.Mesh>(null);
  const leftPecRef = useRef<THREE.Group>(null);
  const rightPecRef = useRef<THREE.Group>(null);
  const bodyMeshRef = useRef<THREE.Mesh>(null);
  const tailMeshRef = useRef<THREE.Mesh>(null);

  const center = useMemo<[number, number, number]>(
    () => swimCenter ?? position,
    [swimCenter, position]
  );

  // High-Res Canvas Texture for the Fish Skin
  const fishTexture = useMemo(() => generateFishTexture(type), [type]);

  // Seamless Fish Body Geometry
  const { geom: bodyGeom, restPositions: bodyRestPos, uList } = useMemo(
    () => buildSeamlessFishGeometry(36, 24),
    []
  );

  // Silk Caudal Tail Fin Geometry
  const { geom: tailGeom, restPositions: tailRestPos } = useMemo(
    () => buildCaudalFinGeometry(14, 0.95),
    []
  );

  // Fin Color scheme
  const finColor = type === 'koi'
    ? '#ff772e'
    : type === 'clown'
    ? '#f97316'
    : type === 'betta'
    ? '#38bdf8'
    : type === 'neon'
    ? '#7dd3fc'
    : '#fb923c';

  // Body PBR Material with clearcoat glossy wet scales
  const bodyMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: fishTexture,
      roughness: 0.16,
      metalness: 0.1,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      reflectivity: 0.8,
    });
  }, [fishTexture]);

  // Translucent Silk Fin Material
  const finMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: finColor,
      transparent: true,
      opacity: 0.82,
      roughness: 0.18,
      transmission: 0.45,
      thickness: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false,
      emissive: finColor,
      emissiveIntensity: 0.25,
    });
  }, [finColor]);

  // Eye Iris Color
  const irisColor = type === 'koi' ? '#f59e0b' : type === 'betta' ? '#38bdf8' : '#fbbf24';

  useFrame((state) => {
    if (!mainGroup.current || !bodyMeshRef.current) return;
    const t = state.clock.elapsedTime * swimSpeed + phaseOffset;

    // 1. Organic 3D Swim Trajectory (Lissajous Path)
    const x = center[0] + Math.sin(t) * swimRadius;
    const z = center[1] + Math.sin(t * 2) * (swimRadius * 0.42);
    const y = center[2] + Math.sin(t * 1.5) * swimHeight;

    const dx = Math.cos(t) * swimRadius;
    const dz = Math.cos(t * 2) * 2 * (swimRadius * 0.42);
    const heading = Math.atan2(dx, dz);

    mainGroup.current.position.set(x, y, z);
    mainGroup.current.rotation.y = heading - Math.PI / 2;

    // Banking into turns (rolling on longitudinal axis)
    const turnCurvature = Math.sin(t * 2);
    mainGroup.current.rotation.x = THREE.MathUtils.lerp(
      mainGroup.current.rotation.x,
      -turnCurvature * 0.2,
      0.1
    );
    mainGroup.current.rotation.z = THREE.MathUtils.lerp(
      mainGroup.current.rotation.z,
      Math.cos(t * 1.5) * 0.08,
      0.1
    );

    // 2. Carangiform Spinal Wave Vertex Deformation on the Seamless Body
    const waveFreq = 7.2 * swimSpeed;
    const waveT = state.clock.elapsedTime * waveFreq + phaseOffset;
    const posAttr = bodyGeom.attributes.position;
    const posArr = posAttr.array as Float32Array;

    for (let i = 0; i < uList.length; i++) {
      const u = uList[i];
      const idx = i * 3;
      const x0 = bodyRestPos[idx];
      const y0 = bodyRestPos[idx + 1];
      const z0 = bodyRestPos[idx + 2];

      // Travelling wave from head (u=0) to tail (u=1)
      // Amplitude is near zero at head, quadratic ramp up to tail
      const amp = (u * u) * 0.45;
      const wave = Math.sin(waveT - u * 3.6) * amp;

      posArr[idx] = x0;
      posArr[idx + 1] = y0;
      posArr[idx + 2] = z0 + wave;
    }
    posAttr.needsUpdate = true;
    bodyGeom.computeVertexNormals();

    // 3. Tail Peduncle & Caudal Fin Wave Whip
    if (tailGroup.current && tailMeshRef.current) {
      const tailWave = Math.sin(waveT - 3.6) * 0.45;
      tailGroup.current.position.z = tailWave;
      tailGroup.current.rotation.y = Math.cos(waveT - 3.6) * 0.55;

      // Ripple the tail fin vertices
      const tailPosAttr = tailGeom.attributes.position;
      const tailPosArr = tailPosAttr.array as Float32Array;
      const count = tailPosArr.length / 3;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const x0 = tailRestPos[idx];
        const tipRatio = Math.abs(x0) / 0.95;
        const finFlutter = Math.sin(waveT * 1.2 - tipRatio * 3.0) * (tipRatio * 0.18);
        tailPosArr[idx + 2] = finFlutter;
      }
      tailPosAttr.needsUpdate = true;
    }

    // 4. Dorsal Fin Wave Flutter
    if (dorsalRef.current) {
      dorsalRef.current.rotation.z = Math.sin(waveT - 1.2) * 0.1;
    }

    // 5. Pectoral Fins Rhythmic Flapping
    const flap = Math.sin(waveT * 0.9) * 0.35;
    if (leftPecRef.current) {
      leftPecRef.current.rotation.y = 0.35 + flap;
      leftPecRef.current.rotation.z = 0.18 + flap * 0.4;
    }
    if (rightPecRef.current) {
      rightPecRef.current.rotation.y = -0.35 - flap;
      rightPecRef.current.rotation.z = -0.18 - flap * 0.4;
    }
  });

  return (
    <group ref={mainGroup} scale={scale}>
      {/* ── 1. Continuous Seamless Sculpted Fish Body ── */}
      <mesh ref={bodyMeshRef} geometry={bodyGeom} material={bodyMaterial} />

      {/* ── 2. Expressive Glossy 3D Eyes with Golden Iris & Glassy Cornea ── */}
      {[-1, 1].map((side) => (
        <group key={side} position={[0.78, 0.1, side * 0.2]} rotation={[0, side * 0.18, 0]}>
          {/* Eyeball / Sclera with Iris */}
          <mesh scale={[0.075, 0.075, 0.06]}>
            <sphereGeometry args={[1, 18, 18]} />
            <meshStandardMaterial color={irisColor} roughness={0.15} metalness={0.7} />
          </mesh>
          {/* Shiny Jet Black Pupil */}
          <mesh position={[0.024, 0, side * 0.038]} scale={[0.042, 0.042, 0.03]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color="#020617" />
          </mesh>
          {/* Corneal specular reflection highlight */}
          <mesh position={[0.035, 0.015, side * 0.045]} scale={[0.014, 0.014, 0.012]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      {/* ── 3. Koi Whisker Barbels (Sensory whiskers trailing at mouth) ── */}
      {type === 'koi' &&
        [-1, 1].map((side) => (
          <mesh
            key={`barbel-${side}`}
            position={[1.02, -0.06, side * 0.1]}
            rotation={[0.3, side * 0.4, -0.4]}
            scale={[0.015, 0.22, 0.015]}
          >
            <cylinderGeometry args={[0.5, 0.2, 1, 8]} />
            <meshStandardMaterial color="#ea580c" roughness={0.3} />
          </mesh>
        ))}

      {/* ── 4. Flowing Arched Dorsal Fin (along spine) ── */}
      <group position={[-0.1, 0.46, 0]}>
        <mesh
          ref={dorsalRef}
          position={[-0.2, 0.08, 0]}
          rotation={[0, 0, 0.08]}
          scale={[0.65, 0.28, 0.015]}
        >
          <coneGeometry args={[0.6, 1.3, 24]} />
          <primitive object={finMaterial} attach="material" />
        </mesh>
      </group>

      {/* ── 5. Pectoral Fins (Left & Right Flapping) ── */}
      <group ref={leftPecRef} position={[0.52, -0.12, 0.2]}>
        <mesh position={[-0.15, -0.12, 0.16]} rotation={[0.4, 0.3, -0.5]} scale={[0.26, 0.42, 0.016]}>
          <coneGeometry args={[0.5, 1, 16]} />
          <primitive object={finMaterial} attach="material" />
        </mesh>
      </group>
      <group ref={rightPecRef} position={[0.52, -0.12, -0.2]}>
        <mesh position={[-0.15, -0.12, -0.16]} rotation={[-0.4, -0.3, -0.5]} scale={[0.26, 0.42, 0.016]}>
          <coneGeometry args={[0.5, 1, 16]} />
          <primitive object={finMaterial} attach="material" />
        </mesh>
      </group>

      {/* ── 6. Ventral / Pelvic Fins (Underbelly) ── */}
      <group position={[0.1, -0.34, 0]}>
        <mesh position={[-0.08, -0.12, 0.06]} rotation={[0.2, 0, -0.4]} scale={[0.16, 0.3, 0.012]}>
          <coneGeometry args={[0.4, 1, 12]} />
          <primitive object={finMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.08, -0.12, -0.06]} rotation={[-0.2, 0, -0.4]} scale={[0.16, 0.3, 0.012]}>
          <coneGeometry args={[0.4, 1, 12]} />
          <primitive object={finMaterial} attach="material" />
        </mesh>
      </group>

      {/* ── 7. Caudal Tail Fan (Anchored at Tail Peduncle x = -1.5) ── */}
      <group ref={tailGroup} position={[-1.5, -0.02, 0]}>
        <mesh ref={tailMeshRef} geometry={tailGeom} material={finMaterial} />
      </group>
    </group>
  );
}
