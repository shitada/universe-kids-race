import type { SpaceWeatherEventConfig } from '../../types';

export const SPACE_WEATHER_EVENT_CONFIGS: readonly SpaceWeatherEventConfig[] = [
  {
    id: 'meteor-shower',
    title: 'りゅうせいあめ',
    message: 'りゅうせいあめだ！ ほし 2ばい！',
    accentColor: 0xaee8ff,
    duration: 6.5,
    starScoreMultiplier: 2,
  },
  {
    id: 'aurora-storm',
    title: 'オーロラあらし',
    message: 'オーロラあらしだ！ ほし 2ばい！',
    accentColor: 0x7fffd4,
    duration: 7,
    starScoreMultiplier: 2,
  },
  {
    id: 'comet-approach',
    title: 'すいせいせっきん',
    message: 'すいせい せっきん！ ほし 2ばい！',
    accentColor: 0xbdefff,
    duration: 6.8,
    starScoreMultiplier: 2,
  },
] as const;
