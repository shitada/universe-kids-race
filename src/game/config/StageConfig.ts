import type { StageConfig } from '../../types';

export const STAGE_CONFIGS: StageConfig[] = [
  {
    stageNumber: 1,
    destination: '月',
    stageLength: 1000,
    meteoriteInterval: 3.0,
    starDensity: 5,
    emoji: '🌙',
    displayName: '月をめざせ！',
    planetColor: 0xcccccc,
  },
  {
    stageNumber: 2,
    destination: '火星',
    stageLength: 1200,
    meteoriteInterval: 2.5,
    starDensity: 5,
    emoji: '🔴',
    displayName: '火星をめざせ！',
    planetColor: 0xcc4422,
  },
  {
    stageNumber: 3,
    destination: '木星',
    stageLength: 1400,
    meteoriteInterval: 2.0,
    starDensity: 6,
    emoji: '🟠',
    displayName: '木星をめざせ！',
    planetColor: 0xdd8844,
  },
  {
    stageNumber: 4,
    destination: '土星',
    stageLength: 1600,
    meteoriteInterval: 1.7,
    starDensity: 6,
    emoji: '🪐',
    displayName: '土星をめざせ！',
    planetColor: 0xddaa44,
  },
  {
    stageNumber: 5,
    destination: '天王星',
    stageLength: 1800,
    meteoriteInterval: 1.4,
    starDensity: 7,
    emoji: '🔵',
    displayName: '天王星をめざせ！',
    planetColor: 0x66ccdd,
  },
  {
    stageNumber: 6,
    destination: '海王星',
    stageLength: 2000,
    meteoriteInterval: 1.1,
    starDensity: 8,
    emoji: '🫧',
    displayName: '海王星をめざせ！',
    planetColor: 0x2244cc,
  },
  {
    stageNumber: 7,
    destination: '冥王星',
    stageLength: 2200,
    meteoriteInterval: 0.8,
    starDensity: 9,
    emoji: '❄️',
    displayName: '冥王星をめざせ！',
    planetColor: 0xbbaaaa,
  },
  {
    stageNumber: 8,
    destination: '太陽',
    stageLength: 2500,
    meteoriteInterval: 0.6,
    starDensity: 10,
    emoji: '☀️',
    displayName: '太陽をめざせ！',
    planetColor: 0xffcc00,
  },
];

export function getStageConfig(stageNumber: number): StageConfig {
  const config = STAGE_CONFIGS[stageNumber - 1];
  if (!config) throw new Error(`Invalid stage number: ${stageNumber}`);
  return config;
}
