import type { SpaceGemEncyclopediaEntry, SpaceGemType } from '../../types';
import { createEncyclopediaLabel } from './PlanetEncyclopedia';

export interface SpaceGemVisualConfig {
  coreColor: number;
  emissiveColor: number;
  glowColor: number;
  ringColor: number;
  particleColor: number;
}

export interface SpaceGemMotionConfig {
  swayX: number;
  swayY: number;
  frequency: number;
  spinSpeed: number;
  pulseSpeed: number;
}

export interface SpaceGemDefinition extends SpaceGemEncyclopediaEntry {
  scoreBonus: number;
  spawnWeight: number;
  pickupLabel: string;
  visual: SpaceGemVisualConfig;
  motion: SpaceGemMotionConfig;
}

export interface SpaceGemSpawnConfig {
  attemptInterval: number;
  spawnChance: number;
  introGraceSeconds: number;
  spawnAheadDistance: number;
  spawnXRange: number;
  spawnYMin: number;
  spawnYRange: number;
  spawnZJitter: number;
}

function createSpaceGemEntry(
  entry: Omit<SpaceGemDefinition, 'encyclopediaLabel'>,
): SpaceGemDefinition {
  return {
    ...entry,
    encyclopediaLabel: createEncyclopediaLabel(entry.name, entry.reading),
  };
}

export const SPACE_GEM_CONFIG: Record<SpaceGemType, SpaceGemDefinition> = {
  'diamond-nebula': createSpaceGemEntry({
    id: 'diamond-nebula',
    name: 'ダイヤモンド星雲',
    reading: 'だいやもんどせいうん',
    emoji: '💎',
    trivia: 'こおりみたいに すきとおって きらっと ひかる せいうんだよ',
    accentColor: 0xdff8ff,
    scoreBonus: 2200,
    spawnWeight: 0.12,
    pickupLabel: '💎 だいやもんど みーつけた！',
    visual: {
      coreColor: 0xe8fbff,
      emissiveColor: 0xc1f7ff,
      glowColor: 0x96ecff,
      ringColor: 0xffffff,
      particleColor: 0xe8fbff,
    },
    motion: {
      swayX: 0.26,
      swayY: 0.18,
      frequency: 3.8,
      spinSpeed: 2.8,
      pulseSpeed: 4.6,
    },
  }),
  'emerald-comet': createSpaceGemEntry({
    id: 'emerald-comet',
    name: 'エメラルド彗星',
    reading: 'えめらるどすいせい',
    emoji: '💚',
    trivia: 'みどりの しっぽを ぴかっと のこす げんきな たからものだよ',
    accentColor: 0x5fe18a,
    scoreBonus: 2000,
    spawnWeight: 0.16,
    pickupLabel: '💚 えめらるど すいせい！',
    visual: {
      coreColor: 0x7ff0a4,
      emissiveColor: 0x4ed87c,
      glowColor: 0x67ffb8,
      ringColor: 0xcfffe3,
      particleColor: 0x7ff0a4,
    },
    motion: {
      swayX: 0.4,
      swayY: 0.16,
      frequency: 4.2,
      spinSpeed: 3.1,
      pulseSpeed: 5.2,
    },
  }),
  'ruby-solar-wind': createSpaceGemEntry({
    id: 'ruby-solar-wind',
    name: 'ルビー太陽風',
    reading: 'るびーたいようふう',
    emoji: '❤️',
    trivia: 'たいようの かぜを のせて あかく あつく きらめくよ',
    accentColor: 0xff6b7c,
    scoreBonus: 2000,
    spawnWeight: 0.16,
    pickupLabel: '❤️ るびーの かぜだ！',
    visual: {
      coreColor: 0xff8ca1,
      emissiveColor: 0xff5e78,
      glowColor: 0xffb0b8,
      ringColor: 0xffe0e7,
      particleColor: 0xff8394,
    },
    motion: {
      swayX: 0.32,
      swayY: 0.24,
      frequency: 3.1,
      spinSpeed: 3.4,
      pulseSpeed: 4.9,
    },
  }),
  'sapphire-orbit': createSpaceGemEntry({
    id: 'sapphire-orbit',
    name: 'サファイアリング',
    reading: 'さふぁいありんぐ',
    emoji: '💙',
    trivia: 'あおい わっかを くるくる まわしながら ひかる たからだよ',
    accentColor: 0x6ba8ff,
    scoreBonus: 1800,
    spawnWeight: 0.16,
    pickupLabel: '💙 さふぁいあ りんぐ！',
    visual: {
      coreColor: 0x87b7ff,
      emissiveColor: 0x5c8dff,
      glowColor: 0x9fd3ff,
      ringColor: 0xdcebff,
      particleColor: 0x87b7ff,
    },
    motion: {
      swayX: 0.3,
      swayY: 0.2,
      frequency: 2.9,
      spinSpeed: 2.5,
      pulseSpeed: 4.1,
    },
  }),
  'amethyst-moon': createSpaceGemEntry({
    id: 'amethyst-moon',
    name: 'アメジストムーン',
    reading: 'あめじすとむーん',
    emoji: '💜',
    trivia: 'むらさきの つきみたいに やさしく ほわんと ひかるよ',
    accentColor: 0xc290ff,
    scoreBonus: 1800,
    spawnWeight: 0.14,
    pickupLabel: '💜 むらさき つきだよ！',
    visual: {
      coreColor: 0xd4a3ff,
      emissiveColor: 0xae72ff,
      glowColor: 0xe5c8ff,
      ringColor: 0xf0e4ff,
      particleColor: 0xd4a3ff,
    },
    motion: {
      swayX: 0.24,
      swayY: 0.28,
      frequency: 2.4,
      spinSpeed: 2.2,
      pulseSpeed: 3.6,
    },
  }),
  'topaz-spark': createSpaceGemEntry({
    id: 'topaz-spark',
    name: 'トパーズスパーク',
    reading: 'とぱーずすぱーく',
    emoji: '💛',
    trivia: 'ぴょんぴょん はねる ひかりが たのしい きいろの たからだよ',
    accentColor: 0xffcf59,
    scoreBonus: 1600,
    spawnWeight: 0.14,
    pickupLabel: '💛 ぴかぴか とぱーず！',
    visual: {
      coreColor: 0xffe17b,
      emissiveColor: 0xffbd3f,
      glowColor: 0xffeea8,
      ringColor: 0xfff4d5,
      particleColor: 0xffd868,
    },
    motion: {
      swayX: 0.42,
      swayY: 0.18,
      frequency: 4.9,
      spinSpeed: 3.7,
      pulseSpeed: 5.8,
    },
  }),
  'pearl-dust': createSpaceGemEntry({
    id: 'pearl-dust',
    name: 'パールダスト',
    reading: 'ぱーるだすと',
    emoji: '🤍',
    trivia: 'ふわっと まう しろい ひかりが ほしの すなみたいで きれいだよ',
    accentColor: 0xf4f2ff,
    scoreBonus: 1600,
    spawnWeight: 0.12,
    pickupLabel: '🤍 ぱーるの すなだよ！',
    visual: {
      coreColor: 0xfffdf8,
      emissiveColor: 0xf0eaff,
      glowColor: 0xffffff,
      ringColor: 0xf4f2ff,
      particleColor: 0xf4f2ff,
    },
    motion: {
      swayX: 0.2,
      swayY: 0.22,
      frequency: 2.1,
      spinSpeed: 1.9,
      pulseSpeed: 3.1,
    },
  }),
};

