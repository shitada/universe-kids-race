// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { __resetStageSceneSharedAssetCachesForTest } from '../../../src/game/scenes/stageVisualAssets';
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
    load: vi.fn(() => ({
      clearedStage: 0,
      unlockedPlanets: [],
      muted: false,
      bestStageStars: {},
    })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;

  return {
    scene: new StageScene(sceneManager, inputSystem, audioManager, saveManager, {
      scheduleIdleTask: () => {},
    }),
    inputState,
  };
}

function getBoostHint(): HTMLDivElement | null {
  return document.querySelector('[data-boost-hint]') as HTMLDivElement | null;
}

function getBoostButton(): HTMLButtonElement {
  return document.querySelector('#ui-overlay button[aria-label="ブースト"]') as HTMLButtonElement;
}

describe('StageScene boost hint', () => {
  let originalPathname = '/';
  let originalSearch = '';

  beforeEach(() => {
    originalPathname = window.location.pathname;
    originalSearch = window.location.search;
    window.history.replaceState({}, '', '/?nocount=1');
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
    __resetStageSceneSharedAssetCachesForTest();
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState({}, '', `${originalPathname}${originalSearch}`);
  });

  it('ready状態が続くとブーストヒントを短時間表示し、長時間未使用なら再表示する', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    const internal = scene as unknown as { update(dt: number): void };

    internal.update(3.4);
    expect(getBoostHint()?.style.display).toBe('none');

    internal.update(0.2);
    expect(getBoostHint()?.textContent).toBe('🚀 いまだよ！');
    expect(getBoostHint()?.style.display).toBe('block');
    expect(getBoostButton().hasAttribute('data-boost-hint-active')).toBe(true);

    internal.update(2.5);
    expect(getBoostHint()?.style.display).toBe('none');
    expect(getBoostButton().hasAttribute('data-boost-hint-active')).toBe(false);

    internal.update(9.4);
    expect(getBoostHint()?.style.display).toBe('none');

    internal.update(0.2);
    expect(getBoostHint()?.style.display).toBe('block');

    scene.exit();
  });

  it('ブースト使用やポーズでヒントを隠し、再び使えるまでは再表示しない', () => {
    const { scene, inputState } = createScene();
    scene.enter({ stageNumber: 1 });
    const internal = scene as unknown as { update(dt: number): void };

    internal.update(3.6);
    expect(getBoostHint()?.style.display).toBe('block');

    inputState.boostPressed = true;
    internal.update(0.016);
    expect(getBoostHint()?.style.display).toBe('none');
    expect(getBoostButton().getAttribute('aria-disabled')).toBe('true');

    internal.update(3.1);
    internal.update(4.8);
    expect(getBoostHint()?.style.display).toBe('none');

    internal.update(0.2);
    expect(getBoostHint()?.style.display).toBe('none');

    internal.update(3.6);
    expect(getBoostHint()?.style.display).toBe('block');

    const pauseButton = document.querySelector('#hud button[aria-label="やすむ"]') as HTMLButtonElement;
    pauseButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    pauseButton.dispatchEvent(new Event('pointerup', { bubbles: true }));
    expect(getBoostHint()?.style.display).toBe('none');
    expect(getBoostButton().getAttribute('aria-disabled')).toBe('true');

    scene.exit();
  });
});
