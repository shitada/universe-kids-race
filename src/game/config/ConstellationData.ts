import type { ConstellationDefinition } from '../../types';

function createConstellationDefinition(
  definition: Omit<ConstellationDefinition, 'encyclopediaLabel' | 'hintMessage' | 'celebrationMessage'>,
): ConstellationDefinition {
  return {
    ...definition,
    encyclopediaLabel: `${definition.name}（${definition.reading}）`,
    hintMessage: `${definition.name} を さがそう！`,
    celebrationMessage: `✨ ${definition.name} かんせい！`,
  };
}

export const CONSTELLATION_DATA: readonly ConstellationDefinition[] = [
  createConstellationDefinition({
    id: 'ursa-major',
    stageNumber: 1,
    name: 'おおぐまざ',
    reading: 'おおぐまざ',
    points: [
      { x: -4.6, y: 0.45, z: -120 },
      { x: -2.3, y: 0.9, z: -145 },
      { x: 0.1, y: 0.5, z: -170 },
      { x: 2.8, y: 0.85, z: -195 },
    ],
  }),
  createConstellationDefinition({
    id: 'orion',
    stageNumber: 4,
    name: 'オリオンざ',
    reading: 'おりおんざ',
    points: [
      { x: -3.1, y: 0.85, z: -180 },
      { x: -0.1, y: 0.15, z: -210 },
      { x: 3.2, y: 0.8, z: -240 },
    ],
  }),
  createConstellationDefinition({
    id: 'cassiopeia',
    stageNumber: 6,
    name: 'カシオペアざ',
    reading: 'かしおぺあざ',
    points: [
      { x: -4.8, y: 0.8, z: -210 },
      { x: -2.2, y: 0.2, z: -240 },
      { x: 0.1, y: 0.95, z: -270 },
      { x: 2.4, y: 0.15, z: -300 },
      { x: 4.9, y: 0.82, z: -330 },
    ],
  }),
] as const;

const CONSTELLATION_BY_STAGE = new Map(
  CONSTELLATION_DATA.map((definition) => [definition.stageNumber, definition] as const),
);

export function getConstellationForStage(stageNumber: number): ConstellationDefinition | undefined {
  return CONSTELLATION_BY_STAGE.get(stageNumber);
}