export const SPACE_GEM_ENCYCLOPEDIA: SpaceGemEncyclopediaEntry[] = [
  SPACE_GEM_CONFIG['diamond-nebula'],
  SPACE_GEM_CONFIG['emerald-comet'],
  SPACE_GEM_CONFIG['ruby-solar-wind'],
  SPACE_GEM_CONFIG['sapphire-orbit'],
  SPACE_GEM_CONFIG['amethyst-moon'],
  SPACE_GEM_CONFIG['topaz-spark'],
  SPACE_GEM_CONFIG['pearl-dust'],
];

export const SPACE_GEM_SPAWN_CONFIG: SpaceGemSpawnConfig = {
  attemptInterval: 5,
  spawnChance: 0.02,
  introGraceSeconds: 8,
  spawnAheadDistance: 84,
  spawnXRange: 6.2,
  spawnYMin: -0.35,
  spawnYRange: 0.9,
  spawnZJitter: 18,
};

const SPACE_GEM_BY_ID = new Map(
  SPACE_GEM_ENCYCLOPEDIA.map((entry) => [entry.id, entry] as const),
);

export function getSpaceGemEncyclopediaEntry(id: SpaceGemType): SpaceGemEncyclopediaEntry | undefined {
  return SPACE_GEM_BY_ID.get(id);
}

export function pickSpaceGemType(randomValue: number): SpaceGemType {
  let cumulative = 0;
  for (const type of [
    'diamond-nebula',
    'emerald-comet',
    'ruby-solar-wind',
    'sapphire-orbit',
    'amethyst-moon',
    'topaz-spark',
    'pearl-dust',
  ] as const) {
    cumulative += SPACE_GEM_CONFIG[type].spawnWeight;
    if (randomValue < cumulative) {
      return type;
    }
  }
  return 'pearl-dust';
}
