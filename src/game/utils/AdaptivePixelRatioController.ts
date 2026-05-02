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
    initialTier?: number,
  ) {
    this.maxTier = maxTier;
    this.onTierChange = onTierChange;
    this.thresholds = { ...DEFAULT_ADAPTIVE_PIXEL_RATIO_THRESHOLDS, ...thresholds };
    // Optional initialTier lets callers seed from persisted state (e.g.
    // SaveManager.lastStablePixelTier) so slower iPads do not always start at
    // MAX_TIER and incur an initial-frame downscale hitch (Constitution IV).
    // onTierChange is intentionally NOT fired here: the caller is expected to
    // apply the initial pixel ratio explicitly to avoid a redundant setSize.
    if (typeof initialTier === 'number' && Number.isFinite(initialTier)) {
      this.currentTier = this.clampTier(initialTier);
    } else {
      this.currentTier = maxTier;
    }
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
    this.resetToTier(this.maxTier);
  }

  resetToTier(tier: number): void {
    this.currentTier = this.clampTier(tier);
    this.lowFpsSince = null;
    this.highFpsSince = null;
    this.lastTierChangeAt = 0;
    this.resumeGraceUntil = 0;
  }

  private changeTier(newTier: number, now: number): void {
    const clamped = this.clampTier(newTier);
    this.currentTier = clamped;
    this.lastTierChangeAt = now;
    this.onTierChange(clamped);
  }

  private clampTier(tier: number): number {
    return Math.max(0, Math.min(this.maxTier, Math.floor(tier)));
  }
}
