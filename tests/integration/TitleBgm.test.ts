// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TitleScene } from '../../src/game/scenes/TitleScene';
import type { SceneManager } from '../../src/game/SceneManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import { EncyclopediaOverlay } from '../../src/ui/EncyclopediaOverlay';

/**
 * Integration test: タイトル→ステージ遷移時の BGM 切替順序検証 (bugfix: BGM_0 not playing).
 *
 * 期待シーケンス:
 *  1. TitleScene.enter() → (初期化済みなら) playBGM(0) 即時 / 未初期化なら overlay tap で playBGM(0)
 *  2. 「あそぶ」押下 → initSync() & sceneManager.requestTransition('stage', ...)（playBGM 重複なし）
 *  3. TitleScene.exit() → stopBGM() （冪等な明示停止）
 *  4. 続く StageScene.enter() 相当: playBGM(stageNumber) で BGM_n へ切替
 *
 * BGM_0 と BGM_n が同時に走らない（stopBGM が必ず playBGM(stageNumber) より前に呼ばれる）。
 */

interface AudioCall { kind: 'play' | 'stop'; arg?: number }

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

function createMockSaveManager(): SaveManager {
  return {
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [], tutorialShown: true })),
    save: vi.fn(),
    clear: vi.fn(),
    markTutorialShown: vi.fn(),
  } as unknown as SaveManager;
}

function createOnboardingSaveManager(): SaveManager {
  let tutorialShown = false;
  return {
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [2], tutorialShown })),
    save: vi.fn(),
    clear: vi.fn(),
    markTutorialShown: vi.fn(() => {
      tutorialShown = true;
    }),
  } as unknown as SaveManager;
}

function createUnlockedSaveManager(): SaveManager {
  return {
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [2], tutorialShown: true })),
    save: vi.fn(),
    clear: vi.fn(),
    markTutorialShown: vi.fn(),
  } as unknown as SaveManager;
}

