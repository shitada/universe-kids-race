// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../src/game/scenes/StageScene';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SceneManager } from '../../src/game/SceneManager';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { SaveManager } from '../../src/game/storage/SaveManager';
import type { SaveData } from '../../src/types';
import { EncyclopediaOverlay } from '../../src/ui/EncyclopediaOverlay';

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

function createStatefulSaveManager(initial: SaveData) {
  const state: SaveData = {
    ...initial,
    unlockedPlanets: [...initial.unlockedPlanets],
    bestStageStars: { ...(initial.bestStageStars ?? {}) },
    discoveredConstellations: [...(initial.discoveredConstellations ?? [])],
  };

  const saveManager = {
    load: vi.fn(() => ({
      ...state,
      unlockedPlanets: [...state.unlockedPlanets],
      bestStageStars: { ...(state.bestStageStars ?? {}) },
      discoveredConstellations: [...(state.discoveredConstellations ?? [])],
    })),
    save: vi.fn((next: SaveData) => {
      state.clearedStage = next.clearedStage;
      state.unlockedPlanets = [...next.unlockedPlanets];
      state.muted = next.muted;
      state.tutorialShown = next.tutorialShown;
      state.bestStageStars = { ...(next.bestStageStars ?? {}) };
      state.discoveredConstellations = [...(next.discoveredConstellations ?? [])];
    }),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
    markConstellationDiscovered: vi.fn((stageNumber: number) => {
      if (state.discoveredConstellations?.includes(stageNumber)) {
        return false;
      }
      state.discoveredConstellations = [...(state.discoveredConstellations ?? []), stageNumber];
      return true;
    }),
  } as unknown as SaveManager;

  return { state, saveManager };
}

describe('Stage constellation flow integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockCanvasContext();
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('reveals constellation lines, celebrates, and records the discovery in the encyclopedia', () => {
    const { state, saveManager } = createStatefulSaveManager({
      clearedStage: 0,
      unlockedPlanets: [1],
      muted: false,
      tutorialShown: true,
      bestStageStars: {},
      discoveredConstellations: [],
    });
    const inputSystem = {
      setBoostPressed: vi.fn(),
      getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
      resetPointers: vi.fn(),
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
    const scene = new StageScene(
      { requestTransition: vi.fn() } as unknown as SceneManager,
      inputSystem,
      audioManager,
      saveManager,
    );

    scene.enter({ stageNumber: 1, totalScore: 0, totalStarCount: 0 });

    const internal = scene as unknown as {
      isStarting: boolean;
      stageIntroOverlay: { dispose(): void } | null;
      countdownOverlay: { dispose(): void } | null;
      stars: Array<{
        position: { x: number; y: number; z: number };
        constellationOrder: number | null;
      }>;
      spaceship: { position: { x: number; y: number; z: number } };
      constellationLineEffect: { getObject(): { visible: boolean; geometry: { drawRange: { count: number } } } | null };
      constellationCelebrationEffect: { getObject(): { visible: boolean } };
      constellationHintOverlay: { getMessage(): string | null };
    };
    internal.stageIntroOverlay?.dispose();
    internal.countdownOverlay?.dispose();
    internal.stageIntroOverlay = null;
    internal.countdownOverlay = null;
    internal.isStarting = false;

    const targetStars = [...internal.stars]
      .filter((star) => star.constellationOrder !== null)
      .sort((a, b) => (a.constellationOrder ?? 0) - (b.constellationOrder ?? 0));
    expect(targetStars.length).toBeGreaterThanOrEqual(4);

    for (const star of targetStars) {
      internal.spaceship.position.x = star.position.x;
      internal.spaceship.position.y = star.position.y;
      internal.spaceship.position.z = star.position.z;
      scene.update(0.016);
    }

    expect(saveManager.markConstellationDiscovered).toHaveBeenCalledWith(1);
    expect(state.discoveredConstellations).toEqual([1]);
    expect(audioManager.playSFX).toHaveBeenCalledWith('constellationCelebrate');
    expect(internal.constellationLineEffect.getObject()?.visible).toBe(true);
    expect(internal.constellationCelebrationEffect.getObject().visible).toBe(true);
    expect(internal.constellationLineEffect.getObject()?.geometry.drawRange.count).toBeGreaterThan(0);
    expect(internal.constellationHintOverlay.getMessage()).toContain('おおぐまざ');

    const overlay = new EncyclopediaOverlay();
    overlay.show([1], () => {}, undefined, {}, state.discoveredConstellations);
    expect(document.querySelector('[data-constellation-card][data-stage="1"]')?.textContent).toContain('おおぐまざ');
    overlay.hide();
  });
});
