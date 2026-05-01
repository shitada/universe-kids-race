// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ResumeOverlay } from '../../src/ui/ResumeOverlay';
import { OrientationHintOverlay } from '../../src/ui/OrientationHintOverlay';
import { createOrientationHintHandler } from '../../src/game/utils/createOrientationHintHandler';
import { createVisibilityPauseHandler } from '../../src/game/utils/createVisibilityPauseHandler';

/**
 * Integration coverage for "background then rotate" — i.e. the page was
 * backgrounded and re-shown in portrait, then rotated to landscape.
 *
 * Production wiring lives in src/main.ts. We re-create that wiring here
 * (matching shape) so we can exercise the full pipeline without booting
 * Three.js / WebGL inside jsdom.
 *
 * Acceptance criteria covered (from improvement proposal):
 *   1. Stage + bg→fg→portrait→landscape => ResumeOverlay shown, tap calls
 *      stageScene.requestResumeCountdown().
 *   2. Stage + pure rotation (no bg) => ResumeOverlay NOT shown, resumeGame
 *      only (preserves spec 011 "no double countdown").
 *   3. Title/Ending + bg→fg with rotation => no ResumeOverlay, immediate resume.
 *   4. After tap, pendingBackgroundResume is cleared so a subsequent pure
 *      rotation does not show the overlay again.
 */

interface FakeWindowHandles {
  win: Window;
  doc: Document & { hidden: boolean };
  setSize: (w: number, h: number) => void;
  setHidden: (hidden: boolean) => void;
  fireResize: () => void;
  fireOrientationChange: () => void;
  fireVisibilityChange: () => void;
  flushTimers: () => void;
}

function makeFakeEnv(initial: { width: number; height: number }): FakeWindowHandles {
  const winListeners = new Map<string, Set<() => void>>();
  const docListeners = new Map<string, Set<() => void>>();
  let mqlMatches = initial.height > initial.width;
  const mqlListeners: Array<() => void> = [];
  let nextHandle = 1;
  const timers = new Map<number, () => void>();
  let hidden = false;

  const win = {
    innerWidth: initial.width,
    innerHeight: initial.height,
    matchMedia: () =>
      ({
        get matches() {
          return mqlMatches;
        },
        addEventListener: (_e: string, cb: () => void) => mqlListeners.push(cb),
        removeEventListener: (_e: string, cb: () => void) => {
          const i = mqlListeners.indexOf(cb);
          if (i >= 0) mqlListeners.splice(i, 1);
        },
      }) as unknown as MediaQueryList,
    addEventListener: (event: string, cb: () => void) => {
      if (!winListeners.has(event)) winListeners.set(event, new Set());
      winListeners.get(event)!.add(cb);
    },
    removeEventListener: (event: string, cb: () => void) => {
      winListeners.get(event)?.delete(cb);
    },
    setTimeout: (cb: () => void) => {
      const handle = nextHandle++;
      timers.set(handle, cb);
      return handle;
    },
    clearTimeout: (handle: number) => timers.delete(handle),
  } as unknown as Window;

  const doc = {
    get hidden() {
      return hidden;
    },
    addEventListener: (event: string, cb: () => void) => {
      if (!docListeners.has(event)) docListeners.set(event, new Set());
      docListeners.get(event)!.add(cb);
    },
    removeEventListener: (event: string, cb: () => void) => {
      docListeners.get(event)?.delete(cb);
    },
  } as unknown as Document & { hidden: boolean };

  return {
    win,
    doc,
    setSize: (w, h) => {
      (win as { innerWidth: number; innerHeight: number }).innerWidth = w;
      (win as { innerWidth: number; innerHeight: number }).innerHeight = h;
      mqlMatches = h > w;
    },
    setHidden: (h) => {
      hidden = h;
    },
    fireResize: () => winListeners.get('resize')?.forEach((cb) => cb()),
    fireOrientationChange: () =>
      winListeners.get('orientationchange')?.forEach((cb) => cb()),
    fireVisibilityChange: () =>
      docListeners.get('visibilitychange')?.forEach((cb) => cb()),
    flushTimers: () => {
      const pending = Array.from(timers.values());
      timers.clear();
      pending.forEach((cb) => cb());
    },
  };
}

