// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TitleScene } from '../../../src/game/scenes/TitleScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import { PLANET_ENCYCLOPEDIA } from '../../../src/game/config/PlanetEncyclopedia';
import { EncyclopediaOverlay } from '../../../src/ui/EncyclopediaOverlay';

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

function createMockAudioManager(initialized = true): AudioManager {
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

function createMockSaveManager(unlocked: number[] = []): SaveManager {
  let data = { clearedStage: 0, unlockedPlanets: unlocked, muted: false } as ReturnType<SaveManager['load']>;
  return {
    load: vi.fn(() => data),
    save: vi.fn((d: typeof data) => { data = d; }),
    clear: vi.fn(() => { data = { clearedStage: 0, unlockedPlanets: [], muted: false } as typeof data; }),
    setUnlocked: (u: number[]) => { data = { ...data, unlockedPlanets: u }; },
  } as unknown as SaveManager & { setUnlocked: (u: number[]) => void };
}

beforeEach(() => {
  const overlay = document.createElement('div');
  overlay.id = 'ui-overlay';
  document.body.appendChild(overlay);
  return () => {
    overlay.remove();
  };
});

function findEncyclopediaButton(): HTMLButtonElement | undefined {
  const uiOverlay = document.getElementById('ui-overlay')!;
  const buttons = uiOverlay.querySelectorAll('button');
  return Array.from(buttons).find((b) => (b.textContent ?? '').startsWith('ずかん'));
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

describe('TitleScene encyclopedia button label', () => {
  it('shows plain "ずかん" when no planets are unlocked', () => {
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager([]),
      createMockAudioManager(),
    );
    scene.enter({});
    const btn = findEncyclopediaButton();
    expect(btn?.textContent).toBe('ずかん');
    scene.exit();
  });

  it('shows progress "ずかん 3 / 11" when partially unlocked', () => {
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager([1, 2, 3]),
      createMockAudioManager(),
    );
    scene.enter({});
    const btn = findEncyclopediaButton();
    expect(btn?.textContent).toBe(`ずかん 3 / ${PLANET_ENCYCLOPEDIA.length}`);
    scene.exit();
  });

  it('shows celebration "ずかん 11 / 11 🎉" when fully unlocked', () => {
    const allPlanets = PLANET_ENCYCLOPEDIA.map((p) => p.stageNumber);
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager(allPlanets),
      createMockAudioManager(),
    );
    scene.enter({});
    const btn = findEncyclopediaButton();
    const total = PLANET_ENCYCLOPEDIA.length;
    expect(btn?.textContent).toBe(`ずかん ${total} / ${total} 🎉`);
    scene.exit();
  });

  it('refreshes label after closing the encyclopedia overlay', async () => {
    const saveManager = createMockSaveManager([]) as SaveManager & { setUnlocked: (u: number[]) => void };
    const scene = new TitleScene(
      createMockSceneManager(),
      saveManager,
      createMockAudioManager(),
      {
        loadEncyclopediaOverlay: async () => ({ EncyclopediaOverlay }),
      },
    );
    scene.enter({});
    const btn = findEncyclopediaButton();
    expect(btn?.textContent).toBe('ずかん');

    // ずかんを開く
    dispatchReleaseConfirm(btn!);
    await flushPromises();
    await flushPromises();

    // プレイヤーがプレイ中に新しい惑星を解放したと仮定し保存データ更新
    saveManager.setUnlocked([1, 2]);

    // ずかんの閉じるボタン (「もどる」) を押下し onClose を発火
    const closeBtn = Array.from(document.querySelectorAll('button')).find(
      (b) => b.textContent === 'もどる',
    );
    expect(closeBtn).toBeTruthy();
    closeBtn!.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(btn?.textContent).toBe(`ずかん 2 / ${PLANET_ENCYCLOPEDIA.length}`);
    scene.exit();
  });
});
