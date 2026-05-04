import * as THREE from 'three';
import {
  DEFAULT_SPACESHIP_CUSTOMIZATION,
  SPACESHIP_COLOR_KEYS,
  type SpaceshipColorKey,
  type SpaceshipCustomization,
} from '../../types';

export interface SpaceshipColorOption {
  key: SpaceshipColorKey;
  label: string;
  hex: number;
}

export interface SpaceshipMaterialSet {
  body: THREE.MeshToonMaterial;
  nose: THREE.MeshToonMaterial;
  wings: THREE.MeshToonMaterial;
}

const SPACESHIP_COLOR_OPTIONS: readonly SpaceshipColorOption[] = [
  { key: 'sky', label: 'そら', hex: 0x4488ff },
  { key: 'sunset', label: 'たいよう', hex: 0xff6644 },
  { key: 'aqua', label: 'うみ', hex: 0x44aaff },
] as const;

const SPACESHIP_COLOR_HEX: Record<SpaceshipColorKey, number> = SPACESHIP_COLOR_OPTIONS.reduce(
  (map, option) => {
    map[option.key] = option.hex;
    return map;
  },
  {} as Record<SpaceshipColorKey, number>,
);

function isSpaceshipColorKey(value: unknown): value is SpaceshipColorKey {
  return typeof value === 'string' && (SPACESHIP_COLOR_KEYS as readonly string[]).includes(value);
}

function getCacheKey(part: 'body' | 'nose' | 'wings', colorKey: SpaceshipColorKey): string {
  return `${part}:${colorKey}`;
}

export class SpaceshipMaterialManager {
  private static readonly materialCache = new Map<string, THREE.MeshToonMaterial>();

  getColorOptions(): readonly SpaceshipColorOption[] {
    return SPACESHIP_COLOR_OPTIONS;
  }

  getMaterials(customization: SpaceshipCustomization): SpaceshipMaterialSet {
    const normalized = SpaceshipMaterialManager.normalizeCustomization(customization);
    return {
      body: this.getMaterial('body', normalized.bodyColor),
      nose: this.getMaterial('nose', normalized.noseColor),
      wings: this.getMaterial('wings', normalized.wingColor),
    };
  }

  private getMaterial(part: 'body' | 'nose' | 'wings', colorKey: SpaceshipColorKey): THREE.MeshToonMaterial {
    const cacheKey = getCacheKey(part, colorKey);
    let material = SpaceshipMaterialManager.materialCache.get(cacheKey);
    if (!material) {
      material = new THREE.MeshToonMaterial({ color: SPACESHIP_COLOR_HEX[colorKey] });
      SpaceshipMaterialManager.materialCache.set(cacheKey, material);
    }
    return material;
  }

  static getColorOptions(): readonly SpaceshipColorOption[] {
    return SPACESHIP_COLOR_OPTIONS;
  }

  static getColorHex(colorKey: SpaceshipColorKey): number {
    return SPACESHIP_COLOR_HEX[colorKey];
  }

  static normalizeCustomization(customization: Partial<SpaceshipCustomization> | null | undefined): SpaceshipCustomization {
    return {
      bodyColor: isSpaceshipColorKey(customization?.bodyColor)
        ? customization.bodyColor
        : DEFAULT_SPACESHIP_CUSTOMIZATION.bodyColor,
      noseColor: isSpaceshipColorKey(customization?.noseColor)
        ? customization.noseColor
        : DEFAULT_SPACESHIP_CUSTOMIZATION.noseColor,
      wingColor: isSpaceshipColorKey(customization?.wingColor)
        ? customization.wingColor
        : DEFAULT_SPACESHIP_CUSTOMIZATION.wingColor,
    };
  }
}