interface SceneStub {
  type: 'title' | 'stage' | 'ending';
  isPlaying: () => boolean;
}

interface WiringHandles {
  pause: ReturnType<typeof vi.fn>;
  resume: ReturnType<typeof vi.fn>;
  suspendAudio: ReturnType<typeof vi.fn>;
  ensureAudioResumed: ReturnType<typeof vi.fn>;
  requestResumeCountdown: ReturnType<typeof vi.fn>;
  resumeOverlay: ResumeOverlay;
  orientationHintOverlay: OrientationHintOverlay;
  scene: SceneStub;
  setPaused: (paused: boolean) => void;
  isPaused: () => boolean;
  fake: FakeWindowHandles;
  dispose: () => void;
  // Test-only inspector to verify the flag is cleared after a tap.
  getPendingBackgroundResume: () => boolean;
  // Tap the visible ResumeOverlay (if any) to fire its onResume callback.
  tapResumeOverlay: () => boolean;
}

function setupWiring(opts: {
  width: number;
  height: number;
  scene: 'title' | 'stage' | 'ending';
  stagePlaying?: boolean;
}): WiringHandles {
  const fake = makeFakeEnv({ width: opts.width, height: opts.height });
  const resumeOverlay = new ResumeOverlay();
  const orientationHintOverlay = new OrientationHintOverlay();
  const stagePlaying = opts.stagePlaying ?? true;
  const scene: SceneStub = {
    type: opts.scene,
    isPlaying: () => opts.scene === 'stage' && stagePlaying,
  };

  const pause = vi.fn();
  const resume = vi.fn();
  const suspendAudio = vi.fn();
  const ensureAudioResumed = vi.fn();
  const requestResumeCountdown = vi.fn();

  let paused = false;
  const setPaused = (p: boolean): void => {
    paused = p;
  };
  const isPaused = (): boolean => paused;

  // Mirror src/main.ts wiring shape.
  let isPortraitLocked = false;
  let pendingBackgroundResume = false;

  const resumeGame = (): void => {
    setPaused(false);
    resume();
    ensureAudioResumed();
  };

  const showStageResumeOverlay = (): void => {
    resumeOverlay.show(() => {
      pendingBackgroundResume = false;
      resumeGame();
      requestResumeCountdown();
    });
  };

  const handleVisibilityRestore = (): void => {
    if (isPortraitLocked) return;
    if (scene.type === 'stage' && isPaused() && scene.isPlaying()) {
      showStageResumeOverlay();
    } else {
      resumeOverlay.hide();
      pendingBackgroundResume = false;
      resumeGame();
    }
  };

  const detachVisibility = createVisibilityPauseHandler({
    doc: fake.doc,
    win: fake.win,
    onHide: () => {
      pendingBackgroundResume = true;
      setPaused(true);
      pause();
      suspendAudio();
    },
    onShow: handleVisibilityRestore,
  });

  const orientationHandler = createOrientationHintHandler({
    win: fake.win,
    onPortrait: () => {
      isPortraitLocked = true;
      resumeOverlay.hide();
      orientationHintOverlay.show();
      setPaused(true);
      pause();
      suspendAudio();
    },
    onLandscape: () => {
      if (!isPortraitLocked) return;
      isPortraitLocked = false;
      orientationHintOverlay.hide();
      if (
        pendingBackgroundResume &&
        scene.type === 'stage' &&
        isPaused() &&
        scene.isPlaying()
      ) {
        showStageResumeOverlay();
      } else {
        pendingBackgroundResume = false;
        resumeGame();
      }
    },
  });
  orientationHandler.evaluate();

  const tapResumeOverlay = (): boolean => {
    const el = document.querySelector('[data-resume-overlay]') as HTMLElement | null;
    if (!el) return false;
    el.dispatchEvent(new Event('click', { bubbles: true }));
    return true;
  };

  return {
    pause,
    resume,
    suspendAudio,
    ensureAudioResumed,
    requestResumeCountdown,
    resumeOverlay,
    orientationHintOverlay,
    scene,
    setPaused,
    isPaused,
    fake,
    dispose: () => {
      detachVisibility();
      orientationHandler.dispose();
      resumeOverlay.dispose();
      orientationHintOverlay.dispose();
    },
    getPendingBackgroundResume: () => pendingBackgroundResume,
    tapResumeOverlay,
  };
}

