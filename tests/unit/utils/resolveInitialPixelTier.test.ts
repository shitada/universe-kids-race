import { describe, it, expect } from 'vitest';
import { resolveInitialPixelTier } from '../../../src/game/utils/resolveInitialPixelTier';

const MAX_TIER = 2;

describe('resolveInitialPixelTier', () => {
  it('returns maxTier when no value is persisted (fresh install)', () => {
    expect(resolveInitialPixelTier(undefined, MAX_TIER)).toBe(MAX_TIER);
  });

  it('returns maxTier for non-number values', () => {
    expect(resolveInitialPixelTier(null, MAX_TIER)).toBe(MAX_TIER);
    expect(resolveInitialPixelTier('1', MAX_TIER)).toBe(MAX_TIER);
    expect(resolveInitialPixelTier({}, MAX_TIER)).toBe(MAX_TIER);
  });

  it('returns maxTier for non-finite numbers', () => {
    expect(resolveInitialPixelTier(NaN, MAX_TIER)).toBe(MAX_TIER);
    expect(resolveInitialPixelTier(Infinity, MAX_TIER)).toBe(MAX_TIER);
  });

  it('returns the persisted tier when within range', () => {
    expect(resolveInitialPixelTier(0, MAX_TIER)).toBe(0);
    expect(resolveInitialPixelTier(1, MAX_TIER)).toBe(1);
    expect(resolveInitialPixelTier(2, MAX_TIER)).toBe(2);
  });

  it('clamps values above maxTier', () => {
    expect(resolveInitialPixelTier(5, MAX_TIER)).toBe(MAX_TIER);
  });

  it('clamps negative values to 0', () => {
    expect(resolveInitialPixelTier(-1, MAX_TIER)).toBe(0);
  });

  it('floors fractional values', () => {
    expect(resolveInitialPixelTier(1.9, MAX_TIER)).toBe(1);
    expect(resolveInitialPixelTier(0.4, MAX_TIER)).toBe(0);
  });
});
