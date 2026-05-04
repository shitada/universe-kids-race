// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import {
  __setSharedVibrationSystemForTest,
  VibrationSystem,
} from '../../../src/game/systems/VibrationSystem';

function mockCanvasContext(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
    return {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      fillRect: () => {},
      clearRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      lineTo: () => {},
      ellipse: () => {},
    } as unknown as CanvasRenderingContext2D;
  });
}

function createScene(inputState = { moveDirection: 0 as -1 | 0 | 1, boostPressed: false }) {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {
    getState: vi.fn(() => inputState),
    setBoostPressed: vi.fn((value: boolean) => {
      inputState.boostPressed = value;
    }),
  } as unknown as InputSystem;
  const audioManager = {
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    playSFX: vi.fn(),
    stopBoostSFX: vi.fn(),
    startBoostSFX: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    initFromInteraction: vi.fn(),
  } as unknown as AudioManager;
  const saveManager = {
    load: vi.fn(() => ({
      clearedStage: 0,
      unlockedPlanets: [],
      muted: false,
      tutorialShown: true,
      bestStageStars: {},
    })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;

  const scene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
  scene.enter({ stageNumber: 1 });

  const internal = scene as unknown as {
    countdownOverlay: { dispose(): void } | null;
    stageIntroOverlay: { dispose(): void } | null;
    awaitingResume: boolean;
    isHomeConfirmOpen: boolean;
    isPauseOpen: boolean;
    isStarting: boolean;
    onStageClear(): void;
    update(deltaTime: number): void;
  };
  internal.stageIntroOverlay?.dispose();
  internal.stageIntroOverlay = null;
  internal.countdownOverlay?.dispose();
  internal.countdownOverlay = null;
  internal.awaitingResume = false;
  internal.isHomeConfirmOpen = false;
  internal.isPauseOpen = false;
  internal.isStarting = false;

  return { scene, internal, inputState };
}

describe('StageScene vibration integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockCanvasContext();
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
    __setSharedVibrationSystemForTest(null);
  });

  afterEach(() => {
    __setSharedVibrationSystemForTest(null);
  });

  it('triggers the stage-clear vibration when the stage is cleared', () => {
    const vibrate = vi.fn(() => true);
    __setSharedVibrationSystemForTest(new VibrationSystem({ vibrate }, () => 0, 0));
    const { internal } = createScene();

    internal.onStageClear();

    expect(vibrate).toHaveBeenCalledWith([100, 50, 100, 50, 150]);
  });
});
