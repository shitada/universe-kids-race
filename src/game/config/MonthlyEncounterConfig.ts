import type { MonthlyEncounterEncyclopediaEntry, MonthlyEncounterId } from '../../types';
import { createEncyclopediaLabel } from './PlanetEncyclopedia';

function createMonthlyEncounterEntry(
  entry: Omit<MonthlyEncounterEncyclopediaEntry, 'encyclopediaLabel'>,
): MonthlyEncounterEncyclopediaEntry {
  return {
    ...entry,
    encyclopediaLabel: createEncyclopediaLabel(entry.name, entry.reading),
  };
}

export const MONTHLY_ENCOUNTER_CONFIG: MonthlyEncounterEncyclopediaEntry[] = [
  createMonthlyEncounterEntry({
    id: 'new-year-comet',
    month: 1,
    name: 'しんねんすいせい',
    reading: 'しんねんすいせい',
    emoji: '☄️',
    trivia: 'おしょうがつの よぞらを ながれる きらきら すいせいだよ',
    encounterMessage: 'あたらしい てんたい はっけん！',
    accentColor: 0xffd166,
    scoreBonus: 800,
  }),
  createMonthlyEncounterEntry({
    id: 'heart-nebula',
    month: 2,
    name: 'はーとせいうん',
    reading: 'はーとせいうん',
    emoji: '💖',
    trivia: 'はーとの かたちに ひかる やさしい くもみたいな てんたいだよ',
    encounterMessage: 'きらきら はーとを みつけたよ！',
    accentColor: 0xff7eb6,
    scoreBonus: 800,
  }),
  createMonthlyEncounterEntry({
    id: 'spring-ribbon',
    month: 3,
    name: 'はるのりぼんぼし',
    reading: 'はるのりぼんぼし',
    emoji: '🎀',
    trivia: 'はるかぜみたいに ひらひら およぐ ほしだよ',
    encounterMessage: 'りぼんみたいな ほしだよ！',
    accentColor: 0xff9f68,
    scoreBonus: 800,
  }),
  createMonthlyEncounterEntry({
    id: 'rainbow-seed',
    month: 4,
    name: 'にじのたね',
    reading: 'にじのたね',
    emoji: '🌱',
    trivia: 'にじいろの ひかりを そだてる ふしぎな たねだよ',
    encounterMessage: 'にじの たねを ひろったよ！',
    accentColor: 0x88e27a,
    scoreBonus: 800,
  }),
  createMonthlyEncounterEntry({
    id: 'emerald-comet',
    month: 5,
    name: 'えめらるどすいせい',
    reading: 'えめらるどすいせい',
    emoji: '💚',
    trivia: 'みどりいろの ひかりを のこして とおりすぎる すいせいだよ',
    encounterMessage: 'みどりの すいせい はっけん！',
    accentColor: 0x43d17d,
    scoreBonus: 800,
  }),
  createMonthlyEncounterEntry({
    id: 'rainy-jelly',
    month: 6,
    name: 'あめつぶくらげ',
    reading: 'あめつぶくらげ',
    emoji: '🪼',
    trivia: 'あめつぶみたいに ぽよんぽよん ひかる うちゅうくらげだよ',
    encounterMessage: 'ふわふわ くらげを みつけたよ！',
    accentColor: 0x6ed6ff,
    scoreBonus: 800,
  }),
  createMonthlyEncounterEntry({
    id: 'tanabata-stream',
    month: 7,
    name: 'たなばたすとりーむ',
    reading: 'たなばたすとりーむ',
    emoji: '🎋',
    trivia: 'ほしの かわみたいに すーっと ながれる てんたいだよ',
    encounterMessage: 'ほしの かわが みえたよ！',
    accentColor: 0x7cc7ff,
    scoreBonus: 800,
  }),
  createMonthlyEncounterEntry({
    id: 'starlight-whale',
    month: 8,
    name: 'ほしくじら',
    reading: 'ほしくじら',
    emoji: '🐋',
    trivia: 'よぞらを ゆっくり およぐ おおきな ひかりの くじらだよ',
    encounterMessage: 'ほしくじらが こんにちは！',
    accentColor: 0x66b8ff,
    scoreBonus: 800,
  }),
  createMonthlyEncounterEntry({
    id: 'harvest-lantern',
    month: 9,
    name: 'つきみらんたん',
    reading: 'つきみらんたん',
    emoji: '🏮',
    trivia: 'おつきみの よるに あらわれる ぽっと ひかる らんたんだよ',
    encounterMessage: 'おつきみ らんたん みつけた！',
    accentColor: 0xffcb6b,
    scoreBonus: 800,
  }),
  createMonthlyEncounterEntry({
    id: 'pumpkin-nebula',
    month: 10,
    name: 'ぱんぷきんせいうん',
    reading: 'ぱんぷきんせいうん',
    emoji: '🎃',
    trivia: 'かぼちゃみたいに にこっと ひかる せいうんだよ',
    encounterMessage: 'にこにこ せいうん はっけん！',
    accentColor: 0xff9852,
    scoreBonus: 800,
  }),
  createMonthlyEncounterEntry({
    id: 'crystal-comet',
    month: 11,
    name: 'くりすたるすいせい',
    reading: 'くりすたるすいせい',
    emoji: '💎',
    trivia: 'すいしょうみたいに すきとおった ひかりの すいせいだよ',
    encounterMessage: 'きらきら くりすたる！',
    accentColor: 0xb4f1ff,
    scoreBonus: 800,
  }),
  createMonthlyEncounterEntry({
    id: 'geminid-rain',
    month: 12,
    name: 'ふたごりゅうせいう',
    reading: 'ふたごりゅうせいう',
    emoji: '🌠',
    trivia: 'ふゆの そらに たくさん きらめく ながれぼしの あめだよ',
    encounterMessage: 'ながれぼしの あめだよ！',
    accentColor: 0xdde8ff,
    scoreBonus: 800,
  }),
];

const MONTHLY_ENCOUNTER_BY_ID = new Map(
  MONTHLY_ENCOUNTER_CONFIG.map((entry) => [entry.id, entry] as const),
);
const MONTHLY_ENCOUNTER_BY_MONTH = new Map(
  MONTHLY_ENCOUNTER_CONFIG.map((entry) => [entry.month, entry] as const),
);

export function getMonthlyEncounterEntry(id: MonthlyEncounterId): MonthlyEncounterEncyclopediaEntry | undefined {
  return MONTHLY_ENCOUNTER_BY_ID.get(id);
}

export function getMonthlyEncounterForMonth(month: number): MonthlyEncounterEncyclopediaEntry | undefined {
  return MONTHLY_ENCOUNTER_BY_MONTH.get(month);
}
