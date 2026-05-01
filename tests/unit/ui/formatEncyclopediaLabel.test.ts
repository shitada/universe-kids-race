import { describe, it, expect } from 'vitest';
import { formatEncyclopediaLabel } from '../../../src/ui/formatEncyclopediaLabel';

describe('formatEncyclopediaLabel', () => {
  it('returns plain "ずかん" when unlocked is 0', () => {
    expect(formatEncyclopediaLabel(0, 11)).toBe('ずかん');
  });

  it('returns plain "ずかん" when unlocked is negative', () => {
    expect(formatEncyclopediaLabel(-1, 11)).toBe('ずかん');
  });

  it('formats progress when 0 < unlocked < total', () => {
    expect(formatEncyclopediaLabel(1, 11)).toBe('ずかん 1 / 11');
    expect(formatEncyclopediaLabel(3, 11)).toBe('ずかん 3 / 11');
    expect(formatEncyclopediaLabel(10, 11)).toBe('ずかん 10 / 11');
  });

  it('appends 🎉 when fully unlocked', () => {
    expect(formatEncyclopediaLabel(11, 11)).toBe('ずかん 11 / 11 🎉');
  });

  it('caps at total when unlocked exceeds total (defensive)', () => {
    expect(formatEncyclopediaLabel(12, 11)).toBe('ずかん 11 / 11 🎉');
    expect(formatEncyclopediaLabel(100, 11)).toBe('ずかん 11 / 11 🎉');
  });

  it('returns "ずかん" when total is non-positive (defensive)', () => {
    expect(formatEncyclopediaLabel(5, 0)).toBe('ずかん');
  });
});
