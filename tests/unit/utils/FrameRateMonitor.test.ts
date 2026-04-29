import { describe, it, expect } from 'vitest';
import { FrameRateMonitor } from '../../../src/game/utils/FrameRateMonitor';

describe('FrameRateMonitor', () => {
  it('returns the default 60 fps before any sample is recorded', () => {
    const monitor = new FrameRateMonitor();
    expect(monitor.getFps()).toBe(60);
    expect(monitor.getSampleCount()).toBe(0);
  });

  it('computes the average fps from a constant deltaTime sequence', () => {
    const monitor = new FrameRateMonitor(60);
    const dt = 1 / 60;
    for (let i = 0; i < 30; i += 1) {
      monitor.update(dt);
    }
    expect(monitor.getFps()).toBeGreaterThanOrEqual(59);
    expect(monitor.getFps()).toBeLessThanOrEqual(61);
    expect(monitor.getSampleCount()).toBe(30);
  });

  it('limits the sliding window to the configured size', () => {
    const monitor = new FrameRateMonitor(10);
    for (let i = 0; i < 100; i += 1) {
      monitor.update(1 / 30);
    }
    expect(monitor.getSampleCount()).toBe(10);
    expect(monitor.getFps()).toBeGreaterThanOrEqual(29);
    expect(monitor.getFps()).toBeLessThanOrEqual(31);
  });

  it('reset clears the sample history', () => {
    const monitor = new FrameRateMonitor();
    for (let i = 0; i < 20; i += 1) {
      monitor.update(1 / 30);
    }
    monitor.reset();
    expect(monitor.getSampleCount()).toBe(0);
    expect(monitor.getFps()).toBe(60);
  });

  it('ignores extreme deltaTime values larger than 0.5s', () => {
    const monitor = new FrameRateMonitor(60);
    monitor.update(1 / 60);
    monitor.update(1 / 60);
    monitor.update(2.0); // tab resume spike — ignored
    monitor.update(1 / 60);
    expect(monitor.getSampleCount()).toBe(3);
    expect(monitor.getFps()).toBeGreaterThanOrEqual(59);
    expect(monitor.getFps()).toBeLessThanOrEqual(61);
  });

  it('ignores non-positive or non-finite deltaTime values', () => {
    const monitor = new FrameRateMonitor();
    monitor.update(0);
    monitor.update(-0.1);
    monitor.update(Number.NaN);
    monitor.update(Number.POSITIVE_INFINITY);
    expect(monitor.getSampleCount()).toBe(0);
    expect(monitor.getFps()).toBe(60);
  });

  it('reflects degraded fps when deltaTime grows', () => {
    const monitor = new FrameRateMonitor(30);
    for (let i = 0; i < 30; i += 1) {
      monitor.update(1 / 30);
    }
    expect(monitor.getFps()).toBeGreaterThanOrEqual(29);
    expect(monitor.getFps()).toBeLessThanOrEqual(31);
  });

  it('keeps only the last windowSize samples after long usage (ring buffer)', () => {
    const windowSize = 60;
    const monitor = new FrameRateMonitor(windowSize);
    // Fill with one value, then overwrite repeatedly with another.
    for (let i = 0; i < 200; i += 1) {
      monitor.update(1 / 30);
    }
    for (let i = 0; i < 600; i += 1) {
      monitor.update(1 / 120);
    }
    // The last windowSize samples are all 1/120, so fps ≈ 120.
    const expectedSum = windowSize * (1 / 120);
    expect(monitor.getSampleCount()).toBe(windowSize);
    expect(monitor.getFps()).toBeCloseTo(windowSize / expectedSum, 6);
  });

  it('caps getSampleCount at windowSize regardless of how many updates occur', () => {
    const monitor = new FrameRateMonitor(10);
    for (let i = 0; i < 1000; i += 1) {
      monitor.update(1 / 60);
    }
    expect(monitor.getSampleCount()).toBe(10);
  });

  it('reset returns the monitor to its initial state', () => {
    const monitor = new FrameRateMonitor(20);
    for (let i = 0; i < 500; i += 1) {
      monitor.update(1 / 60);
    }
    monitor.reset();
    expect(monitor.getFps()).toBe(60);
    expect(monitor.getSampleCount()).toBe(0);
    // After reset, new samples should accumulate cleanly from zero.
    monitor.update(1 / 30);
    expect(monitor.getSampleCount()).toBe(1);
    expect(monitor.getFps()).toBeCloseTo(30, 9);
  });
});
