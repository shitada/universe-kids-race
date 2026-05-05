import { describe, expect, it } from 'vitest';
import {
  SPACE_GEM_CONFIG,
  SPACE_GEM_ENCYCLOPEDIA,
  pickSpaceGemType,
} from '../../../src/game/config/SpaceGemConfig';

describe('SpaceGemConfig', () => {
  it('defines seven cute space gems for the treasure box', () => {
    expect(SPACE_GEM_ENCYCLOPEDIA).toHaveLength(7);
    expect(SPACE_GEM_ENCYCLOPEDIA.map((entry) => entry.id)).toEqual([
      'diamond-nebula',
      'emerald-comet',
      'ruby-solar-wind',
      'sapphire-orbit',
      'amethyst-moon',
      'topaz-spark',
      'pearl-dust',
    ]);
  });

  it('gives every gem a score bonus and sparkle color', () => {
    for (const entry of SPACE_GEM_ENCYCLOPEDIA) {
      expect(SPACE_GEM_CONFIG[entry.id].scoreBonus).toBeGreaterThan(0);
      expect(SPACE_GEM_CONFIG[entry.id].visual.coreColor).toBeTypeOf('number');
    }
  });

  it('picks weighted gem ids from the configured thresholds', () => {
    expect(pickSpaceGemType(0.01)).toBe('diamond-nebula');
    expect(pickSpaceGemType(0.2)).toBe('emerald-comet');
    expect(pickSpaceGemType(0.38)).toBe('ruby-solar-wind');
    expect(pickSpaceGemType(0.54)).toBe('sapphire-orbit');
    expect(pickSpaceGemType(0.69)).toBe('amethyst-moon');
    expect(pickSpaceGemType(0.83)).toBe('topaz-spark');
    expect(pickSpaceGemType(0.98)).toBe('pearl-dust');
  });
});
