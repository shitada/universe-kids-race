import type { SpecialShootingStarType } from '../../types';

export interface SpecialStarVisualConfig {
  coreColor: number;
  emissiveColor: number;
  trailColor: number;
  auraColor: number;
  ringColor: number;
}

export interface SpecialStarMotionConfig {
  speedX: number;
  speedY: number;
  speedZ: number;
  swayX: number;
  swayY: number;
  frequency: number;
}

export interface SpecialStarDefinition {
  scoreBonus: number;
  spawnWeight: number;
  label: string;
  visual: SpecialStarVisualConfig;
  motion: SpecialStarMotionConfig;
}

export interface SpecialStarSpawnConfig {
  attemptInterval: number;
  spawnChance: number;
  introGraceSeconds: number;
  spawnAheadDistance: number;
  spawnX: number;
  spawnYMin: number;
  spawnYRange: number;
  spawnXJitter: number;
  spawnZJitter: number;
}

export const SPECIAL_STAR_CONFIG: Record<SpecialShootingStarType, SpecialStarDefinition> = {
  rainbow: {
    scoreBonus: 2200,
    spawnWeight: 0.24,
    label: '🌈 にじりゅうせい！',
    visual: {
      coreColor: 0xff8ef3,
      emissiveColor: 0x8ee8ff,
      trailColor: 0xffcc55,
      auraColor: 0x7ff6ff,
      ringColor: 0xffffff,
    },
    motion: {
      speedX: 6.6,
      speedY: -0.3,
      speedZ: 10.8,
      swayX: 1.1,
      swayY: 0.48,
      frequency: 3.2,
    },
  },
  gold: {
    scoreBonus: 1800,
    spawnWeight: 0.33,
    label: '✨ きんりゅうせい！',
    visual: {
      coreColor: 0xffd54f,
      emissiveColor: 0xfff2a8,
      trailColor: 0xffb300,
      auraColor: 0xffef9a,
      ringColor: 0xfff8e1,
    },
    motion: {
      speedX: 7.1,
      speedY: -0.22,
      speedZ: 11.2,
      swayX: 0.82,
      swayY: 0.35,
      frequency: 4.1,
    },
  },
  silver: {
    scoreBonus: 1400,
    spawnWeight: 0.43,
    label: '💫 ぎんりゅうせい！',
    visual: {
      coreColor: 0xe5f3ff,
      emissiveColor: 0xa3dcff,
      trailColor: 0xb7d8ff,
      auraColor: 0xffffff,
      ringColor: 0xdff2ff,
    },
    motion: {
      speedX: 6.9,
      speedY: -0.16,
      speedZ: 11.5,
      swayX: 0.92,
      swayY: 0.28,
      frequency: 2.7,
    },
  },
};

export const SPECIAL_STAR_SPAWN_CONFIG: SpecialStarSpawnConfig = {
  attemptInterval: 6,
  spawnChance: 0.08,
  introGraceSeconds: 6,
  spawnAheadDistance: 88,
  spawnX: 10.4,
  spawnYMin: -0.25,
  spawnYRange: 1.55,
  spawnXJitter: 1.8,
  spawnZJitter: 12,
};

export function pickSpecialShootingStarType(randomValue: number): SpecialShootingStarType {
  let cumulative = 0;
  for (const type of ['rainbow', 'gold', 'silver'] as const) {
    cumulative += SPECIAL_STAR_CONFIG[type].spawnWeight;
    if (randomValue < cumulative) {
      return type;
    }
  }
  return 'silver';
}
