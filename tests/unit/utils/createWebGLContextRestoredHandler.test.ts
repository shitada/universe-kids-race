import { describe, it, expect, vi } from 'vitest';
import { createWebGLContextRestoredHandler } from '../../../src/game/utils/createWebGLContextRestoredHandler';

function makeDeps(overrides: Partial<Parameters<typeof createWebGLContextRestoredHandler>[0]> = {}) {
  const pixelRatioController = overrides.pixelRatioController ?? {
    resetToTier: vi.fn(),
    notifyResume: vi.fn(),
  };
  const applyPixelRatioTier = overrides.applyPixelRatioTier ?? vi.fn();
  const getRestoreTier = overrides.getRestoreTier ?? vi.fn(() => 1);
  const syncVisualQualityTier = overrides.syncVisualQualityTier ?? vi.fn();
  const getViewportSize = overrides.getViewportSize ?? vi.fn(() => ({ width: 800, height: 600 }));
  const scheduleResize = overrides.scheduleResize ?? vi.fn();
  const flushResize = overrides.flushResize ?? vi.fn();
  const gameLoopResume = overrides.gameLoopResume ?? vi.fn();
  const audioEnsureResumed = overrides.audioEnsureResumed ?? vi.fn();
  const hideOverlay = overrides.hideOverlay ?? vi.fn();
  const onRecovered = overrides.onRecovered ?? vi.fn();
  const now = overrides.now ?? vi.fn(() => 4242);
  const maxTier = overrides.maxTier ?? 2;
  return {
    pixelRatioController,
    applyPixelRatioTier,
    maxTier,
    getRestoreTier,
    syncVisualQualityTier,
    getViewportSize,
    scheduleResize,
    flushResize,
    gameLoopResume,
    audioEnsureResumed,
    hideOverlay,
    onRecovered,
    now,
  };
}

describe('createWebGLContextRestoredHandler', () => {
  it('calls pixelRatioController.resetToTier() before applyPixelRatioTier(restoreTier) and before notifyResume()', () => {
    const deps = makeDeps();
    const handler = createWebGLContextRestoredHandler(deps);

    handler();

    const resetOrder = (deps.pixelRatioController.resetToTier as ReturnType<typeof vi.fn>).mock
      .invocationCallOrder[0];
    const applyOrder = (deps.applyPixelRatioTier as ReturnType<typeof vi.fn>).mock
      .invocationCallOrder[0];
    const notifyOrder = (deps.pixelRatioController.notifyResume as ReturnType<typeof vi.fn>).mock
      .invocationCallOrder[0];

    expect(resetOrder).toBeLessThan(applyOrder);
    expect(applyOrder).toBeLessThan(notifyOrder);
    expect(deps.pixelRatioController.resetToTier).toHaveBeenCalledWith(1);
    expect(deps.applyPixelRatioTier).toHaveBeenCalledWith(1);
  });

  it('passes now() return value to notifyResume', () => {
    const now = vi.fn(() => 99999);
    const deps = makeDeps({ now });
    const handler = createWebGLContextRestoredHandler(deps);

    handler();

    expect(deps.pixelRatioController.notifyResume).toHaveBeenCalledWith(99999);
  });

  it('invokes hideOverlay, gameLoopResume, audioEnsureResumed exactly once', () => {
    const deps = makeDeps();
    const handler = createWebGLContextRestoredHandler(deps);

    handler();

    expect(deps.hideOverlay).toHaveBeenCalledTimes(1);
    expect(deps.gameLoopResume).toHaveBeenCalledTimes(1);
    expect(deps.audioEnsureResumed).toHaveBeenCalledTimes(1);
    expect(deps.onRecovered).toHaveBeenCalledTimes(1);
  });

  it('hides the overlay before resetting/applying pixel ratio', () => {
    const deps = makeDeps();
    const handler = createWebGLContextRestoredHandler(deps);

    handler();

    const hideOrder = (deps.hideOverlay as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0];
    const resetOrder = (deps.pixelRatioController.resetToTier as ReturnType<typeof vi.fn>).mock
      .invocationCallOrder[0];
    expect(hideOrder).toBeLessThan(resetOrder);
  });

  it('syncs the visual quality tier with the restored stable tier', () => {
    const deps = makeDeps();
    const handler = createWebGLContextRestoredHandler(deps);

    handler();

    expect(deps.syncVisualQualityTier).toHaveBeenCalledWith(1);
  });

  it('schedules resize using getViewportSize() and flushes after scheduling', () => {
    const getViewportSize = vi.fn(() => ({ width: 1280, height: 720 }));
    const deps = makeDeps({ getViewportSize });
    const handler = createWebGLContextRestoredHandler(deps);

    handler();

    expect(getViewportSize).toHaveBeenCalledTimes(1);
    expect(deps.scheduleResize).toHaveBeenCalledWith(1280, 720);

    const scheduleOrder = (deps.scheduleResize as ReturnType<typeof vi.fn>).mock
      .invocationCallOrder[0];
    const flushOrder = (deps.flushResize as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0];
    expect(scheduleOrder).toBeLessThan(flushOrder);
  });

  it('runs the full sequence in the documented order', () => {
    const deps = makeDeps();
    const handler = createWebGLContextRestoredHandler(deps);

    handler();

    const orders = [
      (deps.hideOverlay as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0],
      (deps.pixelRatioController.resetToTier as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0],
      (deps.applyPixelRatioTier as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0],
      (deps.syncVisualQualityTier as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0],
      (deps.scheduleResize as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0],
      (deps.flushResize as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0],
      (deps.gameLoopResume as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0],
      (deps.audioEnsureResumed as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0],
      (deps.onRecovered as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0],
      (deps.pixelRatioController.notifyResume as ReturnType<typeof vi.fn>).mock
        .invocationCallOrder[0],
    ];
    const sorted = [...orders].sort((a, b) => a - b);
    expect(orders).toEqual(sorted);
  });

  it('falls back to maxTier when getRestoreTier() returns a non-finite value', () => {
    const deps = makeDeps({ getRestoreTier: vi.fn(() => Number.NaN) });
    const handler = createWebGLContextRestoredHandler(deps);

    handler();

    expect(deps.pixelRatioController.resetToTier).toHaveBeenCalledWith(deps.maxTier);
    expect(deps.applyPixelRatioTier).toHaveBeenCalledWith(deps.maxTier);
    expect(deps.syncVisualQualityTier).toHaveBeenCalledWith(deps.maxTier);
  });

  it('runs onRecovered before notifyResume so post-restore cleanup finishes first', () => {
    const deps = makeDeps();
    const handler = createWebGLContextRestoredHandler(deps);

    handler();

    const recoveredOrder = (deps.onRecovered as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0];
    const notifyOrder = (deps.pixelRatioController.notifyResume as ReturnType<typeof vi.fn>).mock
      .invocationCallOrder[0];
    expect(recoveredOrder).toBeLessThan(notifyOrder);
  });
});
