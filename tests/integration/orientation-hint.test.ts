// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OrientationHintOverlay } from '../../src/ui/OrientationHintOverlay';
import { createOrientationHintHandler } from '../../src/game/utils/createOrientationHintHandler';

/**
 * Integration coverage for the orientation hint pipeline as wired in
 * src/main.ts: matchMedia/resize -> handler -> overlay + gameLoop pause/resume.
 *
 * We re-create the wiring here against a fake window + minimal gameLoop stub
 * because main.ts boots Three.js / WebGL which jsdom cannot host. The
 * production wiring in main.ts is the same shape (onPortrait pauses + shows,
 * onLandscape hides + resumes).
 */

interface FakeWindowHandles {
  win: Window;
  setSize: (w: number, h: number) => void;
  fireResize: () => void;
  fireOrientationChange: () => void;
  flushTimers: () => void;
  setMatchMedia: (matches: boolean) => void;
}

function makeFakeWindow(initial: { width: number; height: number }): FakeWindowHandles {
  const listeners = new Map<string, Set<() => void>>();
  let mqlMatches = initial.height > initial.width;
  const mqlListeners: Array<() => void> = [];
  let nextHandle = 1;
  const timers = new Map<number, () => void>();
  const win = {
    innerWidth: initial.width,
    innerHeight: initial.height,
    matchMedia: () =>
      ({
        get matches() {
          return mqlMatches;
        },
        addEventListener: (_event: string, cb: () => void) => mqlListeners.push(cb),
        removeEventListener: (_event: string, cb: () => void) => {
          const i = mqlListeners.indexOf(cb);
          if (i >= 0) mqlListeners.splice(i, 1);
        },
      }) as unknown as MediaQueryList,
    addEventListener: (event: string, cb: () => void) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(cb);
    },
    removeEventListener: (event: string, cb: () => void) => {
      listeners.get(event)?.delete(cb);
    },
    setTimeout: (cb: () => void) => {
      const handle = nextHandle++;
      timers.set(handle, cb);
      return handle;
    },
    clearTimeout: (handle: number) => timers.delete(handle),
  } as unknown as Window;

  return {
    win,
    setSize: (w, h) => {
      (win as { innerWidth: number; innerHeight: number }).innerWidth = w;
      (win as { innerWidth: number; innerHeight: number }).innerHeight = h;
      mqlMatches = h > w;
    },
    fireResize: () => listeners.get('resize')?.forEach((cb) => cb()),
    fireOrientationChange: () =>
      listeners.get('orientationchange')?.forEach((cb) => cb()),
    flushTimers: () => {
      const pending = Array.from(timers.values());
      timers.clear();
      pending.forEach((cb) => cb());
    },
    setMatchMedia: (matches: boolean) => {
      mqlMatches = matches;
    },
  };
}

interface WiringHandles {
  pause: ReturnType<typeof vi.fn>;
  resume: ReturnType<typeof vi.fn>;
  showResume: ReturnType<typeof vi.fn>;
  hideResume: ReturnType<typeof vi.fn>;
  overlay: OrientationHintOverlay;
  refreshViewport: ReturnType<typeof vi.fn>;
  isPortraitLocked: () => boolean;
  fake: FakeWindowHandles;
  dispose: () => void;
}

function setupWiring(initial: { width: number; height: number }): WiringHandles {
  const fake = makeFakeWindow(initial);
  const overlay = new OrientationHintOverlay();
  const pause = vi.fn();
  const resume = vi.fn();
  const showResume = vi.fn();
  const hideResume = vi.fn();
  const refreshViewport = vi.fn();
  let portraitLocked = false;

  const handler = createOrientationHintHandler({
    win: fake.win,
    onPortrait: () => {
      portraitLocked = true;
      hideResume();
      overlay.show();
      pause();
    },
    onLandscape: () => {
      if (!portraitLocked) return;
      portraitLocked = false;
      overlay.hide();
      refreshViewport();
      resume();
    },
  });
  handler.evaluate();

  return {
    pause,
    resume,
    showResume,
    hideResume,
    overlay,
    refreshViewport,
    isPortraitLocked: () => portraitLocked,
    fake,
    dispose: () => {
      handler.dispose();
      overlay.dispose();
    },
  };
}

