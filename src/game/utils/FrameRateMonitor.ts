/**
 * Sliding-window frame rate monitor.
 *
 * Used by GameLoop to feed adaptive pixel-ratio scaling without adding any
 * external dependency. Extreme deltaTime spikes (e.g. tab restore) are
 * filtered out to avoid biasing the average.
 */
export class FrameRateMonitor {
  private readonly windowSize: number;
  private readonly buffer: Float64Array;
  private writeIndex = 0;
  private filled = 0;
  private sum = 0;
  private cyclesSinceRecompute = 0;

  constructor(windowSize = 60) {
    this.windowSize = Math.max(1, Math.floor(windowSize));
    this.buffer = new Float64Array(this.windowSize);
  }

  update(deltaTime: number): void {
    if (!Number.isFinite(deltaTime) || deltaTime <= 0 || deltaTime > 0.5) {
      return;
    }
    if (this.filled < this.windowSize) {
      this.buffer[this.writeIndex] = deltaTime;
      this.sum += deltaTime;
      this.filled += 1;
    } else {
      this.sum += deltaTime - this.buffer[this.writeIndex];
      this.buffer[this.writeIndex] = deltaTime;
    }
    this.writeIndex += 1;
    if (this.writeIndex >= this.windowSize) {
      this.writeIndex = 0;
      if (this.filled === this.windowSize) {
        this.cyclesSinceRecompute += 1;
        // Periodically recompute sum from the buffer to prevent floating-point
        // drift from accumulating during long play sessions.
        if (this.cyclesSinceRecompute >= 16) {
          this.recomputeSum();
          this.cyclesSinceRecompute = 0;
        }
      }
    }
  }

  getFps(): number {
    if (this.filled === 0 || this.sum <= 0) {
      return 60;
    }
    return this.filled / this.sum;
  }

  getSampleCount(): number {
    return this.filled;
  }

  reset(): void {
    this.buffer.fill(0);
    this.writeIndex = 0;
    this.filled = 0;
    this.sum = 0;
    this.cyclesSinceRecompute = 0;
  }

  private recomputeSum(): void {
    let s = 0;
    for (let i = 0; i < this.filled; i += 1) {
      s += this.buffer[i];
    }
    this.sum = s;
  }
}
