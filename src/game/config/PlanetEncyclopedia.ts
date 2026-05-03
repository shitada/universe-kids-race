import type { PlanetEncyclopediaEntry } from '../../types';

function createPlanetEncyclopediaEntry(
  entry: Omit<PlanetEncyclopediaEntry, 'encyclopediaLabel'>,
): PlanetEncyclopediaEntry {
  return {
    ...entry,
    encyclopediaLabel: `${entry.name}（${entry.reading}）`,
  };
}

export const PLANET_ENCYCLOPEDIA: PlanetEncyclopediaEntry[] = [
  createPlanetEncyclopediaEntry({
    stageNumber: 1,
    name: '月',
    reading: 'つき',
    emoji: '🌙',
    trivia: 'つきは ちきゅうの まわりを まわっているよ',
    planetColor: 0xcccccc,
    companionShape: 'basic',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 2,
    name: '水星',
    reading: 'すいせい',
    emoji: '⚫',
    trivia: 'すいせいは たいように いちばん ちかい わくせいだよ',
    planetColor: 0x888888,
    companionShape: 'basic',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 3,
    name: '金星',
    reading: 'きんせい',
    emoji: '🟡',
    trivia: 'きんせいは いちばん あつい わくせいだよ',
    planetColor: 0xddaa44,
    companionShape: 'basic',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 4,
    name: '火星',
    reading: 'かせい',
    emoji: '🔴',
    trivia: 'かせいは あかい すなで おおわれているよ',
    planetColor: 0xcc4422,
    companionShape: 'horned',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 5,
    name: '木星',
    reading: 'もくせい',
    emoji: '🟠',
    trivia: 'もくせいは ちきゅうの 1000こぶん おおきいよ！',
    planetColor: 0xdd8844,
    companionShape: 'basic',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 6,
    name: '土星',
    reading: 'どせい',
    emoji: '🪐',
    trivia: 'どせいの わっかは こおりで できているよ',
    planetColor: 0xddaa44,
    companionShape: 'ringed',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 7,
    name: '天王星',
    reading: 'てんのうせい',
    emoji: '🔵',
    trivia: 'てんのうせいは よこに たおれて まわっているよ',
    planetColor: 0x66ccdd,
    companionShape: 'icy',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 8,
    name: '海王星',
    reading: 'かいおうせい',
    emoji: '🫧',
    trivia: 'かいおうせいは いちばん かぜが つよい わくせいだよ',
    planetColor: 0x2244cc,
    companionShape: 'bubble',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 9,
    name: '冥王星',
    reading: 'めいおうせい',
    emoji: '❄️',
    trivia: 'めいおうせいは とっても ちいさい ほしだよ',
    planetColor: 0xbbaaaa,
    companionShape: 'icy',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 10,
    name: '太陽',
    reading: 'たいよう',
    emoji: '☀️',
    trivia: 'たいようは もえている おおきな ほしだよ',
    planetColor: 0xffcc00,
    companionShape: 'radiant',
  }),
  createPlanetEncyclopediaEntry({
    stageNumber: 11,
    name: '地球',
    reading: 'ちきゅう',
    emoji: '🌍',
    trivia: 'ちきゅうは いのちが ある たったひとつの ほしだよ',
    planetColor: 0x2266aa,
    companionShape: 'basic',
  }),
];

const PLANET_ENCYCLOPEDIA_BY_STAGE = new Map(
  PLANET_ENCYCLOPEDIA.map((entry) => [entry.stageNumber, entry] as const),
);

export function getPlanetEncyclopediaEntry(stageNumber: number): PlanetEncyclopediaEntry | undefined {
  return PLANET_ENCYCLOPEDIA_BY_STAGE.get(stageNumber);
}

export function getNextPlanetEncyclopediaEntry(stageNumber: number): PlanetEncyclopediaEntry | undefined {
  return getPlanetEncyclopediaEntry(stageNumber + 1);
}