describe('orientation hint integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="ui-overlay"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('does nothing visible when booted in landscape', () => {
    const w = setupWiring({ width: 1024, height: 768 });
    expect(w.overlay.isVisible()).toBe(false);
    expect(w.pause).not.toHaveBeenCalled();
    expect(w.resume).not.toHaveBeenCalled();
    w.dispose();
  });

  it('shows the overlay and pauses immediately when booted in portrait', () => {
    const w = setupWiring({ width: 768, height: 1024 });
    expect(w.overlay.isVisible()).toBe(true);
    expect(w.pause).toHaveBeenCalledTimes(1);
    expect(w.isPortraitLocked()).toBe(true);
    w.dispose();
  });

  it('rotating to portrait pauses, hides ResumeOverlay, shows hint', () => {
    const w = setupWiring({ width: 1024, height: 768 });
    expect(w.overlay.isVisible()).toBe(false);

    w.fake.setSize(768, 1024);
    w.fake.fireOrientationChange();
    w.fake.flushTimers();

    expect(w.overlay.isVisible()).toBe(true);
    expect(w.pause).toHaveBeenCalledTimes(1);
    expect(w.hideResume).toHaveBeenCalledTimes(1);
    expect(w.resume).not.toHaveBeenCalled();
    w.dispose();
  });

  it('rotating back to landscape hides hint and resumes the loop', () => {
    const w = setupWiring({ width: 768, height: 1024 });
    expect(w.overlay.isVisible()).toBe(true);

    w.fake.setSize(1024, 768);
    w.fake.fireOrientationChange();
    w.fake.flushTimers();

    expect(w.overlay.isVisible()).toBe(false);
    expect(w.resume).toHaveBeenCalledTimes(1);
    expect(w.refreshViewport).toHaveBeenCalledTimes(1);
    expect(w.isPortraitLocked()).toBe(false);
    w.dispose();
  });

  it('does not call resume when going landscape -> landscape (no-op)', () => {
    const w = setupWiring({ width: 1024, height: 768 });
    w.resume.mockClear();

    // Landscape resize (URL bar show/hide); still landscape.
    w.fake.setSize(1100, 800);
    w.fake.fireResize();
    w.fake.flushTimers();

    expect(w.resume).not.toHaveBeenCalled();
    expect(w.pause).not.toHaveBeenCalled();
    w.dispose();
  });

  it('full rotate cycle does not double-fire resume (no double countdown)', () => {
    const w = setupWiring({ width: 1024, height: 768 });
    // Landscape -> portrait
    w.fake.setSize(768, 1024);
    w.fake.fireOrientationChange();
    w.fake.flushTimers();
    // Portrait -> landscape
    w.fake.setSize(1024, 768);
    w.fake.fireOrientationChange();
    w.fake.flushTimers();
    // Spurious extra landscape signals
    w.fake.fireResize();
    w.fake.flushTimers();
    w.fake.fireOrientationChange();
    w.fake.flushTimers();

    expect(w.pause).toHaveBeenCalledTimes(1);
    expect(w.resume).toHaveBeenCalledTimes(1);
    expect(w.showResume).not.toHaveBeenCalled();
    w.dispose();
  });

  it('overlay sits above other UI (z-index) and captures pointer events', () => {
    const w = setupWiring({ width: 768, height: 1024 });
    const el = document.querySelector('[data-orientation-hint-overlay]') as HTMLElement;
    expect(el).not.toBeNull();
    expect(el.style.pointerEvents).toBe('auto');
    expect(parseInt(el.style.zIndex, 10)).toBeGreaterThanOrEqual(30);
    w.dispose();
  });
});
