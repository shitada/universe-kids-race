import type {
  StageConfig,
  StageMedalGoalTier,
  StageMedalStatus,
  StageMedalTier,
} from '../../types';

export const STAGE_MEDAL_ICONS: Record<StageMedalTier, string> = {
  none: '⭐',
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
};

const MEDAL_TIERS: StageMedalGoalTier[] = ['bronze', 'silver', 'gold'];
const MEDAL_TIER_BY_COUNT: StageMedalTier[] = ['none', 'bronze', 'silver', 'gold'];

function createStageConfig(
  config: Omit<StageConfig, 'displayName'>,
): StageConfig {
  return {
    ...config,
    displayName: `${config.destinationReading}を めざせ！`,
  };
}

export const STAGE_CONFIGS: StageConfig[] = [
  createStageConfig({
    stageNumber: 1,
    destination: '月',
    destinationReading: 'つき',
    stageLength: 1000,
    meteoriteInterval: 3.0,
    starDensity: 5,
    medalThresholds: [2, 5, 8],
    emoji: '🌙',
    planetColor: 0xcccccc,
  }),
  createStageConfig({
    stageNumber: 2,
    destination: '水星',
    destinationReading: 'すいせい',
    stageLength: 1100,
    meteoriteInterval: 2.8,
    starDensity: 5,
    medalThresholds: [3, 6, 10],
    emoji: '⚫',
    planetColor: 0x888888,
  }),
  createStageConfig({
    stageNumber: 3,
    destination: '金星',
    destinationReading: 'きんせい',
    stageLength: 1150,
    meteoriteInterval: 2.6,
    starDensity: 5,
    medalThresholds: [3, 7, 11],
    emoji: '🟡',
    planetColor: 0xddaa44,
  }),
  createStageConfig({
    stageNumber: 4,
    destination: '火星',
    destinationReading: 'かせい',
    stageLength: 1200,
    meteoriteInterval: 2.5,
    starDensity: 5,
    medalThresholds: [4, 8, 12],
    emoji: '🔴',
    planetColor: 0xcc4422,
  }),
  createStageConfig({
    stageNumber: 5,
    destination: '木星',
    destinationReading: 'もくせい',
    stageLength: 1400,
    meteoriteInterval: 2.0,
    starDensity: 6,
    medalThresholds: [5, 10, 15],
    emoji: '🟠',
    planetColor: 0xdd8844,
  }),
  createStageConfig({
    stageNumber: 6,
    destination: '土星',
    destinationReading: 'どせい',
    stageLength: 1600,
    meteoriteInterval: 1.7,
    starDensity: 6,
    medalThresholds: [6, 12, 18],
    emoji: '🪐',
    planetColor: 0xddaa44,
  }),
  createStageConfig({
    stageNumber: 7,
    destination: '天王星',
    destinationReading: 'てんのうせい',
    stageLength: 1800,
    meteoriteInterval: 1.4,
    starDensity: 7,
    medalThresholds: [7, 14, 20],
    emoji: '🔵',
    planetColor: 0x66ccdd,
  }),
  createStageConfig({
    stageNumber: 8,
    destination: '海王星',
    destinationReading: 'かいおうせい',
    stageLength: 2000,
    meteoriteInterval: 1.1,
    starDensity: 8,
    medalThresholds: [8, 16, 24],
    emoji: '🫧',
    planetColor: 0x2244cc,
  }),
  createStageConfig({
    stageNumber: 9,
    destination: '冥王星',
    destinationReading: 'めいおうせい',
    stageLength: 2200,
    meteoriteInterval: 0.8,
    starDensity: 9,
    medalThresholds: [9, 18, 27],
    emoji: '❄️',
    planetColor: 0xbbaaaa,
  }),
  createStageConfig({
    stageNumber: 10,
    destination: '太陽',
    destinationReading: 'たいよう',
    stageLength: 2500,
    meteoriteInterval: 0.6,
    starDensity: 10,
    medalThresholds: [10, 20, 30],
    emoji: '☀️',
    planetColor: 0xffcc00,
  }),
  createStageConfig({
    stageNumber: 11,
    destination: '宇宙ステーション',
    destinationReading: 'うちゅうすてーしょん',
    stageLength: 2600,
    meteoriteInterval: 0.55,
    starDensity: 10,
    medalThresholds: [11, 22, 33],
    emoji: '🛰️',
    planetColor: 0xc9d2e3,
  }),
  createStageConfig({
    stageNumber: 12,
    destination: '地球',
    destinationReading: 'ちきゅう',
    stageLength: 2700,
    meteoriteInterval: 0.5,
    starDensity: 10,
    medalThresholds: [12, 24, 36],
    emoji: '🌍',
    planetColor: 0x2266aa,
  }),
];

export function getStageConfig(stageNumber: number): StageConfig {
  const config = STAGE_CONFIGS[stageNumber - 1];
  if (!config) throw new Error(`Invalid stage number: ${stageNumber}`);
  return config;
}

export function getStageMedalStatus(stageNumber: number, starCount: number): StageMedalStatus {
  const thresholds = getStageConfig(stageNumber).medalThresholds;
  const safeStars = Number.isInteger(starCount) && starCount > 0 ? starCount : 0;
  const slots = thresholds.map((threshold, index) => {
    const tier = MEDAL_TIERS[index];
    return {
      tier,
      icon: STAGE_MEDAL_ICONS[tier],
      threshold,
      reached: safeStars >= threshold,
    };
  });
  const earnedCount = slots.reduce<number>(
    (count, slot) => count + (slot.reached ? 1 : 0),
    0,
  ) as 0 | 1 | 2 | 3;
  const tier = MEDAL_TIER_BY_COUNT[earnedCount];
  const nextSlot = slots.find((slot) => !slot.reached) ?? null;

  return {
    tier,
    icon: STAGE_MEDAL_ICONS[tier],
    stars: safeStars,
    earnedCount,
    thresholds,
    slots,
    nextTier: nextSlot?.tier ?? null,
    nextThreshold: nextSlot?.threshold ?? null,
  };
}

export const TOTAL_STAGES = STAGE_CONFIGS.length;
