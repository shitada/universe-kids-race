import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_MOTION_SENSITIVITY,
  REDUCED_MOTION_SENSITIVITY,
  getDefaultMotionSensitivity,
  getMotionSensitivityProfile,
  getMotionSensitivityVisualProfile,
  normalizeMotionSensitivity,
  prefersReducedMotion,
} from '../../../../src/game/accessibility/motionSensitivity';

describe('motionSensitivity helpers', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'matchMedia');
  });

  it('normalizes unknown values to the default sensitivity', () => {
    expect(normalizeMotionSensitivity('mystery')).toBe(DEFAULT_MOTION_SENSITIVITY);
    expect(normalizeMotionSensitivity(undefined)).toBe(DEFAULT_MOTION_SENSITIVITY);
  });

  it('uses the reduced-motion default when the browser asks for less motion', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));

    expect(prefersReducedMotion()).toBe(true);
    expect(getDefaultMotionSensitivity()).toBe(REDUCED_MOTION_SENSITIVITY);
    expect(normalizeMotionSensitivity(undefined)).toBe(REDUCED_MOTION_SENSITIVITY);
  });

  it('keeps explicit strong motion choices even when reduced motion is preferred', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));

    expect(normalizeMotionSensitivity('strong')).toBe('strong');
  });

  it('returns visual profiles for child-friendly motion choices', () => {
    expect(getMotionSensitivityVisualProfile('strong')).toMatchObject({
      emoji: '⚡',
      stars: '⭐⭐⭐⭐',
      shortLabel: 'とても はやい',
    });
    expect(getMotionSensitivityVisualProfile('minimal')).toMatchObject({
      emoji: '🐢',
      stars: '⭐',
      shortLabel: 'ゆっくり',
    });
  });

  it('keeps the gameplay motion scales unchanged', () => {
    expect(getMotionSensitivityProfile('medium').animationSpeedScale).toBe(0.88);
    expect(getMotionSensitivityProfile('minimal').cameraShakeScale).toBe(0.16);
  });
});
