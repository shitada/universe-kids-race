import type { ColorVisionSupportMode } from '../../types';

export type ColorVisionFilterMode = Extract<
  ColorVisionSupportMode,
  'protanopia-filter' | 'deuteranopia-filter' | 'tritanopia-filter'
>;

export interface ColorVisionFilterConfig {
  readonly mode: ColorVisionFilterMode;
  readonly matrix: readonly [
    number, number, number,
    number, number, number,
    number, number, number,
  ];
  readonly saturation: number;
  readonly contrast: number;
  readonly lift: readonly [number, number, number];
}

const FILTER_CONFIGS: Readonly<Record<ColorVisionFilterMode, ColorVisionFilterConfig>> = {
  'protanopia-filter': {
    mode: 'protanopia-filter',
    matrix: [
      0.567, 0.433, 0,
      0.558, 0.442, 0,
      0, 0.242, 0.758,
    ],
    saturation: 1.12,
    contrast: 1.06,
    lift: [0.01, 0, 0.015],
  },
  'deuteranopia-filter': {
    mode: 'deuteranopia-filter',
    matrix: [
      0.625, 0.375, 0,
      0.7, 0.3, 0,
      0, 0.3, 0.7,
    ],
    saturation: 1.1,
    contrast: 1.05,
    lift: [0.01, 0.005, 0.01],
  },
  'tritanopia-filter': {
    mode: 'tritanopia-filter',
    matrix: [
      0.95, 0.05, 0,
      0, 0.433, 0.567,
      0, 0.475, 0.525,
    ],
    saturation: 1.08,
    contrast: 1.04,
    lift: [0.012, 0.012, 0],
  },
};

export function isColorVisionFilterMode(mode: ColorVisionSupportMode): mode is ColorVisionFilterMode {
  return mode === 'protanopia-filter' || mode === 'deuteranopia-filter' || mode === 'tritanopia-filter';
}

export function getColorVisionFilterConfig(mode: ColorVisionSupportMode): ColorVisionFilterConfig | null {
  return isColorVisionFilterMode(mode) ? FILTER_CONFIGS[mode] : null;
}

function clampChannel(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function applyColorVisionFilter(color: readonly [number, number, number], mode: ColorVisionFilterMode): [number, number, number] {
  const config = FILTER_CONFIGS[mode];
  const [r, g, b] = color;
  const m = config.matrix;
  const transformed: [number, number, number] = [
    r * m[0] + g * m[1] + b * m[2],
    r * m[3] + g * m[4] + b * m[5],
    r * m[6] + g * m[7] + b * m[8],
  ];

  const contrasted = transformed.map((channel) => clampChannel(((channel - 0.5) * config.contrast) + 0.5)) as [number, number, number];
  const luminance = contrasted[0] * 0.2126 + contrasted[1] * 0.7152 + contrasted[2] * 0.0722;

  return contrasted.map((channel, index) => {
    const saturated = luminance + ((channel - luminance) * config.saturation);
    return clampChannel(saturated + config.lift[index]);
  }) as [number, number, number];
}
