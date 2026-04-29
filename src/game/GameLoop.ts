import { FrameRateMonitor } from './utils/FrameRateMonitor';

const FPS_SAMPLE_INTERVAL_MS = 100;

export class GameLoop {
  private running = false;
  private paused = false;
  private lastTime = 0;
  private lastFpsSampleAt = 0;
  private animationId = 0;
  private updateCallback: ((deltaTime: number) => void) | null = null;
  private renderCallback: (() => void) | null = null;
  private fpsSampleCallback: ((fps: number) => void) | null = null;
  private readonly monitor = new FrameRateMonitor();

  start(
    onUpdate: (deltaTime: number) => void,
    onRender: () => void,
    onFpsSample?: (fps: number) => void,
  ): void {
    if (this.running) return;
    this.updateCallback = onUpdate;
    this.renderCallback = onRender;
    this.fpsSampleCallback = onFpsSample ?? null;
    this.running = true;
    this.paused = false;
    this.monitor.reset();
    this.lastTime = performance.now();
    this.lastFpsSampleAt = this.lastTime;
    this.loop(this.lastTime);
  }

  stop(): void {
    this.running = false;
    this.paused = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
    this.updateCallback = null;
    this.renderCallback = null;
    this.fpsSampleCallback = null;
  }

  pause(): void {
    if (!this.running) return;
    this.running = false;
    this.paused = true;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
  }

  resume(): void {
    if (!this.paused) return;
    if (!this.updateCallback || !this.renderCallback) return;
    this.paused = false;
    this.running = true;
    this.monitor.reset();
    this.lastTime = performance.now();
    this.lastFpsSampleAt = this.lastTime;
    this.loop(this.lastTime);
  }

  isRunning(): boolean {
    return this.running;
  }

  getFps(): number {
    return this.monitor.getFps();
  }

  private loop = (now: number): void => {
    if (!this.running) return;
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.1); // cap at 100ms
    this.lastTime = now;

    this.updateCallback?.(deltaTime);
    this.renderCallback?.();

    this.monitor.update(deltaTime);
    if (this.fpsSampleCallback && now - this.lastFpsSampleAt >= FPS_SAMPLE_INTERVAL_MS) {
      this.fpsSampleCallback(this.monitor.getFps());
      this.lastFpsSampleAt = now;
    }

    this.animationId = requestAnimationFrame(this.loop);
  };
}
