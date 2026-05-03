// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { TitleScene } from '../../../src/game/scenes/TitleScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import { TOTAL_STAGES } from '../../../src/game/config/StageConfig';
import { EncyclopediaOverlay } from '../../../src/ui/EncyclopediaOverlay';
import type { LoadFailureOverlayOptions } from '../../../src/ui/LoadFailureOverlay';

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

function createMockSaveManager(overrides: Record<string, unknown> = {}): SaveManager {
  const saveData = {
    clearedStage: 0,
    unlockedPlanets: [],
    tutorialShown: true,
    bestStageStars: {},
    muted: false,
    ...overrides,
  };
  return {
    load: vi.fn(() => ({ ...saveData, unlockedPlanets: [...(saveData.unlockedPlanets as number[])] })),
    save: vi.fn(),
    clear: vi.fn(),
    markTutorialShown: vi.fn(),
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

function flushPromises(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

function findButtonByText(text: string): HTMLButtonElement | undefined {
  return Array.from(document.querySelectorAll('button')).find(
    (button) => button.textContent === text,
  ) as HTMLButtonElement | undefined;
}

function findNextAdventureCard(): HTMLDivElement | null {
  return document.querySelector('[data-next-adventure-card]') as HTMLDivElement | null;
}

function findCompanionParade(scene: TitleScene): THREE.Group | undefined {
  return scene.getThreeScene().children.find(
    (child) => child instanceof THREE.Group && child.name === 'title-companion-parade',
  ) as THREE.Group | undefined;
}

function createIdleTaskHarness(): {
  idleCallbacks: Array<() => void>;
  scheduleIdleTask: (callback: () => void) => void;
} {
  const idleCallbacks: Array<() => void> = [];
  return {
    idleCallbacks,
    scheduleIdleTask: (callback) => idleCallbacks.push(callback),
  };
}

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

    expect(audioManager.initSync).not.toHaveBeenCalled();
    // ボタン押下では追加 playBGM は呼ばれない（StageScene 側が呼ぶため）
    expect(audioManager.playBGM).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith(
      'stage',
      expect.objectContaining({
        stageNumber: expect.any(Number),
        totalScore: 0,
        totalStarCount: 0,
      }),
    );

    scene.exit();
  });

  it('first "あそぶ" interaction initializes audio without starting title BGM', () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager(false);

    const scene = new TitleScene(sceneManager, saveManager, audioManager);
    scene.enter({});

    const playButton = findButtonByText('あそぶ');
    expect(playButton).toBeTruthy();

    playButton!.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(audioManager.initSync).toHaveBeenCalledTimes(1);
    expect(audioManager.playBGM).not.toHaveBeenCalled();
    expect(sceneManager.requestTransition).toHaveBeenCalledWith(
      'stage',
      expect.objectContaining({
        stageNumber: expect.any(Number),
        totalScore: 0,
        totalStarCount: 0,
      }),
    );

    scene.exit();
  });

  it('shows the first stage preview when every planet is unlocked but clearedStage is reset', () => {
    const sceneManager = createMockSceneManager();
    const scene = new TitleScene(
      sceneManager,
      createMockSaveManager({
        clearedStage: 0,
        unlockedPlanets: Array.from({ length: TOTAL_STAGES }, (_, index) => index + 1),
      }),
      createMockAudioManager(true),
    );

    scene.enter({});

    const card = findNextAdventureCard();
    const hint = document.querySelector('[data-play-button-hint]') as HTMLDivElement | null;
    expect(card?.getAttribute('data-next-stage-number')).toBe('1');
    expect(card?.getAttribute('data-next-stage-destination')).toBe('月');
    expect(card?.textContent).toContain('ぜんぶ クリア！');
    expect(card?.textContent).toContain('🌙');
    expect(hint?.textContent).toContain('ステージ 1');
    expect(hint?.textContent).toContain('さいしょから');

    findButtonByText('あそぶ')?.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(sceneManager.requestTransition).toHaveBeenCalledWith(
      'stage',
      expect.objectContaining({
        stageNumber: 1,
        totalScore: 0,
        totalStarCount: 0,
      }),
    );

    scene.exit();
  });

  it('keeps the next-stage preview for in-progress saves', () => {
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager({
        clearedStage: 3,
        unlockedPlanets: [1, 2, 3],
      }),
      createMockAudioManager(true),
    );

    scene.enter({});

    const card = findNextAdventureCard();
    const hint = document.querySelector('[data-play-button-hint]') as HTMLDivElement | null;
    expect(card?.getAttribute('data-next-stage-number')).toBe('4');
    expect(card?.getAttribute('data-next-stage-destination')).toBe('火星');
    expect(card?.textContent).toContain('つづきから しゅっぱつ！');
    expect(hint?.textContent).toContain('ステージ 4');
    expect(hint?.textContent).not.toContain('さいしょから');

    scene.exit();
  });

  it('shows the first-start preview for a brand-new save', () => {
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager({
        clearedStage: 0,
        unlockedPlanets: [],
      }),
      createMockAudioManager(true),
    );

    scene.enter({});

    const card = findNextAdventureCard();
    const hint = document.querySelector('[data-play-button-hint]') as HTMLDivElement | null;
    expect(card?.getAttribute('data-next-stage-number')).toBe('1');
    expect(card?.getAttribute('data-next-stage-destination')).toBe('月');
    expect(card?.textContent).toContain('はじめての しゅっぱつ！');
    expect(hint?.textContent).toContain('ステージ 1');
    expect(hint?.textContent).not.toContain('さいしょから');

    scene.exit();
  });

  it('first "あそびかた" interaction initializes audio and starts BGM_0 once', () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager(false);

    const scene = new TitleScene(sceneManager, saveManager, audioManager);
    scene.enter({});

    const tutorialButton = findButtonByText('あそびかた');
    expect(tutorialButton).toBeTruthy();

    tutorialButton!.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(audioManager.initSync).toHaveBeenCalledTimes(1);
    expect(audioManager.playBGM).toHaveBeenCalledTimes(1);
    expect(audioManager.playBGM).toHaveBeenCalledWith(0);
    expect(document.querySelector('[data-tutorial-overlay]')).toBeTruthy();

    findButtonByText('とじる')?.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    const titleOverlay = document.getElementById('ui-overlay')!.firstElementChild as HTMLDivElement;
    titleOverlay.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(audioManager.playBGM).toHaveBeenCalledTimes(1);

    scene.exit();
  });

  it('first encyclopedia interaction initializes audio and starts BGM_0 once', async () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager(false);

    const scene = new TitleScene(sceneManager, saveManager, audioManager, {
      loadEncyclopediaOverlay: vi.fn(async () => ({ EncyclopediaOverlay })),
    });
    scene.enter({});

    const encyclopediaButton = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent?.startsWith('ずかん'),
    ) as HTMLButtonElement | undefined;
    expect(encyclopediaButton).toBeTruthy();

    encyclopediaButton!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();
    await flushPromises();

    expect(audioManager.initSync).toHaveBeenCalledTimes(1);
    expect(audioManager.playBGM).toHaveBeenCalledTimes(1);
    expect(audioManager.playBGM).toHaveBeenCalledWith(0);
    expect(document.querySelector('[data-card]')).toBeTruthy();

    scene.exit();
  });

  it('shows retry UI and re-runs encyclopedia loading after a lazy-load failure', async () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager(true);
    const loadingOverlay = {
      show: vi.fn(),
      hide: vi.fn(),
    };
    let failureOptions: LoadFailureOverlayOptions | null = null;
    const loadFailureOverlay = {
      show: vi.fn((options: LoadFailureOverlayOptions) => {
        failureOptions = options;
      }),
      hide: vi.fn(),
    };
    const loadEncyclopediaOverlay = vi
      .fn<() => Promise<{ EncyclopediaOverlay: typeof EncyclopediaOverlay }>>()
      .mockRejectedValueOnce(new Error('chunk load failed'))
      .mockResolvedValueOnce({ EncyclopediaOverlay });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const scene = new TitleScene(sceneManager, saveManager, audioManager, {
      loadingOverlay,
      loadFailureOverlay,
      loadEncyclopediaOverlay,
    });
    scene.enter({});

    const encyclopediaButton = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent?.startsWith('ずかん'),
    ) as HTMLButtonElement | undefined;
    expect(encyclopediaButton).toBeTruthy();

    encyclopediaButton!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();
    await flushPromises();

    expect(loadingOverlay.show).toHaveBeenCalledWith('ずかんを よんでるよ...');
    expect(loadingOverlay.hide).toHaveBeenCalledTimes(1);
    expect(loadFailureOverlay.show).toHaveBeenCalledTimes(1);
    expect(failureOptions?.primaryAction.label).toBe('もういちど よむ');

    await failureOptions?.primaryAction.onSelect();
    await flushPromises();
    await flushPromises();

    expect(loadFailureOverlay.hide).toHaveBeenCalled();
    expect(loadEncyclopediaOverlay).toHaveBeenCalledTimes(2);
    expect(document.querySelector('[data-card]')).toBeTruthy();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load encyclopedia overlay', expect.any(Error));

    consoleErrorSpy.mockRestore();
    scene.exit();
  });

  it('starts encyclopedia prefetch only after idle and ignores stale callbacks across re-entry', async () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager(true);
    const idleCallbacks: Array<() => void> = [];
    const loadEncyclopediaOverlay = vi.fn(async () => ({ EncyclopediaOverlay }));

    const scene = new TitleScene(sceneManager, saveManager, audioManager, {
      loadEncyclopediaOverlay,
      scheduleIdleTask: (callback) => idleCallbacks.push(callback),
    });

    scene.enter({});
    expect(loadEncyclopediaOverlay).not.toHaveBeenCalled();
    expect(idleCallbacks).toHaveLength(1);
    const firstIdleCallback = idleCallbacks[0];

    scene.exit();
    scene.enter({});
    expect(idleCallbacks).toHaveLength(2);
    const secondIdleCallback = idleCallbacks[1];

    firstIdleCallback();
    await flushPromises();
    expect(loadEncyclopediaOverlay).not.toHaveBeenCalled();

    secondIdleCallback();
    secondIdleCallback();
    await flushPromises();
    await flushPromises();

    expect(loadEncyclopediaOverlay).toHaveBeenCalledTimes(1);

    scene.exit();
  });

  it('swallows encyclopedia prefetch failures and still opens on demand later', async () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager(true);
    const idleCallbacks: Array<() => void> = [];
    const loadingOverlay = {
      show: vi.fn(),
      hide: vi.fn(),
    };
    const loadFailureOverlay = {
      show: vi.fn(),
      hide: vi.fn(),
    };
    const loadEncyclopediaOverlay = vi
      .fn<() => Promise<{ EncyclopediaOverlay: typeof EncyclopediaOverlay }>>()
      .mockRejectedValueOnce(new Error('prefetch failed'))
      .mockResolvedValueOnce({ EncyclopediaOverlay });

    const scene = new TitleScene(sceneManager, saveManager, audioManager, {
      loadingOverlay,
      loadFailureOverlay,
      loadEncyclopediaOverlay,
      scheduleIdleTask: (callback) => idleCallbacks.push(callback),
    });

    scene.enter({});
    idleCallbacks[0]?.();
    await flushPromises();
    await flushPromises();

    expect(loadEncyclopediaOverlay).toHaveBeenCalledTimes(1);
    expect(loadFailureOverlay.show).not.toHaveBeenCalled();

    const encyclopediaButton = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent?.startsWith('ずかん'),
    ) as HTMLButtonElement | undefined;
    expect(encyclopediaButton).toBeTruthy();

    encyclopediaButton!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();
    await flushPromises();

    expect(loadEncyclopediaOverlay).toHaveBeenCalledTimes(2);
    expect(loadingOverlay.show).toHaveBeenCalledWith('ずかんを よんでるよ...');
    expect(loadFailureOverlay.show).not.toHaveBeenCalled();
    expect(document.querySelector('[data-card]')).toBeTruthy();

    scene.exit();
  });

  it('first mute interaction initializes audio and starts BGM_0 once', () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager(false);

    const scene = new TitleScene(sceneManager, saveManager, audioManager);
    scene.enter({});

    const muteButton = document.querySelector('button[data-mute-button]') as HTMLButtonElement | null;
    expect(muteButton).toBeTruthy();

    muteButton!.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(audioManager.initSync).toHaveBeenCalledTimes(1);
    expect(audioManager.playBGM).toHaveBeenCalledTimes(1);
    expect(audioManager.playBGM).toHaveBeenCalledWith(0);
    expect(audioManager.toggleMute).toHaveBeenCalledTimes(1);

    scene.exit();
  });

  it('positions title bottom buttons with overlay-local spacing only', () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager(true);

    const scene = new TitleScene(sceneManager, saveManager, audioManager);
    scene.enter({});

    const tutorialButton = findButtonByText('あそびかた');
    const encyclopediaButton = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent?.startsWith('ずかん'),
    ) as HTMLButtonElement | undefined;

    expect(tutorialButton?.getAttribute('style')).toContain('bottom: 2rem;');
    expect(tutorialButton?.getAttribute('style')).toContain('right: 2rem;');
    expect(encyclopediaButton?.getAttribute('style')).toContain('bottom: 2rem;');
    expect(encyclopediaButton?.getAttribute('style')).toContain('left: 2rem;');

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

  it('does not load companion factory when no planets are unlocked', async () => {
    const { idleCallbacks, scheduleIdleTask } = createIdleTaskHarness();
    const loadTitleCompanionFactory = vi.fn(async () => ({
      createCompanionMesh: vi.fn(() => new THREE.Group()),
    }));
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager({ unlockedPlanets: [] }),
      createMockAudioManager(),
      { loadTitleCompanionFactory, scheduleIdleTask },
    );

    scene.enter({});
    await flushPromises();

    expect(idleCallbacks).toHaveLength(1);
    expect(loadTitleCompanionFactory).not.toHaveBeenCalled();
    expect(findCompanionParade(scene)).toBeUndefined();

    scene.exit();
  });

  it('does not show companion parade when no planets are unlocked', () => {
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager({ unlockedPlanets: [] }),
      createMockAudioManager(),
    );

    scene.enter({});

    expect(findCompanionParade(scene)).toBeUndefined();

    scene.exit();
  });

  it('creates the companion parade only after the idle callback runs', async () => {
    const { idleCallbacks, scheduleIdleTask } = createIdleTaskHarness();
    const loadTitleCompanionFactory = vi.fn(async () => ({
      createCompanionMesh: vi.fn(() => new THREE.Group()),
    }));
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager({ unlockedPlanets: [1, 2, 3] }),
      createMockAudioManager(),
      { loadTitleCompanionFactory, scheduleIdleTask },
    );

    scene.enter({});

    expect(idleCallbacks).toHaveLength(2);
    expect(loadTitleCompanionFactory).not.toHaveBeenCalled();
    expect(findCompanionParade(scene)).toBeUndefined();

    idleCallbacks[0]?.();
    await flushPromises();

    const parade = findCompanionParade(scene);
    expect(parade).toBeTruthy();
    expect(parade?.children).toHaveLength(3);

    scene.exit();
  });

  it('loads companion factory once and reuses it across re-entry', async () => {
    const { idleCallbacks, scheduleIdleTask } = createIdleTaskHarness();
    const createCompanionMesh = vi.fn(() => new THREE.Group());
    const loadTitleCompanionFactory = vi.fn(async () => ({
      createCompanionMesh,
    }));
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager({ unlockedPlanets: [1, 2] }),
      createMockAudioManager(),
      { loadTitleCompanionFactory, scheduleIdleTask },
    );

    scene.enter({});
    expect(idleCallbacks).toHaveLength(2);
    idleCallbacks[0]?.();
    await flushPromises();
    expect(loadTitleCompanionFactory).toHaveBeenCalledTimes(1);
    expect(findCompanionParade(scene)?.children).toHaveLength(2);

    scene.exit();
    scene.enter({});
    expect(idleCallbacks).toHaveLength(4);
    idleCallbacks[2]?.();
    await flushPromises();

    expect(loadTitleCompanionFactory).toHaveBeenCalledTimes(1);
    expect(createCompanionMesh).toHaveBeenCalledTimes(4);
    expect(findCompanionParade(scene)?.children).toHaveLength(2);

    scene.exit();
  });

  it('does not create the companion parade after exit even if the idle callback fires', async () => {
    const { idleCallbacks, scheduleIdleTask } = createIdleTaskHarness();
    const loadTitleCompanionFactory = vi.fn(async () => ({
      createCompanionMesh: vi.fn(() => new THREE.Group()),
    }));
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager({ unlockedPlanets: [1, 2] }),
      createMockAudioManager(),
      { loadTitleCompanionFactory, scheduleIdleTask },
    );

    scene.enter({});
    expect(idleCallbacks).toHaveLength(2);

    scene.exit();
    idleCallbacks[0]?.();
    await flushPromises();

    expect(loadTitleCompanionFactory).not.toHaveBeenCalled();
    expect(findCompanionParade(scene)).toBeUndefined();
  });

  it('does not attach the companion parade after exit when async loading resolves later', async () => {
    const { idleCallbacks, scheduleIdleTask } = createIdleTaskHarness();
    let resolveFactory: ((factory: { createCompanionMesh: () => THREE.Group }) => void) | null = null;
    const loadTitleCompanionFactory = vi.fn(
      () =>
        new Promise<{ createCompanionMesh: () => THREE.Group }>((resolve) => {
          resolveFactory = resolve;
        }),
    );
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager({ unlockedPlanets: [1, 2] }),
      createMockAudioManager(),
      { loadTitleCompanionFactory, scheduleIdleTask },
    );

    scene.enter({});
    idleCallbacks[0]?.();
    await flushPromises();
    expect(loadTitleCompanionFactory).toHaveBeenCalledTimes(1);

    scene.exit();
    resolveFactory?.({ createCompanionMesh: vi.fn(() => new THREE.Group()) });
    await flushPromises();
    await flushPromises();

    expect(findCompanionParade(scene)).toBeUndefined();
  });
});

