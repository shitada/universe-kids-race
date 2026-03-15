import { describe, it, expect } from 'vitest';
import { PLANET_ENCYCLOPEDIA } from '../../../src/game/config/PlanetEncyclopedia';

describe('PlanetEncyclopedia', () => {
  it('has exactly 11 entries', () => {
    expect(PLANET_ENCYCLOPEDIA).toHaveLength(11);
  });

  it('has unique stageNumbers 1 through 11', () => {
    const stageNumbers = PLANET_ENCYCLOPEDIA.map((e) => e.stageNumber);
    expect(stageNumbers.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it('each entry has a non-empty name', () => {
    for (const entry of PLANET_ENCYCLOPEDIA) {
      expect(entry.name.length).toBeGreaterThan(0);
    }
  });

  it('each entry has a non-empty emoji', () => {
    for (const entry of PLANET_ENCYCLOPEDIA) {
      expect(entry.emoji.length).toBeGreaterThan(0);
    }
  });

  it('each entry has trivia that is hiragana-based (no katakana-only)', () => {
    // Trivia should contain hiragana characters (may also contain kanji, numbers, punctuation)
    const hiraganaPattern = /[\u3040-\u309F]/;
    for (const entry of PLANET_ENCYCLOPEDIA) {
      expect(entry.trivia).toMatch(hiraganaPattern);
      expect(entry.trivia.length).toBeGreaterThan(0);
    }
  });

  it('each entry has a valid CompanionShape', () => {
    const validShapes = ['basic', 'ringed', 'radiant', 'horned', 'icy', 'bubble'];
    for (const entry of PLANET_ENCYCLOPEDIA) {
      expect(validShapes).toContain(entry.companionShape);
    }
  });

  it('each entry has a numeric planetColor', () => {
    for (const entry of PLANET_ENCYCLOPEDIA) {
      expect(typeof entry.planetColor).toBe('number');
    }
  });
});
