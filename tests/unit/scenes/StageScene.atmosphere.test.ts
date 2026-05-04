// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function createScene(): StageScene {
  const inputState = { moveDirection: 0 as -1 | 0 | 1, boostPressed: false };
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {
    getState: () => inputState,
    setBoostPressed: (value: boolean) => {
      inputState.boostPressed = value;
    },
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
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [], muted: false, bestStageStars: {} })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;
  return new StageScene(sceneManager, inputSystem, audioManager, saveManager);
}

describe('StageScene atmosphere integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('enter() で現在ステージの雰囲気演出を初期化する', () => {
    const scene = createScene();
    scene.setVisualQualityTier(0);
    scene.enter({ stageNumber: 6, replayToken: 1, totalScore: 0, totalStarCount: 0 });

    const internal = scene as unknown as {
      stageAtmosphereEffect: {
        isActive(): boolean;
        getActiveConfig(): { stageNumber: number; particlePattern: string } | null;
        getParticleSystem(): { geometry: { drawRange: { count: number } } };
      };
    };

    expect(internal.stageAtmosphereEffect.isActive()).toBe(true);
    expect(internal.stageAtmosphereEffect.getActiveConfig()).toMatchObject({
      stageNumber: 6,
      particlePattern: 'ring',
    });
    expect(internal.stageAtmosphereEffect.getParticleSystem().geometry.drawRange.count).toBe(24);
  });
});
