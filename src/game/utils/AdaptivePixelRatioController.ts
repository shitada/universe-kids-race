/**
 * Adaptive pixel-ratio scaling heuristic (Constitution IV: maintain 60fps on iPad Safari).
 *
 * Tracks sustained low/high FPS samples and triggers tier changes via a callback,
 * with cooldown and resume-grace windows to avoid oscillation around scene transitions
 * or visibility changes.
 */
export interface AdaptivePixelRatioThresholds {
  fpsDownscaleThreshold: number;
  fpsUpscaleThreshold: number;
  downscaleSustainMs: number;
  upscaleSustainMs: number;
  tierChangeCooldownMs: number;
  resumeGraceMs: number;
}

export const DEFAULT_ADAPTIVE_PIXEL_RATIO_THRESHOLDS: AdaptivePixelRatioThresholds = {
  fpsDownscaleThreshold: 50,
  fpsUpscaleThreshold: 58,
  downscaleSustainMs: 1500,
  upscaleSustainMs: 3000,
  tierChangeCooldownMs: 2000,
  resumeGraceMs: 1000,
};

export class AdaptivePixelRatioController {
  private readonly maxTier: number;
  private readonly onTierChange: (newTier: number) => void;
  private readonly thresholds: AdaptivePixelRatioThresholds;

  private currentTier: number;
  private lowFpsSince: number | null = null;
  private highFpsSince: number | null = null;
  private lastTierChangeAt = 0;
  private resumeGraceUntil = 0;

  constructor(
    maxTier: number,
    onTierChange: (newTier: number) => void,
    thresholds: Partial<AdaptivePixelRatioThresholds> = {},
  ) {
    this.maxTier = maxTier;
    this.onTierChange = onTierChange;
    this.thresholds = { ...DEFAULT_ADAPTIVE_PIXEL_RATIO_THRESHOLDS, ...thresholds };
    this.currentTier = maxTier;
  }

  sample(fps: number, now: number): void {
    if (now < this.resumeGraceUntil) {
      this.lowFpsSince = null;
      this.highFpsSince = null;
      return;
    }
    if (now - this.lastTierChangeAt < this.thresholds.tierChangeCooldownMs) {
      return;
    }

    if (fps < this.thresholds.fpsDownscaleThreshold) {
      this.highFpsSince = null;
      if (this.lowFpsSince === null) this.lowFpsSince = now;
      if (
        now - this.lowFpsSince >= this.thresholds.downscaleSustainMs &&
        this.currentTier > 0
      ) {
        this.changeTier(this.currentTier - 1, now);
        this.lowFpsSince = null;
      }
    } else if (fps >= this.thresholds.fpsUpscaleThreshold) {
      this.lowFpsSince = null;
      if (this.highFpsSince === null) this.highFpsSince = now;
      if (
        now - this.highFpsSince >= this.thresholds.upscaleSustainMs &&
        this.currentTier < this.maxTier
      ) {
        this.changeTier(this.currentTier + 1, now);
        this.highFpsSince = null;
      }
    } else {
      this.lowFpsSince = null;
      this.highFpsSince = null;
    }
  }

  notifyResume(now: number): void {
    this.resumeGraceUntil = now + this.thresholds.resumeGraceMs;
    this.lowFpsSince = null;
    this.highFpsSince = null;
  }

  getCurrentTier(): number {
    return this.currentTier;
  }

  reset(): void {
    this.currentTier = this.maxTier;
    this.lowFpsSince = null;
    this.highFpsSince = null;
    this.lastTierChangeAt = 0;
    this.resumeGraceUntil = 0;
  }

  private changeTier(newTier: number, now: number): void {
    const clamped = Math.max(0, Math.min(this.maxTier, newTier));
    this.currentTier = clamped;
    this.lastTierChangeAt = now;
    this.onTierChange(clamped);
  }
}
