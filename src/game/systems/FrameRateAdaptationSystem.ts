export interface FrameRateAdaptationThresholds {
  fpsDownscaleThreshold: number;
  fpsUpscaleThreshold: number;
  downscaleSustainMs: number;
  upscaleSustainMs: number;
  tierChangeCooldownMs: number;
  resumeGraceMs: number;
}

export interface FrameRateAdaptationChange {
  previousLevel: number;
  level: number;
  direction: 'degraded' | 'recovered';
}

export const DEFAULT_FRAME_RATE_ADAPTATION_THRESHOLDS: FrameRateAdaptationThresholds = {
  fpsDownscaleThreshold: 50,
  fpsUpscaleThreshold: 57,
  downscaleSustainMs: 1500,
  upscaleSustainMs: 4500,
  tierChangeCooldownMs: 2500,
  resumeGraceMs: 1200,
};

export class FrameRateAdaptationSystem {
  private readonly maxLevel: number;
  private readonly onLevelChange: (change: FrameRateAdaptationChange) => void;
  private readonly thresholds: FrameRateAdaptationThresholds;

  private currentLevel = 0;
  private lowFpsSince: number | null = null;
  private highFpsSince: number | null = null;
  private lastLevelChangeAt = 0;
  private resumeGraceUntil = 0;

  constructor(
    maxLevel: number,
    onLevelChange: (change: FrameRateAdaptationChange) => void,
    thresholds: Partial<FrameRateAdaptationThresholds> = {},
  ) {
    this.maxLevel = Math.max(0, Math.floor(maxLevel));
    this.onLevelChange = onLevelChange;
    this.thresholds = { ...DEFAULT_FRAME_RATE_ADAPTATION_THRESHOLDS, ...thresholds };
  }

  sample(fps: number, now: number): void {
    if (now < this.resumeGraceUntil) {
      this.lowFpsSince = null;
      this.highFpsSince = null;
      return;
    }
    if (now - this.lastLevelChangeAt < this.thresholds.tierChangeCooldownMs) {
      return;
    }

    if (fps < this.thresholds.fpsDownscaleThreshold) {
      this.highFpsSince = null;
      if (this.lowFpsSince === null) {
        this.lowFpsSince = now;
      }
      if (
        now - this.lowFpsSince >= this.thresholds.downscaleSustainMs &&
        this.currentLevel < this.maxLevel
      ) {
        this.changeLevel(this.currentLevel + 1, now, 'degraded');
        this.lowFpsSince = null;
      }
      return;
    }

    if (fps >= this.thresholds.fpsUpscaleThreshold) {
      this.lowFpsSince = null;
      if (this.highFpsSince === null) {
        this.highFpsSince = now;
      }
      if (
        now - this.highFpsSince >= this.thresholds.upscaleSustainMs &&
        this.currentLevel > 0
      ) {
        this.changeLevel(this.currentLevel - 1, now, 'recovered');
        this.highFpsSince = null;
      }
      return;
    }

    this.lowFpsSince = null;
    this.highFpsSince = null;
  }

  notifyResume(now: number): void {
    this.resumeGraceUntil = now + this.thresholds.resumeGraceMs;
    this.lowFpsSince = null;
    this.highFpsSince = null;
  }

  reset(): void {
    this.currentLevel = 0;
    this.lowFpsSince = null;
    this.highFpsSince = null;
    this.lastLevelChangeAt = 0;
    this.resumeGraceUntil = 0;
  }

  getCurrentLevel(): number {
    return this.currentLevel;
  }

  private changeLevel(level: number, now: number, direction: 'degraded' | 'recovered'): void {
    const clamped = Math.max(0, Math.min(this.maxLevel, Math.floor(level)));
    if (clamped === this.currentLevel) {
      return;
    }
    const previousLevel = this.currentLevel;
    this.currentLevel = clamped;
    this.lastLevelChangeAt = now;
    this.onLevelChange({ previousLevel, level: clamped, direction });
  }
}
