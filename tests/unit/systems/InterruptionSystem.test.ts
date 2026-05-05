import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GameStateBackup } from '../../../src/game/storage/GameStateBackup';
import { InterruptionSystem } from '../../../src/game/systems/InterruptionSystem';

function createStorage() {
  const store = new Map<string, string>();
  return {
    storage: {
      getItem: vi.fn((key: string) => store.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        store.delete(key);
      }),
    },
  };
}

describe('InterruptionSystem', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('pauses and saves a snapshot on hide, then shows the gentle resume overlay on restore', () => {
    const { storage } = createStorage();
    const backup = new GameStateBackup({
      storage,
      now: () => 1_000,
    });
    const pauseGame = vi.fn();
    const resumeGame = vi.fn();
    const restoreViewport = vi.fn();
    const showResumeOverlay = vi.fn();
    const hideResumeOverlay = vi.fn();
    const requestResumeCountdown = vi.fn();

    const system = new InterruptionSystem({
      backup,
      now: () => 6_000,
      getSceneState: () => ({
        sceneType: 'stage',
        stagePlaying: true,
        userPaused: false,
      }),
      isGamePaused: () => true,
      isPortraitLocked: () => false,
      pauseGame,
      resumeGame,
      restoreViewport,
      showResumeOverlay,
      hideResumeOverlay,
      requestResumeCountdown,
      getPausedDurationMs: () => 5_000,
    });

    system.handleHide('visibilitychange');
    system.handleShow();

    expect(pauseGame).toHaveBeenCalledTimes(1);
    expect(backup.loadRecent()).not.toBeNull();
    expect(restoreViewport).toHaveBeenCalledTimes(1);
    expect(showResumeOverlay).toHaveBeenCalledTimes(1);

    const [options] = showResumeOverlay.mock.calls[0];
    expect(options.title).toContain('おかえり');
    expect(typeof options.onResume).toBe('function');

    options.onResume();
    expect(resumeGame).toHaveBeenCalledTimes(1);
    expect(requestResumeCountdown).toHaveBeenCalledTimes(1);
    expect(backup.loadRecent()).toBeNull();
  });

  it('keeps the game paused when the stage was manually paused before hiding', () => {
    const { storage } = createStorage();
    const backup = new GameStateBackup({ storage });
    const system = new InterruptionSystem({
      backup,
      getSceneState: () => ({
        sceneType: 'stage',
        stagePlaying: false,
        userPaused: true,
      }),
      isGamePaused: () => true,
      isPortraitLocked: () => false,
      pauseGame: vi.fn(),
      resumeGame: vi.fn(),
      restoreViewport: vi.fn(),
      showResumeOverlay: vi.fn(),
      hideResumeOverlay: vi.fn(),
      requestResumeCountdown: vi.fn(),
    });

    system.handleHide('blur');
    system.handleShow();

    expect(backup.loadRecent()).toBeNull();
    expect(system['pendingBackgroundResume']).toBe(false);
  });

  it('resumes immediately for non-stage scenes', () => {
    const resumeGame = vi.fn();
    const system = new InterruptionSystem({
      getSceneState: () => ({
        sceneType: 'title',
        stagePlaying: false,
        userPaused: false,
      }),
      isGamePaused: () => true,
      isPortraitLocked: () => false,
      pauseGame: vi.fn(),
      resumeGame,
      restoreViewport: vi.fn(),
      showResumeOverlay: vi.fn(),
      hideResumeOverlay: vi.fn(),
      requestResumeCountdown: vi.fn(),
    });

    system.handleShow();

    expect(resumeGame).toHaveBeenCalledTimes(1);
  });

  it('keeps pending state while portrait lock is active and resumes gently after landscape', () => {
    const { storage } = createStorage();
    const backup = new GameStateBackup({
      storage,
      now: () => 1_000,
    });
    let portraitLocked = true;
    const showResumeOverlay = vi.fn();
    const system = new InterruptionSystem({
      backup,
      now: () => 2_000,
      getSceneState: () => ({
        sceneType: 'stage',
        stagePlaying: true,
        userPaused: false,
      }),
      isGamePaused: () => true,
      isPortraitLocked: () => portraitLocked,
      pauseGame: vi.fn(),
      resumeGame: vi.fn(),
      restoreViewport: vi.fn(),
      showResumeOverlay,
      hideResumeOverlay: vi.fn(),
      requestResumeCountdown: vi.fn(),
    });

    system.handleHide('pagehide');
    system.handleShow();
    expect(showResumeOverlay).not.toHaveBeenCalled();

    portraitLocked = false;
    system.handleLandscape();
    expect(showResumeOverlay).toHaveBeenCalledTimes(1);
  });
});
