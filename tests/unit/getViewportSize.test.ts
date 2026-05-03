// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import {
  getViewportSize,
  subscribeViewportResize,
  updateViewportSizeCache,
} from '../../src/game/utils/getViewportSize';

function makeEventTarget() {
  const listeners = new Map<string, Set<() => void>>();
  return {
    addEventListener: vi.fn((type: string, l: () => void) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(l);
    }),
    removeEventListener: vi.fn((type: string, l: () => void) => {
      listeners.get(type)?.delete(l);
    }),
    dispatch(type: string): void {
      listeners.get(type)?.forEach((l) => l());
    },
    listenerCount(type: string): number {
      return listeners.get(type)?.size ?? 0;
    },
  };
}

function setWindowSize(width: number, height: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
}

function setVisualViewport(width: number, height: number): void {
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: { width, height, addEventListener: () => {}, removeEventListener: () => {} },
  });
}

function clearVisualViewport(): void {
  Object.defineProperty(window, 'visualViewport', { configurable: true, value: undefined });
}

describe('getViewportSize', () => {
  it('prefers visualViewport.width/height when available', () => {
    const win = {
      innerWidth: 1024,
      innerHeight: 768,
      visualViewport: { width: 800, height: 500 },
    };
    expect(getViewportSize(win)).toEqual({ width: 800, height: 500 });
  });

  it('falls back to innerWidth/innerHeight when visualViewport is missing', () => {
    const win = { innerWidth: 1024, innerHeight: 768 };
    expect(getViewportSize(win)).toEqual({ width: 1024, height: 768 });
  });

  it('falls back when visualViewport is null', () => {
    const win = { innerWidth: 640, innerHeight: 480, visualViewport: null };
    expect(getViewportSize(win)).toEqual({ width: 640, height: 480 });
  });

  it('falls back when visualViewport reports zero/invalid dimensions', () => {
    const win = {
      innerWidth: 320,
      innerHeight: 200,
      visualViewport: { width: 0, height: NaN },
    };
    expect(getViewportSize(win)).toEqual({ width: 320, height: 200 });
  });

  it('caches the global viewport until explicitly refreshed', () => {
    setWindowSize(1024, 768);
    setVisualViewport(900, 600);

    expect(updateViewportSizeCache()).toEqual({ width: 900, height: 600 });
    expect(getViewportSize()).toEqual({ width: 900, height: 600 });

    setWindowSize(2048, 1536);
    setVisualViewport(800, 500);

    expect(getViewportSize()).toEqual({ width: 900, height: 600 });
    expect(updateViewportSizeCache()).toEqual({ width: 800, height: 500 });
    expect(getViewportSize()).toEqual({ width: 800, height: 500 });

    clearVisualViewport();
  });
});

describe('subscribeViewportResize', () => {
  it('registers resize/orientationchange on window and resize/scroll on visualViewport', () => {
    const winET = makeEventTarget();
    const vvET = makeEventTarget();
    const win = Object.assign(winET, {
      innerWidth: 100,
      innerHeight: 100,
      visualViewport: Object.assign(vvET, { width: 100, height: 100 }),
    });
    const onResize = vi.fn();

    subscribeViewportResize(win as never, onResize);

    expect(winET.listenerCount('resize')).toBe(1);
    expect(winET.listenerCount('orientationchange')).toBe(1);
    expect(vvET.listenerCount('resize')).toBe(1);
    expect(vvET.listenerCount('scroll')).toBe(1);
  });

  it('invokes onResize when window resize event fires', () => {
    const winET = makeEventTarget();
    const win = Object.assign(winET, {
      innerWidth: 100,
      innerHeight: 100,
      visualViewport: null,
    });
    const onResize = vi.fn();

    subscribeViewportResize(win as never, onResize);
    win.dispatch('resize');
    win.dispatch('orientationchange');
    expect(onResize).toHaveBeenCalledTimes(2);
  });

  it('invokes onResize when visualViewport resize/scroll fires', () => {
    const winET = makeEventTarget();
    const vvET = makeEventTarget();
    const win = Object.assign(winET, {
      innerWidth: 100,
      innerHeight: 100,
      visualViewport: Object.assign(vvET, { width: 100, height: 100 }),
    });
    const onResize = vi.fn();

    subscribeViewportResize(win as never, onResize);
    vvET.dispatch('resize');
    vvET.dispatch('scroll');
    expect(onResize).toHaveBeenCalledTimes(2);
  });

  it('does not register on visualViewport when missing', () => {
    const winET = makeEventTarget();
    const win = Object.assign(winET, {
      innerWidth: 100,
      innerHeight: 100,
    });
    const onResize = vi.fn();

    expect(() => subscribeViewportResize(win as never, onResize)).not.toThrow();
    expect(winET.listenerCount('resize')).toBe(1);
  });

  it('returned dispose removes all listeners', () => {
    const winET = makeEventTarget();
    const vvET = makeEventTarget();
    const win = Object.assign(winET, {
      innerWidth: 100,
      innerHeight: 100,
      visualViewport: Object.assign(vvET, { width: 100, height: 100 }),
    });
    const onResize = vi.fn();

    const dispose = subscribeViewportResize(win as never, onResize);
    dispose();

    expect(winET.listenerCount('resize')).toBe(0);
    expect(winET.listenerCount('orientationchange')).toBe(0);
    expect(vvET.listenerCount('resize')).toBe(0);
    expect(vvET.listenerCount('scroll')).toBe(0);

    win.dispatch('resize');
    vvET.dispatch('resize');
    expect(onResize).not.toHaveBeenCalled();
  });
});
