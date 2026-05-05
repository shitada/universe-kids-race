import { describe, expect, it } from 'vitest';
import {
  DEFAULT_MOTION_SENSITIVITY,
  getMotionSensitivityProfile,
  getMotionSensitivityVisualProfile,
  normalizeMotionSensitivity,
} from '../../../../src/game/accessibility/motionSensitivity';

describe('motionSensitivity helpers', () => {
  it('normalizes unknown values to the default sensitivity', () => {
    expect(normalizeMotionSensitivity('mystery')).toBe(DEFAULT_MOTION_SENSITIVITY);
    expect(normalizeMotionSensitivity(undefined)).toBe(DEFAULT_MOTION_SENSITIVITY);
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