describe('background-then-rotate integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="ui-overlay"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('stage: bg → fg(portrait) → landscape shows ResumeOverlay; tap fires countdown', () => {
    const w = setupWiring({ width: 1024, height: 768, scene: 'stage' });

    // Background: hide the page.
    w.fake.setHidden(true);
    w.fake.fireVisibilityChange();
    expect(w.isPaused()).toBe(true);
    expect(w.getPendingBackgroundResume()).toBe(true);

    // While backgrounded, device rotates to portrait. We surface this only
    // once the page is shown again — represented by a portrait resize firing
    // before the visibilitychange (matches main.ts: portrait listener may
    // fire either before or after the show event).
    w.fake.setSize(768, 1024);
    w.fake.fireOrientationChange();
    w.fake.flushTimers();
    expect(w.orientationHintOverlay.isVisible()).toBe(true);

    // Foreground: visibilitychange show. Because portrait is locked,
    // handleVisibilityRestore returns early WITHOUT clearing the flag.
    w.fake.setHidden(false);
    w.fake.fireVisibilityChange();
    expect(w.resumeOverlay.isVisible()).toBe(false);
    expect(w.getPendingBackgroundResume()).toBe(true);

    // Now rotate to landscape. The flag is still set => ResumeOverlay must
    // appear instead of an immediate resume.
    w.fake.setSize(1024, 768);
    w.fake.fireOrientationChange();
    w.fake.flushTimers();
    expect(w.orientationHintOverlay.isVisible()).toBe(false);
    expect(w.resumeOverlay.isVisible()).toBe(true);
    expect(w.requestResumeCountdown).not.toHaveBeenCalled();
    expect(w.resume).not.toHaveBeenCalled();

    // Tap to resume.
    expect(w.tapResumeOverlay()).toBe(true);
    expect(w.requestResumeCountdown).toHaveBeenCalledTimes(1);
    expect(w.resume).toHaveBeenCalledTimes(1);
    expect(w.getPendingBackgroundResume()).toBe(false);
    expect(w.resumeOverlay.isVisible()).toBe(false);

    w.dispose();
  });

  it('stage: pure rotation (no bg) does NOT show ResumeOverlay (no double countdown)', () => {
    const w = setupWiring({ width: 1024, height: 768, scene: 'stage' });

    // Rotate to portrait — purely a rotation, never backgrounded.
    w.fake.setSize(768, 1024);
    w.fake.fireOrientationChange();
    w.fake.flushTimers();
    expect(w.orientationHintOverlay.isVisible()).toBe(true);
    expect(w.getPendingBackgroundResume()).toBe(false);

    // Rotate back to landscape. Because the flag is false, resume happens
    // directly — no ResumeOverlay, no countdown.
    w.fake.setSize(1024, 768);
    w.fake.fireOrientationChange();
    w.fake.flushTimers();
    expect(w.resumeOverlay.isVisible()).toBe(false);
    expect(w.requestResumeCountdown).not.toHaveBeenCalled();
    expect(w.resume).toHaveBeenCalledTimes(1);

    w.dispose();
  });

  it('title scene: bg → fg(portrait) → landscape immediately resumes (no ResumeOverlay)', () => {
    const w = setupWiring({ width: 1024, height: 768, scene: 'title' });

    w.fake.setHidden(true);
    w.fake.fireVisibilityChange();
    expect(w.getPendingBackgroundResume()).toBe(true);

    // Rotate to portrait while backgrounded.
    w.fake.setSize(768, 1024);
    w.fake.fireOrientationChange();
    w.fake.flushTimers();

    // Foreground while still portrait: stays paused (orientation owns UI).
    w.fake.setHidden(false);
    w.fake.fireVisibilityChange();
    expect(w.resumeOverlay.isVisible()).toBe(false);

    // Rotate back to landscape: scene is 'title' => no overlay, immediate resume.
    w.fake.setSize(1024, 768);
    w.fake.fireOrientationChange();
    w.fake.flushTimers();
    expect(w.resumeOverlay.isVisible()).toBe(false);
    expect(w.resume).toHaveBeenCalledTimes(1);
    expect(w.getPendingBackgroundResume()).toBe(false);

    w.dispose();
  });

  it('after tap-to-resume, a subsequent pure rotation does NOT show the overlay again', () => {
    const w = setupWiring({ width: 1024, height: 768, scene: 'stage' });

    // bg → fg (still landscape) shows ResumeOverlay directly.
    w.fake.setHidden(true);
    w.fake.fireVisibilityChange();
    w.fake.setHidden(false);
    w.fake.fireVisibilityChange();
    expect(w.resumeOverlay.isVisible()).toBe(true);

    // Tap to consume.
    expect(w.tapResumeOverlay()).toBe(true);
    expect(w.getPendingBackgroundResume()).toBe(false);
    w.requestResumeCountdown.mockClear();
    w.resume.mockClear();

    // Pure rotation cycle.
    w.fake.setSize(768, 1024);
    w.fake.fireOrientationChange();
    w.fake.flushTimers();
    w.fake.setSize(1024, 768);
    w.fake.fireOrientationChange();
    w.fake.flushTimers();

    expect(w.resumeOverlay.isVisible()).toBe(false);
    expect(w.requestResumeCountdown).not.toHaveBeenCalled();
    expect(w.resume).toHaveBeenCalledTimes(1);

    w.dispose();
  });

  it('stage: bg → fg in landscape (no rotation) still shows ResumeOverlay (regression guard)', () => {
    const w = setupWiring({ width: 1024, height: 768, scene: 'stage' });

    w.fake.setHidden(true);
    w.fake.fireVisibilityChange();
    w.fake.setHidden(false);
    w.fake.fireVisibilityChange();

    expect(w.resumeOverlay.isVisible()).toBe(true);
    expect(w.requestResumeCountdown).not.toHaveBeenCalled();

    expect(w.tapResumeOverlay()).toBe(true);
    expect(w.requestResumeCountdown).toHaveBeenCalledTimes(1);
    expect(w.getPendingBackgroundResume()).toBe(false);

    w.dispose();
  });

  it('stage(non-playing): bg → fg in landscape resumes immediately without ResumeOverlay', () => {
    const w = setupWiring({ width: 1024, height: 768, scene: 'stage', stagePlaying: false });

    w.fake.setHidden(true);
    w.fake.fireVisibilityChange();
    w.fake.setHidden(false);
    w.fake.fireVisibilityChange();

    expect(w.resumeOverlay.isVisible()).toBe(false);
    expect(w.requestResumeCountdown).not.toHaveBeenCalled();
    expect(w.resume).toHaveBeenCalledTimes(1);
    expect(w.getPendingBackgroundResume()).toBe(false);

    w.dispose();
  });

  it('stage(non-playing): bg → fg(portrait) → landscape resumes immediately without ResumeOverlay', () => {
    const w = setupWiring({ width: 1024, height: 768, scene: 'stage', stagePlaying: false });

    w.fake.setHidden(true);
    w.fake.fireVisibilityChange();
    w.fake.setSize(768, 1024);
    w.fake.fireOrientationChange();
    w.fake.flushTimers();

    w.fake.setHidden(false);
    w.fake.fireVisibilityChange();
    expect(w.resumeOverlay.isVisible()).toBe(false);
    expect(w.getPendingBackgroundResume()).toBe(true);

    w.fake.setSize(1024, 768);
    w.fake.fireOrientationChange();
    w.fake.flushTimers();

    expect(w.orientationHintOverlay.isVisible()).toBe(false);
    expect(w.resumeOverlay.isVisible()).toBe(false);
    expect(w.requestResumeCountdown).not.toHaveBeenCalled();
    expect(w.resume).toHaveBeenCalledTimes(1);
    expect(w.getPendingBackgroundResume()).toBe(false);

    w.dispose();
  });
});
