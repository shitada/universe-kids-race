export interface MemoryHealthSnapshot {
  jsHeapUsedBytes?: number;
  jsHeapLimitBytes?: number;
  textureCount: number;
  geometryCount: number;
  visibleOverlayCount?: number;
}

export type MemoryHealthAlertReason =
  | 'js-heap-high-watermark'
  | 'js-heap-growth-trend'
  | 'webgl-resource-growth-trend';

export interface MemoryHealthSample extends MemoryHealthSnapshot {
  timestampMs: number;
  jsHeapUsageRatio: number | null;
  webglResourceCount: number;
}

export interface MemoryHealthAlert {
  reason: MemoryHealthAlertReason;
  sample: MemoryHealthSample;
}

export interface MemoryHealthReport {
  sampled: boolean;
  latestSample: MemoryHealthSample | null;
  alert: MemoryHealthAlert | null;
}

export interface MemoryHealthMonitorOptions {
  sampleIntervalMs?: number;
  growthRatioThreshold?: number;
  growthTrendCount?: number;
  jsHeapHighWatermarkRatio?: number;
  debugLogging?: boolean;
  logger?: Pick<Console, 'warn'>;
  now?: () => number;
}

const DEFAULT_SAMPLE_INTERVAL_MS = 5 * 60 * 1000;
const DEFAULT_GROWTH_RATIO_THRESHOLD = 0.1;
const DEFAULT_GROWTH_TREND_COUNT = 3;
const DEFAULT_JS_HEAP_HIGH_WATERMARK_RATIO = 0.75;

export class MemoryHealthMonitor {
  private readonly sampleIntervalMs: number;
  private readonly growthRatioThreshold: number;
  private readonly growthTrendCount: number;
  private readonly jsHeapHighWatermarkRatio: number;
  private readonly debugLogging: boolean;
  private readonly logger?: Pick<Console, 'warn'>;
  private readonly now: () => number;
  private readonly samples: MemoryHealthSample[] = [];
  private lastSampleAt = Number.NEGATIVE_INFINITY;
  private activeAlert: MemoryHealthAlert | null = null;

  constructor(options: MemoryHealthMonitorOptions = {}) {
    this.sampleIntervalMs = Math.max(0, options.sampleIntervalMs ?? DEFAULT_SAMPLE_INTERVAL_MS);
    this.growthRatioThreshold = Math.max(0, options.growthRatioThreshold ?? DEFAULT_GROWTH_RATIO_THRESHOLD);
    this.growthTrendCount = Math.max(1, Math.floor(options.growthTrendCount ?? DEFAULT_GROWTH_TREND_COUNT));
    this.jsHeapHighWatermarkRatio = Math.max(
      0,
      options.jsHeapHighWatermarkRatio ?? DEFAULT_JS_HEAP_HIGH_WATERMARK_RATIO,
    );
    this.debugLogging = options.debugLogging ?? false;
    this.logger = options.logger;
    this.now = options.now ?? (() => performance.now());
  }

  sample(snapshot: MemoryHealthSnapshot): MemoryHealthReport {
    const now = this.now();
    if (now - this.lastSampleAt < this.sampleIntervalMs) {
      return {
        sampled: false,
        latestSample: this.getLatestSample(),
        alert: this.activeAlert,
      };
    }

    this.lastSampleAt = now;
    const sample = this.normalizeSnapshot(snapshot, now);
    this.samples.push(sample);
    this.trimSamples();

    if (!this.activeAlert) {
      this.activeAlert = this.evaluateAlert(sample);
      if (this.activeAlert && this.debugLogging) {
        this.logger?.warn(
          `[MemoryHealthMonitor] ${this.activeAlert.reason} textures=${sample.textureCount} geometries=${sample.geometryCount} overlays=${sample.visibleOverlayCount ?? 0}`,
        );
      }
    }

    return {
      sampled: true,
      latestSample: sample,
      alert: this.activeAlert,
    };
  }

  reset(): void {
    this.samples.length = 0;
    this.lastSampleAt = Number.NEGATIVE_INFINITY;
    this.activeAlert = null;
  }

  getLatestSample(): MemoryHealthSample | null {
    return this.samples.length > 0 ? this.samples[this.samples.length - 1] : null;
  }

  private normalizeSnapshot(snapshot: MemoryHealthSnapshot, timestampMs: number): MemoryHealthSample {
    const jsHeapUsedBytes = this.asPositiveFinite(snapshot.jsHeapUsedBytes);
    const jsHeapLimitBytes = this.asPositiveFinite(snapshot.jsHeapLimitBytes);
    return {
      timestampMs,
      jsHeapUsedBytes,
      jsHeapLimitBytes,
      textureCount: Math.max(0, Math.floor(snapshot.textureCount)),
      geometryCount: Math.max(0, Math.floor(snapshot.geometryCount)),
      visibleOverlayCount:
        snapshot.visibleOverlayCount === undefined ? undefined : Math.max(0, Math.floor(snapshot.visibleOverlayCount)),
      jsHeapUsageRatio:
        jsHeapUsedBytes !== undefined && jsHeapLimitBytes !== undefined && jsHeapLimitBytes > 0
          ? jsHeapUsedBytes / jsHeapLimitBytes
          : null,
      webglResourceCount: Math.max(0, Math.floor(snapshot.textureCount)) + Math.max(0, Math.floor(snapshot.geometryCount)),
    };
  }

  private evaluateAlert(sample: MemoryHealthSample): MemoryHealthAlert | null {
    if (sample.jsHeapUsageRatio !== null && sample.jsHeapUsageRatio >= this.jsHeapHighWatermarkRatio) {
      return {
        reason: 'js-heap-high-watermark',
        sample,
      };
    }

    if (this.hasGrowthTrend((target) => target.jsHeapUsedBytes)) {
      return {
        reason: 'js-heap-growth-trend',
        sample,
      };
    }

    if (this.hasGrowthTrend((target) => target.webglResourceCount)) {
      return {
        reason: 'webgl-resource-growth-trend',
        sample,
      };
    }

    return null;
  }

  private hasGrowthTrend(selector: (sample: MemoryHealthSample) => number | undefined): boolean {
    const recentSamples = this.samples
      .map((sample) => ({ sample, value: selector(sample) }))
      .filter((entry): entry is { sample: MemoryHealthSample; value: number } => Number.isFinite(entry.value))
      .slice(-(this.growthTrendCount + 1));

    if (recentSamples.length < this.growthTrendCount + 1) {
      return false;
    }

    for (let index = 1; index < recentSamples.length; index += 1) {
      const previous = recentSamples[index - 1].value;
      const current = recentSamples[index].value;
      if (previous <= 0 || current < previous * (1 + this.growthRatioThreshold)) {
        return false;
      }
    }

    return true;
  }

  private trimSamples(): void {
    const maxSamples = Math.max(this.growthTrendCount + 1, 6);
    if (this.samples.length > maxSamples) {
      this.samples.splice(0, this.samples.length - maxSamples);
    }
  }

  private asPositiveFinite(value: number | undefined): number | undefined {
    return Number.isFinite(value) && value !== undefined && value >= 0 ? value : undefined;
  }
}
