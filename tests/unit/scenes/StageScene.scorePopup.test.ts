// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { Star } from '../../../src/game/entities/Star';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function createScene(): StageScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputState = { moveDirection: 0, boostPressed: false };
  const inputSystem = {
    getState: () => inputState,
    setBoostPressed: (value: boolean) => {
      inputState.boostPressed = value;
    },
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
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [] })),
    save: vi.fn(),
    clear: vi.fn(),
  } as unknown as SaveManager;
  return new StageScene(sceneManager, inputSystem, audioManager, saveManager);
}

describe('StageScene score popup integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('shows popups for every collected star in the same update', () => {
    const scene = createScene();
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      stars: Star[];
      meteorites: [];
      threeScene: THREE.Scene;
      scorePopupManager: { show: ReturnType<typeof vi.fn> };
      scorePopupEffect: { emit: ReturnType<typeof vi.fn> };
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      update(deltaTime: number): void;
    };

    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;
    internal.scorePopupManager = { show: vi.fn(), dispose: vi.fn() };
    internal.scorePopupEffect = { emit: vi.fn(), update: vi.fn(), clear: vi.fn(), dispose: vi.fn() };

    const stars = [
      new Star(0, 0, 0, 'NORMAL'),
      new Star(0, 0, 0, 'RAINBOW'),
      new Star(0, 0, 0, 'NORMAL'),
      new Star(0, 0, 0, 'RAINBOW'),
    ];
    internal.stars = stars;
    internal.meteorites = [];
    for (const star of stars) {
      internal.threeScene.add(star.mesh);
    }

    internal.update(0.016);

    const showSpy = internal.scorePopupManager.show as ReturnType<typeof vi.fn>;
    const effectSpy = internal.scorePopupEffect.emit as ReturnType<typeof vi.fn>;

    expect(showSpy).toHaveBeenCalledTimes(stars.length);
    expect(effectSpy).toHaveBeenCalledTimes(stars.length);
    expect(showSpy.mock.calls.map(([score]) => score)).toEqual([
      100,
      500,
      100,
      500,
    ]);
    expect(effectSpy.mock.calls.map(([position, score]) => [score, position])).toEqual([
      [100, expect.objectContaining({ x: expect.any(Number), y: expect.any(Number), z: expect.any(Number) })],
      [500, expect.objectContaining({ x: expect.any(Number), y: expect.any(Number), z: expect.any(Number) })],
      [100, expect.objectContaining({ x: expect.any(Number), y: expect.any(Number), z: expect.any(Number) })],
      [500, expect.objectContaining({ x: expect.any(Number), y: expect.any(Number), z: expect.any(Number) })],
    ]);
    for (const [, position, cameraArg] of showSpy.mock.calls) {
      expect(position).toEqual({
        x: expect.any(Number),
        y: expect.any(Number),
        z: expect.any(Number),
      });
      expect(cameraArg).toBeInstanceOf(THREE.PerspectiveCamera);
    }
  });
});
