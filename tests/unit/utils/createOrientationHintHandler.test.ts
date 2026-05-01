// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createOrientationHintHandler,
  isPortraitViewport,
} from '../../../src/game/utils/createOrientationHintHandler';

interface FakeMQL {
  matches: boolean;
  listeners: Array<() => void>;
  addEventListener: (event: 'change', cb: () => void) => void;
  removeEventListener: (event: 'change', cb: () => void) => void;
  dispatch: () => void;
}

function makeFakeWindow(initial: { width: number; height: number }) {
  const listeners = new Map<string, Set<() => void>>();
  const mql: FakeMQL = {
    matches: initial.height > initial.width,
    listeners: [],
    addEventListener: (_event, cb) => {
      mql.listeners.push(cb);
    },
    removeEventListener: (_event, cb) => {
      mql.listeners = mql.listeners.filter((l) => l !== cb);
    },
    dispatch: () => {
      mql.listeners.slice().forEach((l) => l());
    },
  };
  let nextHandle = 1;
  const timers = new Map<number, () => void>();
  const win = {
    innerWidth: initial.width,
    innerHeight: initial.height,
    matchMedia: (query: string) => {
      // Always return the same instance so the test can flip `matches`.
      void query;
      return mql as unknown as MediaQueryList;
    },
    addEventListener: (event: string, cb: () => void) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(cb);
    },
    removeEventListener: (event: string, cb: () => void) => {
      listeners.get(event)?.delete(cb);
    },
    setTimeout: (cb: () => void, _ms: number): number => {
      const handle = nextHandle++;
      timers.set(handle, cb);
      return handle;
    },
    clearTimeout: (handle: number) => {
      timers.delete(handle);
    },
  } as unknown as Window;

  return {
    win,
    mql,
    fireResize: () => listeners.get('resize')?.forEach((cb) => cb()),
    fireOrientationChange: () =>
      listeners.get('orientationchange')?.forEach((cb) => cb()),
    flushTimers: () => {
      const pending = Array.from(timers.values());
      timers.clear();
      pending.forEach((cb) => cb());
    },
    setSize: (width: number, height: number) => {
      (win as { innerWidth: number; innerHeight: number }).innerWidth = width;
      (win as { innerWidth: number; innerHeight: number }).innerHeight = height;
      mql.matches = height > width;
    },
    listenerCount: (event: string) => listeners.get(event)?.size ?? 0,
    mqlListenerCount: () => mql.listeners.length,
  };
}

describe('isPortraitViewport', () => {
  it('returns true when height > width', () => {
    const fake = makeFakeWindow({ width: 768, height: 1024 });
    expect(isPortraitViewport(fake.win)).toBe(true);
  });

  it('returns false when width > height', () => {
    const fake = makeFakeWindow({ width: 1024, height: 768 });
    expect(isPortraitViewport(fake.win)).toBe(false);
  });

  it('falls back to viewport size when matchMedia is missing', () => {
    const fake = makeFakeWindow({ width: 600, height: 900 });
    (fake.win as unknown as { matchMedia: undefined }).matchMedia = undefined;
    expect(isPortraitViewport(fake.win)).toBe(true);
  });

  it('falls back to viewport size when matchMedia disagrees mid-rotation', () => {
    // Safari quirk: matchMedia still says portrait but the viewport is
    // already landscape. Trust what the user actually sees.
    const fake = makeFakeWindow({ width: 1024, height: 768 });
    fake.mql.matches = true;
    expect(isPortraitViewport(fake.win)).toBe(false);
  });
});

describe('createOrientationHintHandler', () => {
  let onPortrait: ReturnType<typeof vi.fn>;
  let onLandscape: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onPortrait = vi.fn();
    onLandscape = vi.fn();
  });

  it('dispatches onLandscape on the initial evaluate() when landscape', () => {
    const fake = makeFakeWindow({ width: 1024, height: 768 });
    const handler = createOrientationHintHandler({
      win: fake.win,
      onPortrait,
      onLandscape,
    });
    handler.evaluate();
    expect(onLandscape).toHaveBeenCalledTimes(1);
    expect(onPortrait).not.toHaveBeenCalled();
    handler.dispose();
  });

  it('dispatches onPortrait on the initial evaluate() when portrait', () => {
    const fake = makeFakeWindow({ width: 768, height: 1024 });
    const handler = createOrientationHintHandler({
      win: fake.win,
      onPortrait,
      onLandscape,
    });
    handler.evaluate();
    expect(onPortrait).toHaveBeenCalledTimes(1);
    expect(onLandscape).not.toHaveBeenCalled();
    handler.dispose();
  });

  it('emits portrait when matchMedia change fires after rotation', () => {
    const fake = makeFakeWindow({ width: 1024, height: 768 });
    const handler = createOrientationHintHandler({
      win: fake.win,
      onPortrait,
      onLandscape,
    });
    handler.evaluate();
    onLandscape.mockClear();

    fake.setSize(768, 1024);
    fake.mql.dispatch();
    fake.flushTimers();

    expect(onPortrait).toHaveBeenCalledTimes(1);
    expect(onLandscape).not.toHaveBeenCalled();
    handler.dispose();
  });

  it('emits landscape when rotating back', () => {
    const fake = makeFakeWindow({ width: 768, height: 1024 });
    const handler = createOrientationHintHandler({
      win: fake.win,
      onPortrait,
      onLandscape,
    });
    handler.evaluate();
    onPortrait.mockClear();

    fake.setSize(1024, 768);
    fake.fireOrientationChange();
    fake.flushTimers();

    expect(onLandscape).toHaveBeenCalledTimes(1);
    handler.dispose();
  });

  it('debounces multiple events into a single dispatch', () => {
    const fake = makeFakeWindow({ width: 1024, height: 768 });
    const handler = createOrientationHintHandler({
      win: fake.win,
      onPortrait,
      onLandscape,
    });
    handler.evaluate();
    onLandscape.mockClear();

    fake.setSize(768, 1024);
    fake.fireResize();
    fake.fireResize();
    fake.fireOrientationChange();
    fake.mql.dispatch();
    fake.flushTimers();

    expect(onPortrait).toHaveBeenCalledTimes(1);
    handler.dispose();
  });

  it('does not re-dispatch when state has not changed', () => {
    const fake = makeFakeWindow({ width: 1024, height: 768 });
    const handler = createOrientationHintHandler({
      win: fake.win,
      onPortrait,
      onLandscape,
    });
    handler.evaluate();
    onLandscape.mockClear();

    // Still landscape; size only nudged.
    fake.setSize(1100, 800);
    fake.fireResize();
    fake.flushTimers();

    expect(onLandscape).not.toHaveBeenCalled();
    expect(onPortrait).not.toHaveBeenCalled();
    handler.dispose();
  });

  it('dispose() detaches all listeners and cancels pending dispatch', () => {
    const fake = makeFakeWindow({ width: 1024, height: 768 });
    const handler = createOrientationHintHandler({
      win: fake.win,
      onPortrait,
      onLandscape,
    });
    handler.evaluate();
    onLandscape.mockClear();

    // Schedule a pending dispatch then dispose before the timer fires.
    fake.setSize(768, 1024);
    fake.fireResize();
    handler.dispose();
    fake.flushTimers();

    expect(onPortrait).not.toHaveBeenCalled();
    expect(fake.listenerCount('resize')).toBe(0);
    expect(fake.listenerCount('orientationchange')).toBe(0);
    expect(fake.mqlListenerCount()).toBe(0);
  });
});
