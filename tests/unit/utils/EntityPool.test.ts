import { describe, it, expect, vi } from 'vitest';
import { EntityPool } from '../../../src/game/utils/EntityPool';

interface Dummy {
  id: number;
  x: number;
  disposed: boolean;
}

let nextId = 0;
function makeFactory() {
  nextId = 0;
  return (x: number): Dummy => ({ id: nextId++, x, disposed: false });
}

describe('EntityPool', () => {
  it('returns a freshly-built entity on first acquire', () => {
    const factory = makeFactory();
    const pool = new EntityPool<Dummy, readonly [number]>(
      factory,
      (e, x) => {
        e.x = x;
      },
    );
    const a = pool.acquire(10);
    expect(a.id).toBe(0);
    expect(a.x).toBe(10);
    expect(pool.getPoolSize()).toBe(1);
  });

  it('re-uses the same instance after release → acquire', () => {
    const factory = makeFactory();
    const resetFn = vi.fn((e: Dummy, x: number) => {
      e.x = x;
    });
    const pool = new EntityPool<Dummy, readonly [number]>(factory, resetFn);

    const a = pool.acquire(1);
    pool.release(a);
    const b = pool.acquire(2);

    expect(b).toBe(a);
    expect(b.x).toBe(2);
    expect(resetFn).toHaveBeenCalledTimes(1);
    expect(pool.getPoolSize()).toBe(1);
  });

  it('allocates a new instance for every acquire while none are released', () => {
    const factory = makeFactory();
    const pool = new EntityPool<Dummy, readonly [number]>(factory, (e, x) => {
      e.x = x;
    });
    const a = pool.acquire(1);
    const b = pool.acquire(2);
    const c = pool.acquire(3);
    expect(a).not.toBe(b);
    expect(b).not.toBe(c);
    expect(pool.getPoolSize()).toBe(3);
    expect(pool.getAvailableCount()).toBe(0);
  });

  it('invokes releaseFn on release()', () => {
    const factory = makeFactory();
    const releaseFn = vi.fn();
    const pool = new EntityPool<Dummy, readonly [number]>(
      factory,
      (e, x) => {
        e.x = x;
      },
      releaseFn,
    );
    const a = pool.acquire(7);
    pool.release(a);
    expect(releaseFn).toHaveBeenCalledTimes(1);
    expect(releaseFn).toHaveBeenCalledWith(a);
  });

  it('releaseAll returns every active entity to the available pool exactly once', () => {
    const factory = makeFactory();
    const releaseFn = vi.fn();
    const pool = new EntityPool<Dummy, readonly [number]>(
      factory,
      (e, x) => {
        e.x = x;
      },
      releaseFn,
    );
    const a = pool.acquire(1);
    const b = pool.acquire(2);
    pool.release(a);
    pool.releaseAll();
    expect(pool.getAvailableCount()).toBe(2);
    // releaseFn called once for a (explicit release) + once for b (releaseAll).
    expect(releaseFn).toHaveBeenCalledTimes(2);
  });

  it('dispose() invokes disposeFn for every ever-allocated entity and clears state', () => {
    const factory = makeFactory();
    const disposeFn = vi.fn((e: Dummy) => {
      e.disposed = true;
    });
    const pool = new EntityPool<Dummy, readonly [number]>(
      factory,
      (e, x) => {
        e.x = x;
      },
      undefined,
      disposeFn,
    );
    const a = pool.acquire(1);
    const b = pool.acquire(2);
    pool.release(a);
    pool.dispose();
    expect(disposeFn).toHaveBeenCalledTimes(2);
    expect(a.disposed).toBe(true);
    expect(b.disposed).toBe(true);
    expect(pool.getPoolSize()).toBe(0);
    expect(pool.getAvailableCount()).toBe(0);
  });

  it('treats a second release() of the same entity as a no-op', () => {
    const factory = makeFactory();
    const releaseFn = vi.fn();
    const pool = new EntityPool<Dummy, readonly [number]>(
      factory,
      (e, x) => {
        e.x = x;
      },
      releaseFn,
    );
    const a = pool.acquire(1);
    pool.release(a);
    pool.release(a);
    expect(pool.getAvailableCount()).toBe(1);
    expect(releaseFn).toHaveBeenCalledTimes(1);
  });

  it('releaseAll after release does not double-stack the same entity', () => {
    const factory = makeFactory();
    const releaseFn = vi.fn();
    const pool = new EntityPool<Dummy, readonly [number]>(
      factory,
      (e, x) => {
        e.x = x;
      },
      releaseFn,
    );
    const a = pool.acquire(1);
    pool.release(a);
    pool.releaseAll();
    expect(pool.getAvailableCount()).toBe(1);
    expect(releaseFn).toHaveBeenCalledTimes(1);
  });

  it('reuses the same instance across acquire→release→acquire cycles', () => {
    const factory = makeFactory();
    const pool = new EntityPool<Dummy, readonly [number]>(factory, (e, x) => {
      e.x = x;
    });
    const a = pool.acquire(1);
    pool.release(a);
    const b = pool.acquire(2);
    expect(b).toBe(a);
    expect(pool.getPoolSize()).toBe(1);
    expect(pool.getAvailableCount()).toBe(0);
  });

  it('dispose() with no disposeFn still clears internal state', () => {
    const pool = new EntityPool<Dummy, readonly [number]>(makeFactory(), (e, x) => {
      e.x = x;
    });
    pool.acquire(1);
    pool.acquire(2);
    pool.dispose();
    expect(pool.getPoolSize()).toBe(0);
    expect(pool.getAvailableCount()).toBe(0);
  });
});
