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

export const STAGE_CONFIGS: StageConfig[] = [
  {
    stageNumber: 1,
    destination: '月',
    stageLength: 1000,
    meteoriteInterval: 3.0,
    starDensity: 5,
    medalThresholds: [2, 5, 8],
    emoji: '🌙',
    displayName: '月をめざせ！',
    planetColor: 0xcccccc,
  },
  {
    stageNumber: 2,
    destination: '水星',
    stageLength: 1100,
    meteoriteInterval: 2.8,
    starDensity: 5,
    medalThresholds: [3, 6, 10],
    emoji: '⚫',
    displayName: '水星をめざせ！',
    planetColor: 0x888888,
  },
  {
    stageNumber: 3,
    destination: '金星',
    stageLength: 1150,
    meteoriteInterval: 2.6,
    starDensity: 5,
    medalThresholds: [3, 7, 11],
    emoji: '🟡',
    displayName: '金星をめざせ！',
    planetColor: 0xddaa44,
  },
  {
    stageNumber: 4,
    destination: '火星',
    stageLength: 1200,
    meteoriteInterval: 2.5,
    starDensity: 5,
    medalThresholds: [4, 8, 12],
    emoji: '🔴',
    displayName: '火星をめざせ！',
    planetColor: 0xcc4422,
  },
  {
    stageNumber: 5,
    destination: '木星',
    stageLength: 1400,
    meteoriteInterval: 2.0,
    starDensity: 6,
    medalThresholds: [5, 10, 15],
    emoji: '🟠',
    displayName: '木星をめざせ！',
    planetColor: 0xdd8844,
  },
  {
    stageNumber: 6,
    destination: '土星',
    stageLength: 1600,
    meteoriteInterval: 1.7,
    starDensity: 6,
    medalThresholds: [6, 12, 18],
    emoji: '🪐',
    displayName: '土星をめざせ！',
    planetColor: 0xddaa44,
  },
  {
    stageNumber: 7,
    destination: '天王星',
    stageLength: 1800,
    meteoriteInterval: 1.4,
    starDensity: 7,
    medalThresholds: [7, 14, 20],
    emoji: '🔵',
    displayName: '天王星をめざせ！',
    planetColor: 0x66ccdd,
  },
  {
    stageNumber: 8,
    destination: '海王星',
    stageLength: 2000,
    meteoriteInterval: 1.1,
    starDensity: 8,
    medalThresholds: [8, 16, 24],
    emoji: '🫧',
    displayName: '海王星をめざせ！',
    planetColor: 0x2244cc,
  },
  {
    stageNumber: 9,
    destination: '冥王星',
    stageLength: 2200,
    meteoriteInterval: 0.8,
    starDensity: 9,
    medalThresholds: [9, 18, 27],
    emoji: '❄️',
    displayName: '冥王星をめざせ！',
    planetColor: 0xbbaaaa,
  },
  {
    stageNumber: 10,
    destination: '太陽',
    stageLength: 2500,
    meteoriteInterval: 0.6,
    starDensity: 10,
    medalThresholds: [10, 20, 30],
    emoji: '☀️',
    displayName: '太陽をめざせ！',
    planetColor: 0xffcc00,
  },
  {
    stageNumber: 11,
    destination: '地球',
    stageLength: 2700,
    meteoriteInterval: 0.5,
    starDensity: 10,
    medalThresholds: [12, 24, 36],
    emoji: '🌍',
    displayName: '地球をめざせ！',
    planetColor: 0x2266aa,
  },
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
