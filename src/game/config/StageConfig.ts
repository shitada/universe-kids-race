import type { StageConfig } from '../../types';

export const STAGE_CONFIGS: StageConfig[] = [
  {
    stageNumber: 1,
    destination: '月',
    stageLength: 500,
    meteoriteInterval: 3.0,
    starDensity: 5,
  },
  {
    stageNumber: 2,
    destination: '火星',
    stageLength: 700,
    meteoriteInterval: 2.0,
    starDensity: 6,
  },
  {
    stageNumber: 3,
    destination: '土星',
    stageLength: 900,
    meteoriteInterval: 1.0,
    starDensity: 7,
  },
];

export function getStageConfig(stageNumber: number): StageConfig {
  const config = STAGE_CONFIGS[stageNumber - 1];
  if (!config) throw new Error(`Invalid stage number: ${stageNumber}`);
  return config;
}
