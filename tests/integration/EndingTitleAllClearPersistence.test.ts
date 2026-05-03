// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { SceneManager } from '../../src/game/SceneManager';
import { EndingScene } from '../../src/game/scenes/EndingScene';
import { TitleScene } from '../../src/game/scenes/TitleScene';
import { TOTAL_STAGES } from '../../src/game/config/StageConfig';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';
import type { SaveData } from '../../src/types';

function flushPromises(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

describe('Ending → Title all-clear persistence', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('keeps the all-clear title preview after EndingScene resets clearedStage to 0', async () => {
    const manager = new SceneManager();
    const saveState: SaveData = {
      clearedStage: TOTAL_STAGES,
      unlockedPlanets: Array.from({ length: TOTAL_STAGES }, (_, index) => index + 1),
      muted: false,
      tutorialShown: true,
      bestStageStars: { 1: 3, [TOTAL_STAGES]: 2 },
    };
    const saveManager = {
      load: vi.fn(() => ({
        ...saveState,
        unlockedPlanets: [...saveState.unlockedPlanets],
        bestStageStars: { ...(saveState.bestStageStars ?? {}) },
      })),
      save: vi.fn((nextData: SaveData) => {
        saveState.clearedStage = nextData.clearedStage;
        saveState.unlockedPlanets = [...nextData.unlockedPlanets];
        saveState.muted = nextData.muted;
        saveState.tutorialShown = nextData.tutorialShown;
        saveState.bestStageStars = { ...(nextData.bestStageStars ?? {}) };
      }),
      clear: vi.fn(),
      resetProgressPreservingSettings: vi.fn(),
      markTutorialShown: vi.fn(),
    } as unknown as SaveManager;
    const audioManager = {
      initSync: vi.fn(),
      isInitialized: vi.fn(() => true),
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      playSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
      startBoostSFX: vi.fn(),
      isMuted: vi.fn(() => false),
      toggleMute: vi.fn(() => false),
      setMuted: vi.fn(),
      ensureResumed: vi.fn(),
      dispose: vi.fn(),
    } as unknown as AudioManager;

    manager.registerScene(
      'title',
      new TitleScene(manager, saveManager, audioManager, {
        scheduleIdleTask: () => {},
        loadTitleCompanionFactory: async () => ({
          createCompanionMesh: () => new THREE.Group(),
        }),
      }),
    );
    const endingScene = new EndingScene(manager, saveManager, audioManager);
    manager.registerScene('ending', endingScene);

    await manager.transitionTo('ending', { totalScore: 9000, totalStarCount: 72 });

    expect(saveState.clearedStage).toBe(0);
    expect(saveState.unlockedPlanets).toEqual(Array.from({ length: TOTAL_STAGES }, (_, index) => index + 1));
    expect(saveState.bestStageStars).toEqual({ 1: 3, [TOTAL_STAGES]: 2 });

    const overlay = document.querySelector('[data-ending-overlay]') as HTMLDivElement | null;
    expect(overlay).toBeTruthy();

    // In HEAD's EndingScene, exit is triggered by tapping anywhere on the overlay
    // once canExit is true (after animation completes).
    (endingScene as unknown as { canExit: boolean }).canExit = true;
    overlay?.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();

    expect(manager.getCurrentType()).toBe('title');

    const card = document.querySelector('[data-next-adventure-card]') as HTMLDivElement | null;
    const hint = document.querySelector('[data-play-button-hint]') as HTMLDivElement | null;
    expect(card?.getAttribute('data-next-stage-number')).toBe('1');
    expect(card?.getAttribute('data-next-stage-destination')).toBe('月');
    expect(card?.textContent).toContain('ぜんぶ クリア！');
    expect(hint?.textContent).toContain('ステージ 1');
    expect(hint?.textContent).toContain('もういちど');
    expect(document.querySelector('[data-reset-progress-button]')?.textContent).toBe('さいしょから');
  });
});
