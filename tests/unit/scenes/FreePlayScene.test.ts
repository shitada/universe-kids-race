// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { FreePlayScene } from '../../../src/game/scenes/FreePlayScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';

function createMockSceneManager(): SceneManager {
  return {
    requestTransition: vi.fn(),
    registerScene: vi.fn(),
    transitionTo: vi.fn(),
    update: vi.fn(),
    getCurrentThreeScene: vi.fn(),
    getCurrentCamera: vi.fn(),
    setTransitionHandler: vi.fn(),
  } as unknown as SceneManager;
}

function createMockInputSystem(direction: -1 | 0 | 1 = 0): InputSystem {
  return {
    getState: vi.fn(() => ({ moveDirection: direction, boostPressed: false })),
    resetPointers: vi.fn(),
  } as unknown as InputSystem;
}

function createMockAudioManager(): AudioManager {
  return {
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
  } as unknown as AudioManager;
}

function createMockSaveManager(unlockedPlanets: number[] = [1, 4, 7]): SaveManager {
  return {
    load: vi.fn(() => ({
      clearedStage: 0,
      unlockedPlanets,
      tutorialShown: true,
    })),
    save: vi.fn(),
    clear: vi.fn(),
  } as unknown as SaveManager;
}

function findButtonByText(text: string): HTMLButtonElement | undefined {
  return Array.from(document.querySelectorAll('button')).find(
    (button) => button.textContent === text,
  ) as HTMLButtonElement | undefined;
}

function dispatchReleaseConfirm(button: HTMLElement): void {
  button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  button.dispatchEvent(new Event('pointerup', { bubbles: true }));
}

beforeEach(() => {
  document.body.innerHTML = '<div id="ui-overlay"></div><div id="hud"></div>';
});

describe('FreePlayScene', () => {
  it('初期化時に集めたコンパニオン全員と UI を表示する', () => {
    const scene = new FreePlayScene(
      createMockSceneManager(),
      createMockInputSystem(),
      createMockAudioManager(),
      createMockSaveManager([1, 4, 4, 7]),
      { randomProvider: () => 0 },
    );

    scene.enter({});

    const badge = document.querySelector('[data-free-play-companion-count]');
    const companionGroup = scene.getThreeScene().getObjectByName('free-play-companions') as THREE.Group | null;

    expect(document.querySelector('[data-free-play-overlay]')).toBeTruthy();
    expect(badge?.textContent).toContain('3にん');
    expect(companionGroup?.children).toHaveLength(3);

    scene.exit();
  });

  it('一定時間ごとに背景ステージを切り替える', () => {
    const scene = new FreePlayScene(
      createMockSceneManager(),
      createMockInputSystem(),
      createMockAudioManager(),
      createMockSaveManager(),
      {
        randomProvider: () => 0,
        stageDurationSeconds: 0.5,
      },
    );

    scene.enter({});
    const firstLabel = document.querySelector('[data-free-play-stage-label]')?.textContent;

    scene.update(0.6);

    const nextLabel = document.querySelector('[data-free-play-stage-label]')?.textContent;
    expect(nextLabel).not.toBe(firstLabel);
    expect(scene.getThreeScene().getObjectByName('free-play-stage-planet')).toBeTruthy();

    scene.exit();
  });

  it('もどるボタンでタイトルへ戻る', () => {
    const sceneManager = createMockSceneManager();
    const audioManager = createMockAudioManager();
    const scene = new FreePlayScene(
      sceneManager,
      createMockInputSystem(),
      audioManager,
      createMockSaveManager(),
      { randomProvider: () => 0 },
    );

    scene.enter({});

    const backButton = findButtonByText('もどる');
    expect(backButton).toBeTruthy();
    dispatchReleaseConfirm(backButton!);

    expect(sceneManager.requestTransition).toHaveBeenCalledWith('title');
    scene.exit();
    expect(audioManager.stopBGM).toHaveBeenCalled();
  });
});
