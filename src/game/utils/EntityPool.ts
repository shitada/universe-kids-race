/**
 * Minimal object pool for short-lived game entities.
 *
 * Design intent (per ParticleBurst.ts pool pattern):
 * - Allocate with `factory(...args)` only when the available pool is empty.
 * - Re-use idle instances via `resetFn(entity, ...args)` when `acquire()` is
 *   called and an instance has previously been released.
 * - `release(entity)` returns an instance to the pool; the optional
 *   `releaseFn` lets the caller detach the entity from a scene graph or
 *   otherwise prepare it for re-use.
 * - `dispose()` is a permanent shutdown hook: the optional `disposeFn` is
 *   invoked once per ever-created instance so GPU resources can be freed.
 *
 * The pool intentionally has no upper bound: in practice the steady-state
 * size matches the maximum number of entities concurrently visible on screen,
 * which is bounded by the StageScene spawn cadence.
 */
export class EntityPool<T, A extends readonly unknown[] = readonly []> {
  private readonly available: T[] = [];
  private readonly all: T[] = [];

  constructor(
    private readonly factory: (...args: A) => T,
    private readonly resetFn: (entity: T, ...args: A) => void,
    private readonly releaseFn?: (entity: T) => void,
    private readonly disposeFn?: (entity: T) => void,
  ) {}

  acquire(...args: A): T {
    const reused = this.available.pop();
    if (reused !== undefined) {
      this.resetFn(reused, ...args);
      return reused;
    }
    const created = this.factory(...args);
    this.all.push(created);
    return created;
  }

  release(entity: T): void {
    this.releaseFn?.(entity);
    this.available.push(entity);
  }

  releaseAll(): void {
    for (const entity of this.all) {
      if (!this.available.includes(entity)) {
        this.releaseFn?.(entity);
        this.available.push(entity);
      }
    }
  }

  dispose(): void {
    if (this.disposeFn) {
      for (const entity of this.all) {
        this.disposeFn(entity);
      }
    }
    this.all.length = 0;
    this.available.length = 0;
  }

  /** Diagnostic: total instances ever allocated by this pool. */
  getPoolSize(): number {
    return this.all.length;
  }

  /** Diagnostic: instances currently sitting idle in the pool. */
  getAvailableCount(): number {
    return this.available.length;
  }
}
