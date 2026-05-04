import type { MotionSensitivity } from '../../types';

export interface MotionSensitivityProfile {
  particleDensityScale: number;
  animationSpeedScale: number;
  effectSizeScale: number;
  cameraShakeScale: number;
  cameraFollowResponsiveness: number;
  boostLineLengthScale: number;
}

export const DEFAULT_MOTION_SENSITIVITY: MotionSensitivity = 'strong';

const MOTION_SENSITIVITY_PROFILES: Record<MotionSensitivity, MotionSensitivityProfile> = {
  strong: {
    particleDensityScale: 1,
    animationSpeedScale: 1,
    effectSizeScale: 1,
    cameraShakeScale: 1,
    cameraFollowResponsiveness: 1,
    boostLineLengthScale: 1,
  },
  medium: {
    particleDensityScale: 0.82,
    animationSpeedScale: 0.88,
    effectSizeScale: 0.88,
    cameraShakeScale: 0.72,
    cameraFollowResponsiveness: 0.32,
    boostLineLengthScale: 0.84,
  },
  gentle: {
    particleDensityScale: 0.58,
    animationSpeedScale: 0.7,
    effectSizeScale: 0.72,
    cameraShakeScale: 0.4,
    cameraFollowResponsiveness: 0.2,
    boostLineLengthScale: 0.66,
  },
  minimal: {
    particleDensityScale: 0.36,
    animationSpeedScale: 0.52,
    effectSizeScale: 0.56,
    cameraShakeScale: 0.16,
    cameraFollowResponsiveness: 0.1,
    boostLineLengthScale: 0.48,
  },
};

export function normalizeMotionSensitivity(value: unknown): MotionSensitivity {
  switch (value) {
    case 'medium':
    case 'gentle':
    case 'minimal':
      return value;
    default:
      return DEFAULT_MOTION_SENSITIVITY;
  }
}

export function getMotionSensitivityProfile(
  value: MotionSensitivity = DEFAULT_MOTION_SENSITIVITY,
): MotionSensitivityProfile {
  return MOTION_SENSITIVITY_PROFILES[value];
}
