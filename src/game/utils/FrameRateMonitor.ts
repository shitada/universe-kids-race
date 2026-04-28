/**
 * Sliding-window frame rate monitor.
 *
 * Used by GameLoop to feed adaptive pixel-ratio scaling without adding any
 * external dependency. Extreme deltaTime spikes (e.g. tab restore) are
 * filtered out to avoid biasing the average.
 */
export class FrameRateMonitor {
  private readonly windowSize: number;
  private readonly samples: number[] = [];
  private sum = 0;

  constructor(windowSize = 60) {
    this.windowSize = Math.max(1, Math.floor(windowSize));
  }

  update(deltaTime: number): void {
    if (!Number.isFinite(deltaTime) || deltaTime <= 0 || deltaTime > 0.5) {
      return;
    }
    this.samples.push(deltaTime);
    this.sum += deltaTime;
    if (this.samples.length > this.windowSize) {
      const removed = this.samples.shift();
      if (removed !== undefined) {
        this.sum -= removed;
      }
    }
  }

  getFps(): number {
    if (this.samples.length === 0 || this.sum <= 0) {
      return 60;
    }
    return this.samples.length / this.sum;
  }

  getSampleCount(): number {
    return this.samples.length;
  }

  reset(): void {
    this.samples.length = 0;
    this.sum = 0;
  }
}
