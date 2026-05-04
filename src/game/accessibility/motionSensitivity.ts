import type { MotionSensitivity } from '../../types';

export interface MotionSensitivityProfile {
  particleDensityScale: number;
  animationSpeedScale: number;
  effectSizeScale: number;
  cameraShakeScale: number;
  cameraFollowResponsiveness: number;
  boostLineLengthScale: number;
}

export interface MotionSensitivityVisualProfile {
  emoji: string;
  stars: string;
  shortLabel: string;
  description: string;
  previewDurationMs: number;
  previewScale: number;
  previewGlow: string;
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

const MOTION_SENSITIVITY_VISUAL_PROFILES: Record<MotionSensitivity, MotionSensitivityVisualProfile> = {
  strong: {
    emoji: '⚡',
    stars: '⭐⭐⭐⭐',
    shortLabel: 'とても はやい',
    description: 'にぎやかで げんきな うごきだよ。',
    previewDurationMs: 380,
    previewScale: 1.12,
    previewGlow: '0 0 18px rgba(255, 242, 122, 0.9)',
  },
  medium: {
    emoji: '🏃',
    stars: '⭐⭐⭐',
    shortLabel: 'はやい',
    description: 'げんきだけど すこし おだやかに うごくよ。',
    previewDurationMs: 520,
    previewScale: 1.08,
    previewGlow: '0 0 16px rgba(131, 214, 255, 0.82)',
  },
  gentle: {
    emoji: '🚶',
    stars: '⭐⭐',
    shortLabel: 'ふつう',
    description: 'やさしく ふわっと うごくよ。',
    previewDurationMs: 700,
    previewScale: 1.04,
    previewGlow: '0 0 14px rgba(122, 255, 204, 0.78)',
  },
  minimal: {
    emoji: '🐢',
    stars: '⭐',
    shortLabel: 'ゆっくり',
    description: 'ひつような ぶんだけ ゆっくり うごくよ。',
    previewDurationMs: 940,
    previewScale: 1,
    previewGlow: '0 0 12px rgba(196, 255, 160, 0.72)',
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

export function getMotionSensitivityVisualProfile(
  value: MotionSensitivity = DEFAULT_MOTION_SENSITIVITY,
): MotionSensitivityVisualProfile {
  return MOTION_SENSITIVITY_VISUAL_PROFILES[value];
}
