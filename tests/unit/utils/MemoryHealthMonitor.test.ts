import { describe, expect, it } from 'vitest';
import { MemoryHealthMonitor } from '../../../src/game/utils/MemoryHealthMonitor';

describe('MemoryHealthMonitor', () => {
  it('samples only after the configured interval has elapsed', () => {
    let now = 0;
    const monitor = new MemoryHealthMonitor({
      sampleIntervalMs: 100,
      now: () => now,
    });

    const first = monitor.sample({ textureCount: 10, geometryCount: 5 });
    now = 50;
    const skipped = monitor.sample({ textureCount: 11, geometryCount: 5 });
    now = 120;
    const second = monitor.sample({ textureCount: 12, geometryCount: 5 });

    expect(first.sampled).toBe(true);
    expect(skipped.sampled).toBe(false);
    expect(skipped.latestSample?.webglResourceCount).toBe(15);
    expect(second.sampled).toBe(true);
    expect(second.latestSample?.webglResourceCount).toBe(17);
  });

  it('detects three consecutive 10% heap increases', () => {
    let now = 0;
    const monitor = new MemoryHealthMonitor({
      sampleIntervalMs: 1,
      now: () => now,
    });

    monitor.sample({ jsHeapUsedBytes: 100, jsHeapLimitBytes: 1000, textureCount: 10, geometryCount: 10 });
    now += 1;
    monitor.sample({ jsHeapUsedBytes: 111, jsHeapLimitBytes: 1000, textureCount: 10, geometryCount: 10 });
    now += 1;
    monitor.sample({ jsHeapUsedBytes: 124, jsHeapLimitBytes: 1000, textureCount: 10, geometryCount: 10 });
    now += 1;
    const report = monitor.sample({
      jsHeapUsedBytes: 140,
      jsHeapLimitBytes: 1000,
      textureCount: 10,
      geometryCount: 10,
    });

    expect(report.alert?.reason).toBe('js-heap-growth-trend');
  });

  it('falls back to WebGL resource trends when heap metrics are unavailable', () => {
    let now = 0;
    const monitor = new MemoryHealthMonitor({
      sampleIntervalMs: 1,
      now: () => now,
    });

    monitor.sample({ textureCount: 20, geometryCount: 10 });
    now += 1;
    monitor.sample({ textureCount: 22, geometryCount: 11 });
    now += 1;
    monitor.sample({ textureCount: 25, geometryCount: 12 });
    now += 1;
    const report = monitor.sample({ textureCount: 28, geometryCount: 13 });

    expect(report.alert?.reason).toBe('webgl-resource-growth-trend');
  });

  it('detects a high JS heap watermark immediately', () => {
    const monitor = new MemoryHealthMonitor({
      sampleIntervalMs: 0,
      jsHeapHighWatermarkRatio: 0.7,
      now: () => 0,
    });

    const report = monitor.sample({
      jsHeapUsedBytes: 750,
      jsHeapLimitBytes: 1000,
      textureCount: 5,
      geometryCount: 5,
    });

    expect(report.alert?.reason).toBe('js-heap-high-watermark');
    expect(report.latestSample?.jsHeapUsageRatio).toBeCloseTo(0.75, 5);
  });

  it('reset clears the active alert and sampling history', () => {
    let now = 0;
    const monitor = new MemoryHealthMonitor({
      sampleIntervalMs: 1,
      now: () => now,
    });

    monitor.sample({ textureCount: 20, geometryCount: 10 });
    now += 1;
    monitor.sample({ textureCount: 22, geometryCount: 11 });
    now += 1;
    monitor.sample({ textureCount: 25, geometryCount: 12 });
    now += 1;
    expect(monitor.sample({ textureCount: 28, geometryCount: 13 }).alert?.reason).toBe('webgl-resource-growth-trend');

    monitor.reset();
    now += 1;
    const report = monitor.sample({ textureCount: 12, geometryCount: 8 });

    expect(report.alert).toBeNull();
    expect(report.latestSample?.webglResourceCount).toBe(20);
  });
});
