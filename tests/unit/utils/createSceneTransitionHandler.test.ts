import { describe, it, expect, vi } from 'vitest';
import { createSceneTransitionHandler } from '../../../src/game/utils/createSceneTransitionHandler';

function makeDeps(overrides: Partial<Parameters<typeof createSceneTransitionHandler>[0]> = {}) {
  const sceneManager = overrides.sceneManager ?? { transitionTo: vi.fn() };
  const pixelRatioController = overrides.pixelRatioController ?? { reset: vi.fn(), notifyResume: vi.fn() };
  const applyPixelRatioTier = overrides.applyPixelRatioTier ?? vi.fn();
  const now = overrides.now ?? vi.fn(() => 12345);
  const maxTier = overrides.maxTier ?? 2;
  return {
    sceneManager,
    pixelRatioController,
    applyPixelRatioTier,
    now,
    maxTier,
  };
}

describe('createSceneTransitionHandler', () => {
  it('does not persist clear progress when transitioning to a stage > 1', () => {
    const deps = makeDeps();
    const handler = createSceneTransitionHandler(deps);

    handler('stage', { stageNumber: 3 });

    expect(deps.sceneManager.transitionTo).toHaveBeenCalledWith('stage', { stageNumber: 3 });
    expect(deps.pixelRatioController.reset).not.toHaveBeenCalled();
    expect(deps.applyPixelRatioTier).not.toHaveBeenCalled();
    expect(deps.pixelRatioController.notifyResume).toHaveBeenCalledTimes(1);
    expect(deps.pixelRatioController.notifyResume).toHaveBeenCalledWith(12345);
  });

  it('does not record cleared stage when transitioning to stage 1', () => {
    const deps = makeDeps();
    const handler = createSceneTransitionHandler(deps);

    handler('stage', { stageNumber: 1 });

    expect(deps.sceneManager.transitionTo).toHaveBeenCalledWith('stage', { stageNumber: 1 });
    expect(deps.pixelRatioController.reset).not.toHaveBeenCalled();
    expect(deps.pixelRatioController.notifyResume).toHaveBeenCalledTimes(1);
    expect(deps.pixelRatioController.notifyResume).toHaveBeenCalledWith(12345);
  });

  it('does not persist clear progress when transitioning to ending', () => {
    const deps = makeDeps();
    const handler = createSceneTransitionHandler(deps);

    handler('ending');

    expect(deps.sceneManager.transitionTo).toHaveBeenCalledWith('ending', undefined);
    expect(deps.pixelRatioController.reset).not.toHaveBeenCalled();
    expect(deps.pixelRatioController.notifyResume).toHaveBeenCalledTimes(1);
    expect(deps.pixelRatioController.notifyResume).toHaveBeenCalledWith(12345);
  });

  it('resets pixel-ratio controller and re-applies max tier on title transition', () => {
    const deps = makeDeps({ maxTier: 2, now: vi.fn(() => 9999) });
    const handler = createSceneTransitionHandler(deps);

    handler('title');

    const order: string[] = [];
    // Re-create with order tracking to assert call order between mocks.
    const orderedDeps = makeDeps({ maxTier: 2, now: () => 9999 });
    orderedDeps.pixelRatioController.reset.mockImplementation(() => order.push('reset'));
    orderedDeps.applyPixelRatioTier.mockImplementation(() => order.push('apply'));
    orderedDeps.pixelRatioController.notifyResume.mockImplementation(() => order.push('resume'));
    const orderedHandler = createSceneTransitionHandler(orderedDeps);
    orderedHandler('title');

    expect(deps.pixelRatioController.reset).toHaveBeenCalledTimes(1);
    expect(deps.applyPixelRatioTier).toHaveBeenCalledWith(2);
    expect(deps.pixelRatioController.notifyResume).toHaveBeenCalledWith(9999);
    expect(deps.sceneManager.transitionTo).toHaveBeenCalledWith('title', undefined);

    // reset -> applyPixelRatioTier -> notifyResume in this order.
    expect(order).toEqual(['reset', 'apply', 'resume']);
  });

  it('does not double-call notifyResume on title transition', () => {
    const deps = makeDeps();
    const handler = createSceneTransitionHandler(deps);

    handler('title');

    expect(deps.pixelRatioController.notifyResume).toHaveBeenCalledTimes(1);
  });

  it('passes the value returned by now() to notifyResume on stage transitions', () => {
    const now = vi.fn(() => 54321);
    const deps = makeDeps({ now });
    const handler = createSceneTransitionHandler(deps);

    handler('stage', { stageNumber: 2 });

    expect(deps.pixelRatioController.notifyResume).toHaveBeenCalledWith(54321);
  });

  it('calls transitionTo after notifyResume on non-title transitions', () => {
    const order: string[] = [];
    const deps = makeDeps();
    deps.pixelRatioController.notifyResume.mockImplementation(() => order.push('resume'));
    (deps.sceneManager.transitionTo as ReturnType<typeof vi.fn>).mockImplementation(() =>
      order.push('transition'),
    );
    const handler = createSceneTransitionHandler(deps);

    handler('stage', { stageNumber: 2 });

    expect(order).toEqual(['resume', 'transition']);
  });
});
