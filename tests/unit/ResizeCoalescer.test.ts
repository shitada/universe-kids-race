import { describe, it, expect, vi } from 'vitest';
import { createResizeCoalescer } from '../../src/game/utils/ResizeCoalescer';

function createFakeRaf() {
  let queued: FrameRequestCallback | null = null;
  let nextHandle = 1;
  let lastHandle = 0;
  const raf = (cb: FrameRequestCallback): number => {
    queued = cb;
    lastHandle = nextHandle++;
    return lastHandle;
  };
  const caf = vi.fn((handle: number): void => {
    if (handle === lastHandle) {
      queued = null;
    }
  });
  function tick(): void {
    const cb = queued;
    queued = null;
    if (cb) cb(performance.now());
  }
  return { raf, caf, tick, hasQueued: () => queued !== null };
}

describe('createResizeCoalescer', () => {
  it('coalesces many schedule() calls into a single apply per frame', () => {
    const apply = vi.fn();
    const { raf, caf, tick } = createFakeRaf();
    const c = createResizeCoalescer(apply, raf, caf);

    for (let i = 0; i < 100; i++) {
      c.schedule(800, 600);
    }
    expect(apply).not.toHaveBeenCalled();
    tick();
    expect(apply).toHaveBeenCalledTimes(1);
    expect(apply).toHaveBeenCalledWith(800, 600);
  });

  it('uses the latest scheduled size when values differ within one frame', () => {
    const apply = vi.fn();
    const { raf, caf, tick } = createFakeRaf();
    const c = createResizeCoalescer(apply, raf, caf);

    c.schedule(100, 200);
    c.schedule(300, 400);
    c.schedule(500, 600);
    tick();
    expect(apply).toHaveBeenCalledTimes(1);
    expect(apply).toHaveBeenCalledWith(500, 600);
  });

  it('skips apply when the next scheduled size equals the previously applied size', () => {
    const apply = vi.fn();
    const { raf, caf, tick } = createFakeRaf();
    const c = createResizeCoalescer(apply, raf, caf);

    c.schedule(800, 600);
    tick();
    expect(apply).toHaveBeenCalledTimes(1);

    c.schedule(800, 600);
    tick();
    expect(apply).toHaveBeenCalledTimes(1);

    c.schedule(801, 600);
    tick();
    expect(apply).toHaveBeenCalledTimes(2);
    expect(apply).toHaveBeenLastCalledWith(801, 600);
  });

  it('flush() applies pending size synchronously and cancels pending rAF', () => {
    const apply = vi.fn();
    const { raf, caf, hasQueued } = createFakeRaf();
    const c = createResizeCoalescer(apply, raf, caf);

    c.schedule(640, 480);
    expect(hasQueued()).toBe(true);
    c.flush();
    expect(apply).toHaveBeenCalledTimes(1);
    expect(apply).toHaveBeenCalledWith(640, 480);
    expect(caf).toHaveBeenCalled();
    expect(hasQueued()).toBe(false);
  });

  it('flush() with no pending schedule is a no-op', () => {
    const apply = vi.fn();
    const { raf, caf } = createFakeRaf();
    const c = createResizeCoalescer(apply, raf, caf);

    c.flush();
    expect(apply).not.toHaveBeenCalled();
  });

  it('dispose() prevents further apply calls', () => {
    const apply = vi.fn();
    const { raf, caf, tick } = createFakeRaf();
    const c = createResizeCoalescer(apply, raf, caf);

    c.schedule(800, 600);
    c.dispose();
    tick();
    expect(apply).not.toHaveBeenCalled();

    c.schedule(1024, 768);
    tick();
    expect(apply).not.toHaveBeenCalled();
  });
});
