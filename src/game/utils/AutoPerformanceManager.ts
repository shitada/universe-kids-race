export interface AutoPerformanceManagerThresholds {
  lowFpsThreshold: number;
  highFpsThreshold: number;
  lowFpsSustainMs: number;
  highFpsSustainMs: number;
  tierChangeCooldownMs: number;
  downgradeLockMs: number;
  minSampleCount: number;
}

export interface AutoPerformanceChange {
  previousLevel: number;
  level: number;
  direction: 'degraded' | 'recovered';
}

export const DEFAULT_AUTO_PERFORMANCE_MANAGER_THRESHOLDS: AutoPerformanceManagerThresholds = {
  lowFpsThreshold: 45,
  highFpsThreshold: 57,
  lowFpsSustainMs: 1500,
  highFpsSustainMs: 5000,
  tierChangeCooldownMs: 2500,
  downgradeLockMs: 30000,
  minSampleCount: 60,
};

export class AutoPerformanceManager {
  private readonly maxLevel: number;
  private readonly onLevelChange: (change: AutoPerformanceChange) => void;
  private readonly thresholds: AutoPerformanceManagerThresholds;

  private currentLevel = 0;
  private elapsedMs = 0;
  private lowFpsSinceMs: number | null = null;
  private highFpsSinceMs: number | null = null;
  private lastLevelChangeAtMs = Number.NEGATIVE_INFINITY;
  private recoveryLockedUntilMs = 0;

  constructor(
    maxLevel: number,
    onLevelChange: (change: AutoPerformanceChange) => void,
    thresholds: Partial<AutoPerformanceManagerThresholds> = {},
  ) {
    this.maxLevel = Math.max(0, Math.floor(maxLevel));
    this.onLevelChange = onLevelChange;
    this.thresholds = {
      ...DEFAULT_AUTO_PERFORMANCE_MANAGER_THRESHOLDS,
      ...thresholds,
    };
  }

  sample(deltaTimeSeconds: number, fps: number, sampleCount: number): void {
    if (!Number.isFinite(deltaTimeSeconds) || deltaTimeSeconds <= 0) {
      return;
    }

    this.elapsedMs += deltaTimeSeconds * 1000;

    if (sampleCount < this.thresholds.minSampleCount || !Number.isFinite(fps) || fps <= 0) {
      this.resetStabilityTimers();
      return;
    }

    if (fps < this.thresholds.lowFpsThreshold) {
      this.highFpsSinceMs = null;
      if (this.lowFpsSinceMs === null) {
        this.lowFpsSinceMs = this.elapsedMs;
      }
      if (
        this.currentLevel < this.maxLevel &&
        this.elapsedMs - this.lowFpsSinceMs >= this.thresholds.lowFpsSustainMs &&
        this.canChangeTier()
      ) {
        this.changeLevel(this.currentLevel + 1, 'degraded');
        this.lowFpsSinceMs = null;
        this.recoveryLockedUntilMs = this.elapsedMs + this.thresholds.downgradeLockMs;
      }
      return;
    }

    if (fps >= this.thresholds.highFpsThreshold) {
      this.lowFpsSinceMs = null;
      if (this.currentLevel === 0 || this.elapsedMs < this.recoveryLockedUntilMs) {
        return;
      }
      if (this.highFpsSinceMs === null) {
        this.highFpsSinceMs = this.elapsedMs;
      }
      if (
        this.elapsedMs - this.highFpsSinceMs >= this.thresholds.highFpsSustainMs &&
        this.canChangeTier()
      ) {
        this.changeLevel(this.currentLevel - 1, 'recovered');
        this.highFpsSinceMs = null;
      }
      return;
    }

    this.resetStabilityTimers();
  }

  reset(keepLevel = false): void {
    if (!keepLevel) {
      this.currentLevel = 0;
      this.recoveryLockedUntilMs = 0;
      this.lastLevelChangeAtMs = Number.NEGATIVE_INFINITY;
    }
    this.elapsedMs = 0;
    this.resetStabilityTimers();
  }

  resetStabilityTimers(): void {
    this.lowFpsSinceMs = null;
    this.highFpsSinceMs = null;
  }

  getLevel(): number {
    return this.currentLevel;
  }

  private canChangeTier(): boolean {
    return this.elapsedMs - this.lastLevelChangeAtMs >= this.thresholds.tierChangeCooldownMs;
  }

  private changeLevel(level: number, direction: 'degraded' | 'recovered'): void {
    const nextLevel = Math.max(0, Math.min(this.maxLevel, Math.round(level)));
    if (nextLevel === this.currentLevel) {
      return;
    }

    const previousLevel = this.currentLevel;
    this.currentLevel = nextLevel;
    this.lastLevelChangeAtMs = this.elapsedMs;
    this.onLevelChange({
      previousLevel,
      level: nextLevel,
      direction,
    });
  }
}
