// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
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

describe('StageScene score gain HUD integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('forwards bonus score gains to the HUD animation and popup manager listener', () => {
    const scene = createScene();
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      hud: { animateScoreGain: ReturnType<typeof vi.fn> };
      scorePopupManager: { show: ReturnType<typeof vi.fn> };
      scorePopupEffect: { emit: ReturnType<typeof vi.fn> };
      scoreSystem: { addBonusScore(value: number, worldPosition: { x: number; y: number; z: number }): void };
    };

    internal.hud = { animateScoreGain: vi.fn() };
    internal.scorePopupManager = { show: vi.fn() };
    internal.scorePopupEffect = { emit: vi.fn() };

    const position = { x: 1, y: 2, z: 3 };
    internal.scoreSystem.addBonusScore(300, position);

    expect(internal.hud.animateScoreGain).toHaveBeenCalledWith(300, 300);
    expect(internal.scorePopupEffect.emit).toHaveBeenCalledWith(position, 300);
    expect(internal.scorePopupManager.show).toHaveBeenCalledWith(
      300,
      position,
      expect.any(THREE.PerspectiveCamera),
    );
  });
});
