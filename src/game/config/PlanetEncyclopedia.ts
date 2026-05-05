import type {
  ColorVisionSupportMode,
  PlanetEncyclopediaEntry,
  SpecialStarEncyclopediaEntry,
} from '../../types';

export const DEFAULT_COLOR_VISION_SUPPORT_MODE: ColorVisionSupportMode = 'color-only';

export interface PlanetRewardPreview {
  cardChipLabel: string;
  companionChipLabel: string;
}

export function createEncyclopediaLabel(name: string, reading: string): string {
  return `${name}（${reading}）`;
}

function createSpecialStarEncyclopediaEntry(
  entry: Omit<SpecialStarEncyclopediaEntry, 'encyclopediaLabel'>,
): SpecialStarEncyclopediaEntry {
  return {
    ...entry,
    encyclopediaLabel: createEncyclopediaLabel(entry.name, entry.reading),
  };
}

function createPlanetEncyclopediaEntry(
  entry: Omit<PlanetEncyclopediaEntry, 'encyclopediaLabel'>,
): PlanetEncyclopediaEntry {
  return {
    ...entry,
    encyclopediaLabel: createEncyclopediaLabel(entry.name, entry.reading),
  };
}

export const PLANET_ENCYCLOPEDIA: PlanetEncyclopediaEntry[] = [
  createPlanetEncyclopediaEntry({
    stageNumber: 1,
    name: '月',
    reading: 'つき',
    identityMark: '○',
    emoji: '🌙',
    trivia: 'つきは ちきゅうの まわりを まわっているよ',
    planetColor: 0xcccccc,
    companionShape: 'basic',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 2,
    name: '水星',
    reading: 'すいせい',
    identityMark: '□',
    emoji: '⚫',
    trivia: 'すいせいは たいように いちばん ちかい わくせいだよ',
    planetColor: 0x888888,
    companionShape: 'basic',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 3,
    name: '金星',
    reading: 'きんせい',
    identityMark: '△',
    emoji: '🟡',
    trivia: 'きんせいは いちばん あつい わくせいだよ',
    planetColor: 0xddaa44,
    companionShape: 'basic',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 4,
    name: '火星',
    reading: 'かせい',
    identityMark: '◇',
    emoji: '🔴',
    trivia: 'かせいは あかい すなで おおわれているよ',
    planetColor: 0xcc4422,
    companionShape: 'horned',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 5,
    name: '木星',
    reading: 'もくせい',
    identityMark: '☆',
    emoji: '🟠',
    trivia: 'もくせいは ちきゅうの 1000こぶん おおきいよ！',
    planetColor: 0xdd8844,
    companionShape: 'basic',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 6,
    name: '土星',
    reading: 'どせい',
    identityMark: '⬟',
    emoji: '🪐',
    trivia: 'どせいの わっかは こおりで できているよ',
    planetColor: 0xddaa44,
    companionShape: 'ringed',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 7,
    name: '天王星',
    reading: 'てんのうせい',
    identityMark: '⬢',
    emoji: '🔵',
    trivia: 'てんのうせいは よこに たおれて まわっているよ',
    planetColor: 0x66ccdd,
    companionShape: 'icy',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 8,
    name: '海王星',
    reading: 'かいおうせい',
    identityMark: '✦',
    emoji: '🫧',
    trivia: 'かいおうせいは いちばん かぜが つよい わくせいだよ',
    planetColor: 0x2244cc,
    companionShape: 'bubble',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 9,
    name: '冥王星',
    reading: 'めいおうせい',
    identityMark: '⬣',
    emoji: '❄️',
    trivia: 'めいおうせいは とっても ちいさい ほしだよ',
    planetColor: 0xbbaaaa,
    companionShape: 'icy',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 10,
    name: '太陽',
    reading: 'たいよう',
    identityMark: '☀',
    emoji: '☀️',
    trivia: 'たいようは もえている おおきな ほしだよ',
    planetColor: 0xffcc00,
    companionShape: 'radiant',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 11,
    name: '宇宙ステーション',
    reading: 'うちゅうすてーしょん',
    identityMark: '✪',
    emoji: '🛰️',
    trivia: 'うちゅうすてーしょんは ひとが うちゅうで くらしたり けんきゅうしたり する いえだよ',
    planetColor: 0xc9d2e3,
    companionShape: 'basic',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 12,
    name: '地球',
    reading: 'ちきゅう',
    identityMark: '⬤',
    emoji: '🌍',
    trivia: 'ちきゅうは いのちが ある たったひとつの ほしだよ',
    planetColor: 0x2266aa,
    companionShape: 'basic',
  }),
];

