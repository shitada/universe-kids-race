// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

interface CreatedScene {
  scene: StageScene;
  inputState: { moveDirection: -1 | 0 | 1; boostPressed: boolean };
}

function createScene(): CreatedScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputState: { moveDirection: -1 | 0 | 1; boostPressed: boolean } = {
    moveDirection: 0,
    boostPressed: false,
  };
  const inputSystem = {
    getState: () => inputState,
    setBoostPressed: (pressed: boolean) => {
      inputState.boostPressed = pressed;
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
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [], muted: false })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;

  return {
    scene: new StageScene(sceneManager, inputSystem, audioManager, saveManager),
    inputState,
  };
}

function finishStartCountdown(scene: StageScene): void {
  const internal = scene as unknown as { update(dt: number): void };
  for (let i = 0; i < 4; i++) {
    internal.update(1.0);
  }
}

describe('StageScene touch guide overlay', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('shows the touch guide in intro mode when the stage starts', () => {
    const { scene } = createScene();

    scene.enter({ stageNumber: 1 });

    const root = document.querySelector<HTMLElement>('[data-touch-guide-overlay]');
    expect(root).not.toBeNull();
    expect(root?.getAttribute('data-touch-guide-state')).toBe('intro');
  });

  it('hides the touch guide after the player moves left or right', () => {
    const { scene, inputState } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    inputState.moveDirection = -1;
    (scene as unknown as { update(dt: number): void }).update(0.016);

    const root = document.querySelector<HTMLElement>('[data-touch-guide-overlay]');
    expect(root?.getAttribute('data-touch-guide-state')).toBe('hidden');
  });

  it('shows the touch guide again in idle mode after 3 seconds without movement', () => {
    const { scene, inputState } = createScene();
    const internal = scene as unknown as { update(dt: number): void };
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    inputState.moveDirection = 1;
    internal.update(0.016);
    inputState.moveDirection = 0;
    internal.update(2.9);
    expect(document.querySelector('[data-touch-guide-overlay]')?.getAttribute('data-touch-guide-state')).toBe('hidden');

    internal.update(0.2);

    const root = document.querySelector<HTMLElement>('[data-touch-guide-overlay]');
    expect(root?.getAttribute('data-touch-guide-state')).toBe('idle');
    expect(root?.getAttribute('aria-hidden')).toBe('false');
  });

  it('prioritizes assist directions over the normal touch guide state machine', () => {
    const { scene, inputState } = createScene();
    const internal = scene as unknown as {
      assistElapsedTime: number;
      assistNavigationUntil: number;
      assistRecommendationMode: 'assist-left' | 'assist-right' | null;
      assistReevaluateTimer: number;
      update(dt: number): void;
    };
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    internal.assistElapsedTime = 1;
    internal.assistNavigationUntil = 10;
    internal.assistRecommendationMode = 'assist-right';
    internal.assistReevaluateTimer = 10;
    inputState.moveDirection = -1;
    internal.update(0.016);

    const root = document.querySelector<HTMLElement>('[data-touch-guide-overlay]');
    expect(root?.getAttribute('data-touch-guide-state')).toBe('assist-right');
  });

  it('removes the touch guide on exit()', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });

    scene.exit();

    expect(document.querySelector('[data-touch-guide-overlay]')).toBeNull();
  });
});
