// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { TitleScene } from '../../../src/game/scenes/TitleScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import type { AudioManager } from '../../../src/game/audio/AudioManager';

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

function createMockAudioManager(initialized = false): AudioManager {
  let initState = initialized;
  return {
    init: vi.fn(),
    initSync: vi.fn(() => { initState = true; }),
    isInitialized: vi.fn(() => initState),
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    playSFX: vi.fn(),
    startBoostSFX: vi.fn(),
    stopBoostSFX: vi.fn(),
    ensureResumed: vi.fn(),
    dispose: vi.fn(),
  } as unknown as AudioManager;
}

function createMockSaveManager(): SaveManager {
  return {
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [] })),
    save: vi.fn(),
    clear: vi.fn(),
  } as unknown as SaveManager;
}

beforeEach(() => {
  const overlay = document.createElement('div');
  overlay.id = 'ui-overlay';
  document.body.appendChild(overlay);
  return () => {
    overlay.remove();
  };
});

describe('TitleScene (T009)', () => {
  it('overlay pointerdown calls initSync() and starts BGM_0 when not initialized', () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager(false);

    const scene = new TitleScene(sceneManager, saveManager, audioManager);
    scene.enter({});

    // enter() 直後は AudioContext 未初期化なので playBGM はまだ呼ばれない
    expect(audioManager.playBGM).not.toHaveBeenCalled();

    const uiOverlay = document.getElementById('ui-overlay')!;
    const titleOverlay = uiOverlay.firstElementChild as HTMLDivElement;
    expect(titleOverlay).toBeTruthy();

    const event = new Event('pointerdown', { bubbles: true });
    titleOverlay.dispatchEvent(event);

    expect(audioManager.initSync).toHaveBeenCalled();
    // 初回 pointerdown 後に BGM_0 が 1 回再生される
    expect(audioManager.playBGM).toHaveBeenCalledTimes(1);
    expect(audioManager.playBGM).toHaveBeenCalledWith(0);

    scene.exit();
  });

  it('enter() immediately starts BGM_0 when AudioManager already initialized', () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager(true);

    const scene = new TitleScene(sceneManager, saveManager, audioManager);
    scene.enter({});

    expect(audioManager.playBGM).toHaveBeenCalledTimes(1);
    expect(audioManager.playBGM).toHaveBeenCalledWith(0);

    scene.exit();
  });

  it('exit() calls stopBGM() exactly once', () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager(true);

    const scene = new TitleScene(sceneManager, saveManager, audioManager);
    scene.enter({});
    expect(audioManager.stopBGM).not.toHaveBeenCalled();

    scene.exit();
    expect(audioManager.stopBGM).toHaveBeenCalledTimes(1);
  });

  it('"あそぶ" button calls initSync() but does NOT call playBGM (avoids double-trigger)', () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    // 初期化済み状態にして enter() 直後の playBGM(0) を 1 回として記録
    const audioManager = createMockAudioManager(true);

    const scene = new TitleScene(sceneManager, saveManager, audioManager);
    scene.enter({});

    expect(audioManager.playBGM).toHaveBeenCalledTimes(1);

    const uiOverlay = document.getElementById('ui-overlay')!;
    const buttons = uiOverlay.querySelectorAll('button');
    const playButton = Array.from(buttons).find(b => b.textContent === 'あそぶ');
    expect(playButton).toBeTruthy();

    const event = new Event('pointerdown', { bubbles: true });
    playButton!.dispatchEvent(event);

    expect(audioManager.initSync).toHaveBeenCalled();
    // ボタン押下では追加 playBGM は呼ばれない（StageScene 側が呼ぶため）
    expect(audioManager.playBGM).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith(
      'stage',
      expect.objectContaining({ stageNumber: expect.any(Number) }),
    );

    scene.exit();
  });

  it('reuses the same THREE.Scene instance across enter/exit cycles', () => {
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager(),
      createMockAudioManager(),
    );

    scene.enter({});
    const firstScene = scene.getThreeScene();
    scene.exit();

    scene.enter({});
    const secondScene = scene.getThreeScene();

    expect(secondScene).toBe(firstScene);

    scene.exit();
  });

  it('does not duplicate AmbientLight on re-entry', () => {
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager(),
      createMockAudioManager(),
    );

    scene.enter({});
    scene.exit();
    scene.enter({});

    const threeScene = scene.getThreeScene();
    const ambientLights = threeScene.children.filter(
      (c) => c instanceof THREE.AmbientLight,
    ) as THREE.AmbientLight[];

    expect(ambientLights.length).toBe(1);

    scene.exit();
    scene.enter({});

    const ambientLights2 = scene
      .getThreeScene()
      .children.filter((c) => c instanceof THREE.AmbientLight) as THREE.AmbientLight[];
    expect(ambientLights2.length).toBe(1);
    expect(ambientLights2[0]).toBe(ambientLights[0]);

    scene.exit();
  });

  it('still contains the background star Points after re-entry', () => {
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager(),
      createMockAudioManager(),
    );

    scene.enter({});
    scene.exit();
    scene.enter({});

    const threeScene = scene.getThreeScene();
    const points = threeScene.children.filter((c) => c instanceof THREE.Points);
    expect(points.length).toBeGreaterThanOrEqual(1);

    scene.exit();
  });
});
