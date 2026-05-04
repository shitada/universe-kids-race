// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Group } from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import type { PlanetRingEffect } from '../../../src/game/effects/PlanetRingEffect';

interface StageSceneInternals {
  destinationPlanet: Group | null;
  planetRingEffect: PlanetRingEffect;
  countdownOverlay: { dispose(): void } | null;
  isStarting: boolean;
  onStageClear(): void;
  update(deltaTime: number): void;
}

function makeFakeCtx(): CanvasRenderingContext2D {
  const noop = (): void => {};
  return new Proxy(
    {} as Record<string, unknown>,
    {
      get(target, prop) {
        if (prop in target) return target[prop as string];
        return noop;
      },
      set(target, prop, value) {
        target[prop as string] = value;
        return true;
      },
    },
  ) as unknown as CanvasRenderingContext2D;
}

function createScene(): StageScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {
    getState: () => ({ moveDirection: 0, boostPressed: false }),
    setBoostPressed: vi.fn(),
    resetPointers: vi.fn(),
  } as unknown as InputSystem;
  const audioManager = {
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    playSFX: vi.fn(),
    startBoostSFX: vi.fn(),
    stopBoostSFX: vi.fn(),
    initFromInteraction: vi.fn(),
  } as unknown as AudioManager;
  const saveManager = {
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [], bestStageStars: {} })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;

  return new StageScene(sceneManager, inputSystem, audioManager, saveManager);
}

describe('StageScene planet ring effect', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => makeFakeCtx());
  });

  it('ステージクリア中の更新でリング演出が進行し、完了後に自動クリーンアップされる', () => {
    const scene = createScene();
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as StageSceneInternals;
    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;

    internal.onStageClear();
    expect(internal.planetRingEffect.isActive()).toBe(true);
    expect(internal.destinationPlanet?.children).toContain(internal.planetRingEffect.getGroup());

    internal.update(2);

    expect(internal.planetRingEffect.isActive()).toBe(false);
    expect(internal.destinationPlanet?.children).not.toContain(internal.planetRingEffect.getGroup());
  });
});