describe('TitleScene first-run onboarding (auto tutorial)', () => {
  function createOnboardingMockSaveManager(initialTutorialShown = false): SaveManager {
    let tutorialShown = initialTutorialShown;
    return {
      load: vi.fn(() => ({
        clearedStage: 0,
        unlockedPlanets: [],
        bestStageStars: {},
        tutorialShown,
      })),
      save: vi.fn(),
      clear: vi.fn(),
      markTutorialShown: vi.fn(() => {
        tutorialShown = true;
      }),
    } as unknown as SaveManager;
  }

  it('auto-shows TutorialOverlay on enter() when tutorialShown is false', () => {
    const saveManager = createOnboardingMockSaveManager(false);
    const scene = new TitleScene(
      createMockSceneManager(),
      saveManager,
      createMockAudioManager(true),
    );

    scene.enter({});

    const overlay = document.querySelector('[data-tutorial-overlay]');
    expect(overlay).toBeTruthy();

    scene.exit();
  });

  it('does NOT auto-show TutorialOverlay when tutorialShown is true', () => {
    const saveManager = createOnboardingMockSaveManager(true);
    const scene = new TitleScene(
      createMockSceneManager(),
      saveManager,
      createMockAudioManager(true),
    );

    scene.enter({});

    expect(document.querySelector('[data-tutorial-overlay]')).toBeNull();
    expect(saveManager.markTutorialShown).not.toHaveBeenCalled();

    scene.exit();
  });

  it('does NOT auto-show TutorialOverlay for fresh-session save data when tutorialShown is already true', () => {
    const saveManager = {
      load: vi.fn(() => ({
        clearedStage: 0,
        unlockedPlanets: [],
        bestStageStars: {},
        tutorialShown: true,
        muted: false,
      })),
      save: vi.fn(),
      clear: vi.fn(),
      markTutorialShown: vi.fn(),
    } as unknown as SaveManager;
    const scene = new TitleScene(
      createMockSceneManager(),
      saveManager,
      createMockAudioManager(true),
    );

    scene.enter({});

    expect(document.querySelector('[data-tutorial-overlay]')).toBeNull();
    expect(saveManager.load).toHaveBeenCalled();
    expect(saveManager.markTutorialShown).not.toHaveBeenCalled();

    scene.exit();
  });

  it('persists tutorialShown=true and removes overlay when child taps "とじる"', () => {
    const saveManager = createOnboardingMockSaveManager(false);
    const scene = new TitleScene(
      createMockSceneManager(),
      saveManager,
      createMockAudioManager(true),
    );

    scene.enter({});

    const overlay = document.querySelector('[data-tutorial-overlay]') as HTMLElement;
    expect(overlay).toBeTruthy();
    const closeBtn = Array.from(overlay.querySelectorAll('button'))
      .find((b) => b.textContent === 'とじる');
    expect(closeBtn).toBeTruthy();

    closeBtn!.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(saveManager.markTutorialShown).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-tutorial-overlay]')).toBeNull();

    scene.exit();
  });

  it('first tutorial close initializes audio and starts BGM_0 once', () => {
    const saveManager = createOnboardingMockSaveManager(false);
    const audioManager = createMockAudioManager(false);
    const scene = new TitleScene(
      createMockSceneManager(),
      saveManager,
      audioManager,
    );

    scene.enter({});

    const closeBtn = findButtonByText('とじる');
    expect(closeBtn).toBeTruthy();

    closeBtn!.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(audioManager.initSync).toHaveBeenCalledTimes(1);
    expect(audioManager.playBGM).toHaveBeenCalledTimes(1);
    expect(audioManager.playBGM).toHaveBeenCalledWith(0);

    const titleOverlay = document.getElementById('ui-overlay')!.firstElementChild as HTMLDivElement;
    titleOverlay.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(audioManager.playBGM).toHaveBeenCalledTimes(1);

    scene.exit();
  });

  it('does not auto-show on the second enter() after the flag was set', () => {
    const saveManager = createOnboardingMockSaveManager(false);
    const scene = new TitleScene(
      createMockSceneManager(),
      saveManager,
      createMockAudioManager(true),
    );

    scene.enter({});
    const overlay = document.querySelector('[data-tutorial-overlay]') as HTMLElement;
    const closeBtn = Array.from(overlay.querySelectorAll('button'))
      .find((b) => b.textContent === 'とじる')!;
    closeBtn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    scene.exit();

    scene.enter({});
    expect(document.querySelector('[data-tutorial-overlay]')).toBeNull();
    scene.exit();
  });

  it('manual "あそびかた" button still opens the overlay even after tutorialShown is true', () => {
    const saveManager = createOnboardingMockSaveManager(true);
    const scene = new TitleScene(
      createMockSceneManager(),
      saveManager,
      createMockAudioManager(true),
    );

    scene.enter({});
    expect(document.querySelector('[data-tutorial-overlay]')).toBeNull();

    const uiOverlay = document.getElementById('ui-overlay')!;
    const tutorialBtn = Array.from(uiOverlay.querySelectorAll('button'))
      .find((b) => b.textContent === 'あそびかた');
    expect(tutorialBtn).toBeTruthy();
    tutorialBtn!.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(document.querySelector('[data-tutorial-overlay]')).toBeTruthy();

    scene.exit();
  });
});
