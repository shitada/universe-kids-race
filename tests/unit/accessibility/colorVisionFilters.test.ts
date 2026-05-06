import { describe, expect, it } from 'vitest';
import {
  applyColorVisionFilter,
  getColorVisionFilterConfig,
  isColorVisionFilterMode,
} from '../../../src/game/accessibility/colorVisionFilters';

describe('colorVisionFilters', () => {
  it('recognizes only the dedicated filter modes', () => {
    expect(isColorVisionFilterMode('protanopia-filter')).toBe(true);
    expect(isColorVisionFilterMode('deuteranopia-filter')).toBe(true);
    expect(isColorVisionFilterMode('tritanopia-filter')).toBe(true);
    expect(isColorVisionFilterMode('color-and-marks')).toBe(false);
  });

  it('returns per-mode filter configs', () => {
    expect(getColorVisionFilterConfig('color-only')).toBeNull();
    expect(getColorVisionFilterConfig('protanopia-filter')).toMatchObject({
      saturation: expect.any(Number),
      contrast: expect.any(Number),
    });
  });

  it('transforms colors differently for each color-vision filter', () => {
    const color: [number, number, number] = [0.92, 0.24, 0.18];

    const protanopia = applyColorVisionFilter(color, 'protanopia-filter');
    const deuteranopia = applyColorVisionFilter(color, 'deuteranopia-filter');
    const tritanopia = applyColorVisionFilter(color, 'tritanopia-filter');

    expect(protanopia).not.toEqual(color);
    expect(deuteranopia).not.toEqual(color);
    expect(tritanopia).not.toEqual(color);
    expect(protanopia).not.toEqual(deuteranopia);
    expect(deuteranopia).not.toEqual(tritanopia);
    for (const filtered of [protanopia, deuteranopia, tritanopia]) {
      for (const channel of filtered) {
        expect(channel).toBeGreaterThanOrEqual(0);
        expect(channel).toBeLessThanOrEqual(1);
      }
    }
  });
});
