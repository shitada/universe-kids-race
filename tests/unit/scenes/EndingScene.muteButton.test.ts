// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EndingScene } from '../../../src/game/scenes/EndingScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveData } from '../../../src/types';

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

function createMockAudioManager(initialMuted = false): {
  mock: AudioManager;
  state: { muted: boolean };
} {
  const state = { muted: initialMuted };
  const mock = {
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => state.muted),
    toggleMute: vi.fn(() => {
      state.muted = !state.muted;
      return state.muted;
    }),
    setMuted: vi.fn((m: boolean) => {
      state.muted = m;
    }),
    playSFX: vi.fn(),
    initFromInteraction: vi.fn(),
  } as unknown as AudioManager;
  return { mock, state };
}

function createMockSaveManager(initialMuted = false): {
  mock: SaveManager;
  saved: SaveData[];
} {
  const data: SaveData = { clearedStage: 11, unlockedPlanets: [1, 2, 3], muted: initialMuted };
  const saved: SaveData[] = [];
  const mock = {
    load: vi.fn(() => ({ ...data, unlockedPlanets: [...data.unlockedPlanets] })),
    save: vi.fn((d: SaveData) => {
      data.clearedStage = d.clearedStage;
      data.unlockedPlanets = [...d.unlockedPlanets];
      data.muted = d.muted;
      saved.push({ ...d, unlockedPlanets: [...d.unlockedPlanets] });
    }),
    clear: vi.fn(),
  } as unknown as SaveManager;
  return { mock, saved };
}

describe('EndingScene mute button', () => {
  beforeEach(() => {
    const hud = document.createElement('div');
    hud.id = 'hud';
    document.body.appendChild(hud);
    const overlay = document.createElement('div');
    overlay.id = 'ui-overlay';
    document.body.appendChild(overlay);
  });

  afterEach(() => {
    document.getElementById('hud')?.remove();
    document.getElementById('ui-overlay')?.remove();
  });

  function getMuteButton(): HTMLButtonElement | null {
    return document.querySelector('button[data-mute-button]');
  }

  it('adds a mute button on enter()', () => {
    const sm = createMockSceneManager();
    const { mock: save } = createMockSaveManager();
    const { mock: audio } = createMockAudioManager();
    const scene = new EndingScene(sm, save, audio);
    scene.enter({ totalScore: 0, totalStarCount: 0 });
    expect(getMuteButton()).not.toBeNull();
    scene.exit();
  });

  it('initial glyph reflects audioManager.isMuted() at enter()', () => {
    const sm = createMockSceneManager();
    const { mock: save } = createMockSaveManager(true);
    const { mock: audio } = createMockAudioManager(true);
    const scene = new EndingScene(sm, save, audio);
    scene.enter({ totalScore: 0, totalStarCount: 0 });
    expect(getMuteButton()!.textContent).toBe('🔇');
    scene.exit();
  });

  it('clicking toggles audio, syncs glyph, and persists muted to SaveManager', () => {
    const sm = createMockSceneManager();
    const { mock: save, saved } = createMockSaveManager(false);
    const { mock: audio, state } = createMockAudioManager(false);
    const scene = new EndingScene(sm, save, audio);
    scene.enter({ totalScore: 0, totalStarCount: 0 });
    const btn = getMuteButton()!;

    btn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(audio.toggleMute).toHaveBeenCalledTimes(1);
    expect(state.muted).toBe(true);
    expect(btn.textContent).toBe('🔇');
    expect(saved[saved.length - 1].muted).toBe(true);

    btn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(state.muted).toBe(false);
    expect(btn.textContent).toBe('🔊');
    expect(saved[saved.length - 1].muted).toBe(false);

    scene.exit();
  });

  it('exit() removes the mute button from the DOM', () => {
    const sm = createMockSceneManager();
    const { mock: save } = createMockSaveManager();
    const { mock: audio } = createMockAudioManager();
    const scene = new EndingScene(sm, save, audio);
    scene.enter({ totalScore: 0, totalStarCount: 0 });
    expect(getMuteButton()).not.toBeNull();
    scene.exit();
    expect(getMuteButton()).toBeNull();
  });
});