function flushPromises(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

function dispatchReleaseConfirm(button: HTMLElement): void {
  button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  button.dispatchEvent(new Event('pointerup', { bubbles: true }));
}

function createTrackingAudioManager(initialized: boolean): {
  audioManager: AudioManager;
  calls: AudioCall[];
} {
  const calls: AudioCall[] = [];
  let initState = initialized;
  const audioManager = {
    init: vi.fn(),
    initSync: vi.fn(() => { initState = true; }),
    isInitialized: vi.fn(() => initState),
    playBGM: vi.fn((n: number) => { calls.push({ kind: 'play', arg: n }); }),
    stopBGM: vi.fn(() => { calls.push({ kind: 'stop' }); }),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    playSFX: vi.fn(),
    startBoostSFX: vi.fn(),
    stopBoostSFX: vi.fn(),
    ensureResumed: vi.fn(),
    dispose: vi.fn(),
  } as unknown as AudioManager;
  return { audioManager, calls };
}

beforeEach(() => {
  const overlay = document.createElement('div');
  overlay.id = 'ui-overlay';
  document.body.appendChild(overlay);
  return () => { overlay.remove(); };
});

describe('Title → Stage BGM transition (bugfix: BGM_0 plays during title)', () => {
  it('first launch: tap overlay → BGM_0 starts; "あそぶ" → exit stops, then stage BGM plays', () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const { audioManager, calls } = createTrackingAudioManager(false);

    const scene = new TitleScene(sceneManager, saveManager, audioManager);
    scene.enter({});

    // enter() 直後は未初期化なので BGM_0 はまだ
    expect(calls).toEqual([]);

    // 初回タップ: overlay に pointerdown
    const titleOverlay = document.getElementById('ui-overlay')!.firstElementChild as HTMLDivElement;
    titleOverlay.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    // BGM_0 が再生開始
    expect(calls).toEqual([{ kind: 'play', arg: 0 }]);

    // 「あそぶ」押下
    const playButton = Array.from(
      document.getElementById('ui-overlay')!.querySelectorAll('button'),
    ).find((b) => b.textContent === 'あそぶ')!;
    dispatchReleaseConfirm(playButton);

    expect(sceneManager.requestTransition).toHaveBeenCalledWith(
      'stage',
      expect.objectContaining({ stageNumber: 1, totalScore: 0, totalStarCount: 0 }),
    );
    // 「あそぶ」押下では playBGM は追加で呼ばれない（StageScene が呼ぶ）
    expect(calls).toEqual([{ kind: 'play', arg: 0 }]);

    // タイトルから抜ける
    scene.exit();
    // exit() は stopBGM() を 1 回呼ぶ
    expect(calls).toEqual([
      { kind: 'play', arg: 0 },
      { kind: 'stop' },
    ]);

    // 続いて StageScene.enter() 相当のステージ BGM 開始
    audioManager.playBGM(1);
    expect(calls).toEqual([
      { kind: 'play', arg: 0 },
      { kind: 'stop' },
      { kind: 'play', arg: 1 },
    ]);

    // 重要: BGM_0 と BGM_1 が同時走行しない（必ず stop が間に挟まる）
    const playIndices = calls
      .map((c, i) => ({ c, i }))
      .filter((x) => x.c.kind === 'play')
      .map((x) => x.i);
    expect(playIndices.length).toBe(2);
    const stopBetween = calls.slice(playIndices[0] + 1, playIndices[1])
      .some((c) => c.kind === 'stop');
    expect(stopBetween).toBe(true);
  });

  it('return-to-title (already initialized): enter() immediately plays BGM_0', () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const { audioManager, calls } = createTrackingAudioManager(true);

    const scene = new TitleScene(sceneManager, saveManager, audioManager);
    scene.enter({});

    expect(calls).toEqual([{ kind: 'play', arg: 0 }]);

    scene.exit();
    expect(calls).toEqual([
      { kind: 'play', arg: 0 },
      { kind: 'stop' },
    ]);
  });

  it('first launch: closing the tutorial starts BGM_0 exactly once', () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createOnboardingSaveManager();
    const { audioManager, calls } = createTrackingAudioManager(false);

    const scene = new TitleScene(sceneManager, saveManager, audioManager);
    scene.enter({});

    const closeButton = Array.from(document.querySelectorAll('button'))
      .find((button) => button.textContent === 'とじる') as HTMLButtonElement;
    closeButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(calls).toEqual([{ kind: 'play', arg: 0 }]);

    const titleOverlay = document.getElementById('ui-overlay')!.firstElementChild as HTMLDivElement;
    titleOverlay.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(calls).toEqual([{ kind: 'play', arg: 0 }]);

    scene.exit();
    expect(calls).toEqual([
      { kind: 'play', arg: 0 },
      { kind: 'stop' },
    ]);
  });

  it('first launch: "あそぶ" initializes audio without starting title BGM before stage BGM', () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const { audioManager, calls } = createTrackingAudioManager(false);
    const idleCallbacks: Array<() => void> = [];
    const loadTitleCompanionFactory = vi.fn(async () => ({
      createCompanionMesh: vi.fn(),
    }));

    const scene = new TitleScene(sceneManager, saveManager, audioManager, {
      scheduleIdleTask: (callback) => idleCallbacks.push(callback),
      loadTitleCompanionFactory,
    });
    scene.enter({});

    const playButton = Array.from(document.querySelectorAll('button'))
      .find((button) => button.textContent === 'あそぶ') as HTMLButtonElement;
    dispatchReleaseConfirm(playButton);

    expect(sceneManager.requestTransition).toHaveBeenCalledWith(
      'stage',
      expect.objectContaining({ stageNumber: 1, totalScore: 0, totalStarCount: 0 }),
    );
    expect(calls).toEqual([]);
    expect(loadTitleCompanionFactory).not.toHaveBeenCalled();

    scene.exit();
    idleCallbacks[0]?.();
    audioManager.playBGM(1);

    expect(calls).toEqual([
      { kind: 'stop' },
      { kind: 'play', arg: 1 },
    ]);
    expect(loadTitleCompanionFactory).not.toHaveBeenCalled();
  });

  it('stage selection from encyclopedia detail play does not add a duplicate title BGM start', async () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createUnlockedSaveManager();
    const { audioManager, calls } = createTrackingAudioManager(false);

    const scene = new TitleScene(sceneManager, saveManager, audioManager, {
      loadEncyclopediaOverlay: vi.fn(async () => ({ EncyclopediaOverlay })),
    });
    scene.enter({});

    const encyclopediaButton = Array.from(document.querySelectorAll('button'))
      .find((button) => button.textContent?.startsWith('ずかん')) as HTMLButtonElement;
    dispatchReleaseConfirm(encyclopediaButton);
    await flushPromises();
    await flushPromises();

    expect(calls).toEqual([{ kind: 'play', arg: 0 }]);

    const card = document.querySelector('[data-card][data-stage="2"]') as HTMLDivElement;
    card.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();
    expect(document.querySelector('[data-detail-play]')).toBeNull();

    card.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    const playButton = document.querySelector('[data-detail-play]') as HTMLButtonElement | null;
    expect(playButton).not.toBeNull();
    playButton?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

    expect(sceneManager.requestTransition).not.toHaveBeenCalled();

    playButton?.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

    expect(sceneManager.requestTransition).toHaveBeenCalledWith(
      'stage',
      expect.objectContaining({ stageNumber: 2 }),
    );
    expect(calls).toEqual([{ kind: 'play', arg: 0 }]);
  });
});
