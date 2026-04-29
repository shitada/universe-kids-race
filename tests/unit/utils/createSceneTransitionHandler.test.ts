import { describe, it, expect, vi } from 'vitest';
import { createSceneTransitionHandler } from '../../../src/game/utils/createSceneTransitionHandler';
import type { SaveData } from '../../../src/types';

function makeSaveManager(initial: Partial<SaveData> = {}) {
  let data: SaveData = {
    clearedStage: 0,
    unlockedPlanets: [],
    muted: false,
    ...initial,
  };
  return {
    load: vi.fn(() => ({ ...data, unlockedPlanets: [...data.unlockedPlanets] })),
    save: vi.fn((next: SaveData) => {
      data = { ...next, unlockedPlanets: [...next.unlockedPlanets] };
    }),
    get current(): SaveData {
      return data;
    },
  };
}

function makeDeps(overrides: Partial<Parameters<typeof createSceneTransitionHandler>[0]> = {}) {
  const sceneManager = overrides.sceneManager ?? { transitionTo: vi.fn() };
  const saveManager = overrides.saveManager ?? makeSaveManager();
  const pixelRatioController = overrides.pixelRatioController ?? { reset: vi.fn(), notifyResume: vi.fn() };
  const applyPixelRatioTier = overrides.applyPixelRatioTier ?? vi.fn();
  const now = overrides.now ?? vi.fn(() => 12345);
  const maxTier = overrides.maxTier ?? 2;
  const totalStages = overrides.totalStages ?? 6;
  return {
    sceneManager,
    saveManager,
    pixelRatioController,
    applyPixelRatioTier,
    now,
    maxTier,
    totalStages,
  };
}

describe('createSceneTransitionHandler', () => {
  it('records cleared stage when transitioning to a stage > 1', () => {
    const deps = makeDeps();
    const handler = createSceneTransitionHandler(deps);

    handler('stage', { stageNumber: 3 });

    expect(deps.saveManager.save).toHaveBeenCalledTimes(1);
    expect(deps.saveManager.current.clearedStage).toBe(2);
    expect(deps.saveManager.current.unlockedPlanets).toContain(2);
    expect(deps.sceneManager.transitionTo).toHaveBeenCalledWith('stage', { stageNumber: 3 });
    expect(deps.pixelRatioController.reset).not.toHaveBeenCalled();
    expect(deps.applyPixelRatioTier).not.toHaveBeenCalled();
  });

  it('does not record cleared stage when transitioning to stage 1', () => {
    const deps = makeDeps();
    const handler = createSceneTransitionHandler(deps);

    handler('stage', { stageNumber: 1 });

    expect(deps.saveManager.save).not.toHaveBeenCalled();
    expect(deps.sceneManager.transitionTo).toHaveBeenCalledWith('stage', { stageNumber: 1 });
    expect(deps.pixelRatioController.reset).not.toHaveBeenCalled();
  });

  it('unlocks final stage when transitioning to ending', () => {
    const deps = makeDeps({ totalStages: 6 });
    const handler = createSceneTransitionHandler(deps);

    handler('ending');

    expect(deps.saveManager.current.clearedStage).toBe(6);
    expect(deps.saveManager.current.unlockedPlanets).toContain(6);
    expect(deps.sceneManager.transitionTo).toHaveBeenCalledWith('ending', undefined);
    expect(deps.pixelRatioController.reset).not.toHaveBeenCalled();
  });

  it('does not duplicate already-unlocked planets', () => {
    const sceneManager = { transitionTo: vi.fn() };
    const saveManager = makeSaveManager({ clearedStage: 5, unlockedPlanets: [2, 5] });
    const deps = makeDeps({ sceneManager, saveManager });
    const handler = createSceneTransitionHandler(deps);

    handler('stage', { stageNumber: 3 }); // would add 2

    expect(saveManager.current.unlockedPlanets).toEqual([2, 5]);
    expect(saveManager.current.clearedStage).toBe(5);
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
    expect(deps.saveManager.save).not.toHaveBeenCalled();

    // reset -> applyPixelRatioTier -> notifyResume in this order.
    expect(order).toEqual(['reset', 'apply', 'resume']);
  });

  it('does not modify save data on title transition', () => {
    const saveManager = makeSaveManager({ clearedStage: 4, unlockedPlanets: [1, 2, 3, 4] });
    const deps = makeDeps({ saveManager });
    const handler = createSceneTransitionHandler(deps);

    handler('title');

    expect(saveManager.save).not.toHaveBeenCalled();
    expect(saveManager.current.clearedStage).toBe(4);
  });
});
