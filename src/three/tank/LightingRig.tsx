import { AquariumLights } from '../lighting';

export type LightingPreset = 'warm' | 'cool' | 'cinematic';

export interface LightingRigProps {
  preset: LightingPreset;
  intensity: number;
}

/**
 * Tunable 3-point lighting rig for the configurator. Renders on top
 * of the shared ambient base from AquariumLights. Each preset gives
 * a distinct mood; the intensity slider scales all lights proportionally.
 */
export function LightingRig({ preset, intensity }: LightingRigProps) {
  const cfg = PRESETS[preset];
  return (
    <>
      <AquariumLights />
      <directionalLight
        position={cfg.keyPos}
        intensity={cfg.key * intensity}
        color={cfg.keyColor}
        castShadow={false}
      />
      <pointLight
        position={cfg.fillPos}
        intensity={cfg.fill * intensity}
        color={cfg.fillColor}
        distance={12}
      />
      <pointLight
        position={cfg.rimPos}
        intensity={cfg.rim * intensity}
        color={cfg.rimColor}
        distance={10}
      />
    </>
  );
}

const PRESETS: Record<
  LightingPreset,
  {
    key: number;
    keyColor: string;
    keyPos: [number, number, number];
    fill: number;
    fillColor: string;
    fillPos: [number, number, number];
    rim: number;
    rimColor: string;
    rimPos: [number, number, number];
  }
> = {
  warm: {
    key: 1.2,
    keyColor: '#ffd1a0',
    keyPos: [3, 5, 3],
    fill: 0.5,
    fillColor: '#5eead4',
    fillPos: [-3, 1, 2],
    rim: 0.4,
    rimColor: '#fbbf24',
    rimPos: [0, -2, -3],
  },
  cool: {
    key: 1.2,
    keyColor: '#9bd9ff',
    keyPos: [3, 4, 3],
    fill: 0.4,
    fillColor: '#5eead4',
    fillPos: [-3, 1, 2],
    rim: 0.4,
    rimColor: '#a78bfa',
    rimPos: [0, -1, -3],
  },
  cinematic: {
    key: 0.9,
    keyColor: '#ffffff',
    keyPos: [0, 6, 1],
    fill: 0.3,
    fillColor: '#143d31',
    fillPos: [0, -3, 0],
    rim: 1.2,
    rimColor: '#5eead4',
    rimPos: [0, 0, -4],
  },
};
