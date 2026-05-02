import { describe, it, expect, vi } from 'vitest';
import { createRetryableModuleLoader } from '../../../src/game/utils/createRetryableModuleLoader';

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('createRetryableModuleLoader', () => {
  it('shares an in-flight load and keeps the successful module cached', async () => {
    const deferred = createDeferred<{ StageScene: string }>();
    const loadModule = vi.fn(() => deferred.promise);
    const loadWithRetry = createRetryableModuleLoader(loadModule);

    const first = loadWithRetry();
    const second = loadWithRetry();

    expect(first).toBe(second);
    expect(loadModule).toHaveBeenCalledTimes(1);

    deferred.resolve({ StageScene: 'loaded' });

    await expect(first).resolves.toEqual({ StageScene: 'loaded' });
    await expect(loadWithRetry()).resolves.toEqual({ StageScene: 'loaded' });
    expect(loadModule).toHaveBeenCalledTimes(1);
  });

  it('clears the cached promise after a failure so the next call retries', async () => {
    const loadModule = vi
      .fn<() => Promise<{ EndingScene: string }>>()
      .mockRejectedValueOnce(new Error('chunk load failed'))
      .mockResolvedValueOnce({ EndingScene: 'loaded' });
    const loadWithRetry = createRetryableModuleLoader(loadModule);

    await expect(loadWithRetry()).rejects.toThrow('chunk load failed');
    await expect(loadWithRetry()).resolves.toEqual({ EndingScene: 'loaded' });

    expect(loadModule).toHaveBeenCalledTimes(2);
  });
});
