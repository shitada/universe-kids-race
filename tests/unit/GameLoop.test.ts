import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameLoop } from '../../src/game/GameLoop';

describe('GameLoop', () => {
  let nowValue = 0;
  let rafCallback: FrameRequestCallback | null = null;
  let rafHandle = 0;

  beforeEach(() => {
    nowValue = 0;
    rafCallback = null;
    rafHandle = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => nowValue);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback): number => {
      rafCallback = cb;
      rafHandle += 1;
      return rafHandle;
    });
    vi.stubGlobal('cancelAnimationFrame', (_handle: number): void => {
      rafCallback = null;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  function advance(ms: number): void {
    nowValue += ms;
    const cb = rafCallback;
    rafCallback = null;
    cb?.(nowValue);
  }

  it('invokes update and render callbacks each frame', () => {
    const loop = new GameLoop();
    const onUpdate = vi.fn();
    const onRender = vi.fn();
    loop.start(onUpdate, onRender);
    // start() executes one synchronous frame, then schedules subsequent ones via rAF.
    expect(onUpdate).toHaveBeenCalledTimes(1);
    advance(16);
    advance(16);
    expect(onUpdate).toHaveBeenCalledTimes(3);
    expect(onRender).toHaveBeenCalledTimes(3);
    loop.stop();
  });

  it('reports fps samples through onFpsSample callback', () => {
    const loop = new GameLoop();
    const samples: number[] = [];
    loop.start(
      () => {},
      () => {},
      (fps) => samples.push(fps),
    );
    for (let i = 0; i < 10; i += 1) {
      advance(1000 / 60);
    }
    expect(samples.length).toBeGreaterThan(0);
    const last = samples[samples.length - 1];
    expect(last).toBeGreaterThanOrEqual(55);
    expect(last).toBeLessThanOrEqual(65);
    loop.stop();
  });

  it('exposes the current fps via getFps()', () => {
    const loop = new GameLoop();
    loop.start(
      () => {},
      () => {},
    );
    for (let i = 0; i < 10; i += 1) {
      advance(1000 / 60);
    }
    expect(loop.getFps()).toBeGreaterThanOrEqual(55);
    expect(loop.getFps()).toBeLessThanOrEqual(65);
    loop.stop();
  });

  it('resets fps tracking on pause and resume', () => {
    const loop = new GameLoop();
    loop.start(
      () => {},
      () => {},
    );
    for (let i = 0; i < 30; i += 1) {
      advance(1000 / 30); // 30 fps before pause
    }
    expect(loop.getFps()).toBeLessThan(40);

    loop.pause();
    // Long real-time gap while paused — should be discarded.
    nowValue += 5000;
    loop.resume();
    expect(loop.getFps()).toBe(60);

    for (let i = 0; i < 10; i += 1) {
      advance(1000 / 60); // 60 fps after resume
    }
    expect(loop.getFps()).toBeGreaterThanOrEqual(55);
    loop.stop();
  });

  it('throttles fps sample callback to ~10Hz', () => {
    const loop = new GameLoop();
    const samples: number[] = [];
    loop.start(
      () => {},
      () => {},
      (fps) => samples.push(fps),
    );
    for (let i = 0; i < 5; i += 1) {
      advance(16);
    }
    expect(samples.length).toBe(0);

    advance(16);
    expect(samples.length).toBe(0);

    advance(16);
    expect(samples.length).toBe(1);

    advance(16);
    advance(16);
    expect(samples.length).toBe(1);

    advance(70);
    expect(samples.length).toBe(2);

    loop.stop();
  });

  it('resets fps sampling interval on pause and resume', () => {
    const loop = new GameLoop();
    const samples: number[] = [];
    loop.start(
      () => {},
      () => {},
      (fps) => samples.push(fps),
    );
    for (let i = 0; i < 8; i += 1) {
      advance(16);
    }
    const samplesBeforePause = samples.length;
    expect(samplesBeforePause).toBeGreaterThanOrEqual(1);

    loop.pause();
    nowValue += 5000;
    loop.resume();

    advance(16);
    expect(samples.length).toBe(samplesBeforePause);

    for (let i = 0; i < 5; i += 1) {
      advance(16);
    }
    expect(samples.length).toBe(samplesBeforePause);
    advance(16);
    expect(samples.length).toBe(samplesBeforePause + 1);

    loop.stop();
  });

  it('start() is a no-op while already running', () => {
    const loop = new GameLoop();
    const onUpdate = vi.fn();
    const onRender = vi.fn();
    loop.start(onUpdate, onRender);
    expect(onUpdate).toHaveBeenCalledTimes(1);

    const onUpdate2 = vi.fn();
    const onRender2 = vi.fn();
    loop.start(onUpdate2, onRender2);
    // Second start should not run an extra synchronous frame nor swap callbacks.
    expect(onUpdate2).not.toHaveBeenCalled();
    expect(onRender2).not.toHaveBeenCalled();
    expect(onUpdate).toHaveBeenCalledTimes(1);

    advance(16);
    expect(onUpdate).toHaveBeenCalledTimes(2);
    expect(onUpdate2).not.toHaveBeenCalled();

    loop.stop();
  });

  it('resume() after stop() does not restart the loop', () => {
    const loop = new GameLoop();
    const onUpdate = vi.fn();
    const onRender = vi.fn();
    loop.start(onUpdate, onRender);
    advance(16);
    expect(onUpdate).toHaveBeenCalledTimes(2);

    loop.stop();
    expect(loop.isRunning()).toBe(false);

    loop.resume();
    expect(loop.isRunning()).toBe(false);
    expect(rafCallback).toBeNull();

    const callsBefore = onUpdate.mock.calls.length;
    advance(16);
    expect(onUpdate.mock.calls.length).toBe(callsBefore);
  });

  it('pause() called twice does not throw and resume() still works', () => {
    const loop = new GameLoop();
    const onUpdate = vi.fn();
    const onRender = vi.fn();
    loop.start(onUpdate, onRender);
    advance(16);

    expect(() => {
      loop.pause();
      loop.pause();
    }).not.toThrow();
    expect(loop.isRunning()).toBe(false);

    loop.resume();
    expect(loop.isRunning()).toBe(true);
    const callsBefore = onUpdate.mock.calls.length;
    advance(16);
    expect(onUpdate.mock.calls.length).toBe(callsBefore + 1);

    loop.stop();
  });

  it('pause() before start() is a no-op and resume() does not start', () => {
    const loop = new GameLoop();
    expect(() => loop.pause()).not.toThrow();
    expect(loop.isRunning()).toBe(false);

    loop.resume();
    expect(loop.isRunning()).toBe(false);
    expect(rafCallback).toBeNull();
  });
});
