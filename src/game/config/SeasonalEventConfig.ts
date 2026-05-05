import type { SeasonalEventConfig } from '../../types';

export const SEASONAL_EVENT_CONFIGS: readonly SeasonalEventConfig[] = [
  {
    id: 'sakura',
    title: 'さくら まつり',
    emoji: '🌸',
    noticeMessage: 'さくらの はなびらが ひらひら！',
    accentColor: 0xffb7c5,
    startMonth: 4,
    startDay: 1,
    endMonth: 4,
    endDay: 14,
  },
  {
    id: 'tanabata',
    title: 'たなばた ほしまつり',
    emoji: '🎋',
    noticeMessage: 'ねがいごとの ほしが きらきら！',
    accentColor: 0x9ad8ff,
    startMonth: 7,
    startDay: 7,
    endMonth: 7,
    endDay: 7,
  },
  {
    id: 'christmas',
    title: 'クリスマス うちゅうパーティー',
    emoji: '🎄',
    noticeMessage: 'プレゼントみたいな ほしが ぴかーん！',
    accentColor: 0xff8fb8,
    startMonth: 12,
    startDay: 24,
    endMonth: 12,
    endDay: 25,
  },
  {
    id: 'new-year',
    title: 'おしょうがつ おいわい',
    emoji: '🌅',
    noticeMessage: 'あけまして おめでとう！ たいよう ぴかぴか！',
    accentColor: 0xffd36e,
    startMonth: 1,
    startDay: 1,
    endMonth: 1,
    endDay: 3,
  },
] as const;

function toMonthDay(month: number, day: number): number {
  return month * 100 + day;
}

function isDateInRange(date: Date, config: SeasonalEventConfig): boolean {
  const today = toMonthDay(date.getMonth() + 1, date.getDate());
  const start = toMonthDay(config.startMonth, config.startDay);
  const end = toMonthDay(config.endMonth, config.endDay);
  if (start <= end) {
    return today >= start && today <= end;
  }
  return today >= start || today <= end;
}

export function getSeasonalEventConfigForDate(date: Date): SeasonalEventConfig | null {
  return SEASONAL_EVENT_CONFIGS.find((config) => isDateInRange(date, config)) ?? null;
}
