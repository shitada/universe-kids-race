import type { FrameDropStats } from '../utils/FrameRateMonitor';

export interface FrameRateAdaptationThresholds {
  fpsDownscaleThreshold: number;
  fpsUpscaleThreshold: number;
  downscaleSustainMs: number;
  upscaleSustainMs: number;
  tierChangeCooldownMs: number;
  resumeGraceMs: number;
  frameDropBurstCountThreshold: number;
  frameDropBurstStreakThreshold: number;
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
  frameDropBurstCountThreshold: 4,
  frameDropBurstStreakThreshold: 3,
};

export class FrameRateAdaptationSystem {
  private readonly maxLevel: number;
  private readonly onLevelChange: (change: FrameRateAdaptationChange) => void;
  private readonly thresholds: FrameRateAdaptationThresholds;

  private reactiveLevel = 0;
  private preventiveLevel = 0;
  private currentLevel = 0;
  private lowFpsSince: number | null = null;
  private highFpsSince: number | null = null;
  private lastReactiveLevelChangeAt = 0;
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

  sample(fps: number, now: number, frameDropStats?: Partial<FrameDropStats>): void {
    if (now < this.resumeGraceUntil) {
      this.lowFpsSince = null;
      this.highFpsSince = null;
      return;
    }
    if (now - this.lastReactiveLevelChangeAt < this.thresholds.tierChangeCooldownMs) {
      return;
    }

    if (this.reactiveLevel < this.maxLevel && this.hasDroppedFrameBurst(frameDropStats)) {
      this.lowFpsSince = null;
      this.highFpsSince = null;
      this.changeReactiveLevel(this.reactiveLevel + 1, now, 'degraded');
      return;
    }

    if (fps < this.thresholds.fpsDownscaleThreshold) {
      this.highFpsSince = null;
      if (this.lowFpsSince === null) {
        this.lowFpsSince = now;
      }
      if (
        now - this.lowFpsSince >= this.thresholds.downscaleSustainMs &&
        this.reactiveLevel < this.maxLevel
      ) {
        this.changeReactiveLevel(this.reactiveLevel + 1, now, 'degraded');
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
        this.reactiveLevel > 0
      ) {
        this.changeReactiveLevel(this.reactiveLevel - 1, now, 'recovered');
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

  setPreventiveLevel(level: number): void {
    this.preventiveLevel = this.clampLevel(level);
    this.syncCurrentLevel();
  }

  reset(): void {
    this.reactiveLevel = 0;
    this.preventiveLevel = 0;
    this.currentLevel = 0;
    this.lowFpsSince = null;
    this.highFpsSince = null;
    this.lastReactiveLevelChangeAt = 0;
    this.resumeGraceUntil = 0;
  }

  getCurrentLevel(): number {
    return this.currentLevel;
  }

  private changeReactiveLevel(level: number, now: number, direction: 'degraded' | 'recovered'): void {
    const clamped = this.clampLevel(level);
    if (clamped === this.reactiveLevel) {
      return;
    }
    this.reactiveLevel = clamped;
    this.lastReactiveLevelChangeAt = now;
    this.syncCurrentLevel(direction);
  }

  private syncCurrentLevel(preferredDirection?: 'degraded' | 'recovered'): void {
    const nextLevel = this.clampLevel(this.preventiveLevel + this.reactiveLevel);
    if (nextLevel === this.currentLevel) {
      return;
    }

    const previousLevel = this.currentLevel;
    this.currentLevel = nextLevel;
    this.onLevelChange({
      previousLevel,
      level: nextLevel,
      direction: preferredDirection ?? (nextLevel > previousLevel ? 'degraded' : 'recovered'),
    });
  }

  private clampLevel(level: number): number {
    return Math.max(0, Math.min(this.maxLevel, Math.floor(level)));
  }

  private hasDroppedFrameBurst(frameDropStats?: Partial<FrameDropStats>): boolean {
    const droppedFrameCount = Math.max(0, Math.floor(frameDropStats?.droppedFrameCount ?? 0));
    const droppedFrameStreak = Math.max(0, Math.floor(frameDropStats?.droppedFrameStreak ?? 0));
    return (
      droppedFrameCount >= this.thresholds.frameDropBurstCountThreshold ||
      droppedFrameStreak >= this.thresholds.frameDropBurstStreakThreshold
    );
  }
}