export const SPECIAL_STAR_ENCYCLOPEDIA: SpecialStarEncyclopediaEntry[] = [
  createSpecialStarEncyclopediaEntry({
    id: 'rainbow',
    name: 'にじりゅうせい',
    reading: 'にじりゅうせい',
    emoji: '🌈',
    trivia: 'にじいろに ひかる とくべつな ながれぼしだよ',
    accentColor: 0xff66d9,
  }),
  createSpecialStarEncyclopediaEntry({
    id: 'gold',
    name: 'きんりゅうせい',
    reading: 'きんりゅうせい',
    emoji: '🥇',
    trivia: 'きらきら かがやく きんいろの ごうかな りゅうせいだよ',
    accentColor: 0xffd54f,
  }),
  createSpecialStarEncyclopediaEntry({
    id: 'silver',
    name: 'ぎんりゅうせい',
    reading: 'ぎんりゅうせい',
    emoji: '🥈',
    trivia: 'ぎんいろの ひかりを のこして すべるように とぶよ',
    accentColor: 0xcfe8ff,
  }),
];

const PLANET_ENCYCLOPEDIA_BY_STAGE = new Map(
  PLANET_ENCYCLOPEDIA.map((entry) => [entry.stageNumber, entry] as const),
);
const SPECIAL_STAR_ENCYCLOPEDIA_BY_ID = new Map(
  SPECIAL_STAR_ENCYCLOPEDIA.map((entry) => [entry.id, entry] as const),
);

export function getPlanetEncyclopediaEntry(stageNumber: number): PlanetEncyclopediaEntry | undefined {
  return PLANET_ENCYCLOPEDIA_BY_STAGE.get(stageNumber);
}

export function getNextPlanetEncyclopediaEntry(stageNumber: number): PlanetEncyclopediaEntry | undefined {
  return getPlanetEncyclopediaEntry(stageNumber + 1);
}

export function getSpecialStarEncyclopediaEntry(id: SpecialStarEncyclopediaEntry['id']): SpecialStarEncyclopediaEntry | undefined {
  return SPECIAL_STAR_ENCYCLOPEDIA_BY_ID.get(id);
}

export function normalizeColorVisionSupportMode(value: unknown): ColorVisionSupportMode {
  return value === 'color-and-marks' ? 'color-and-marks' : DEFAULT_COLOR_VISION_SUPPORT_MODE;
}

export function formatPlanetEncyclopediaLabel(
  entry: Pick<PlanetEncyclopediaEntry, 'encyclopediaLabel' | 'identityMark'>,
  mode: ColorVisionSupportMode = DEFAULT_COLOR_VISION_SUPPORT_MODE,
): string {
  return mode === 'color-and-marks' ? `${entry.identityMark} ${entry.encyclopediaLabel}` : entry.encyclopediaLabel;
}

export function formatPlanetReadingLabel(
  stageNumber: number,
  reading: string,
  mode: ColorVisionSupportMode = DEFAULT_COLOR_VISION_SUPPORT_MODE,
): string {
  if (mode !== 'color-and-marks') {
    return reading;
  }
  const entry = getPlanetEncyclopediaEntry(stageNumber);
  return entry ? `${entry.identityMark} ${reading}` : reading;
}

export function getPlanetRewardPreview(stageNumber: number): PlanetRewardPreview | undefined {
  const entry = getPlanetEncyclopediaEntry(stageNumber);
  if (!entry) {
    return undefined;
  }

  return {
    cardChipLabel: `📘 ${entry.emoji} ずかん`,
    companionChipLabel: `👾 ${entry.emoji} なかま`,
  };
}
