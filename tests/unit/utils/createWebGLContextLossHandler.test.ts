// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { createWebGLContextLossHandler } from '../../../src/game/utils/createWebGLContextLossHandler';

function makeCanvas(): HTMLCanvasElement {
  return document.createElement('canvas');
}

describe('createWebGLContextLossHandler', () => {
  it('calls onLost and preventDefault when webglcontextlost fires', () => {
    const canvas = makeCanvas();
    const onLost = vi.fn();
    const onRestored = vi.fn();
    createWebGLContextLossHandler(canvas, { onLost, onRestored });

    const event = new Event('webglcontextlost', { cancelable: true });
    canvas.dispatchEvent(event);

    expect(onLost).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
    expect(onRestored).not.toHaveBeenCalled();
  });

  it('calls onRestored when webglcontextrestored fires', () => {
    const canvas = makeCanvas();
    const onLost = vi.fn();
    const onRestored = vi.fn();
    createWebGLContextLossHandler(canvas, { onLost, onRestored });

    canvas.dispatchEvent(new Event('webglcontextrestored'));

    expect(onRestored).toHaveBeenCalledTimes(1);
    expect(onLost).not.toHaveBeenCalled();
  });

  it('teardown removes both listeners', () => {
    const canvas = makeCanvas();
    const onLost = vi.fn();
    const onRestored = vi.fn();
    const teardown = createWebGLContextLossHandler(canvas, { onLost, onRestored });

    teardown();

    canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
    canvas.dispatchEvent(new Event('webglcontextrestored'));

    expect(onLost).not.toHaveBeenCalled();
    expect(onRestored).not.toHaveBeenCalled();
  });

  it('handles repeated lost/restored cycles', () => {
    const canvas = makeCanvas();
    const onLost = vi.fn();
    const onRestored = vi.fn();
    createWebGLContextLossHandler(canvas, { onLost, onRestored });

    for (let i = 0; i < 3; i++) {
      canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
      canvas.dispatchEvent(new Event('webglcontextrestored'));
    }

    expect(onLost).toHaveBeenCalledTimes(3);
    expect(onRestored).toHaveBeenCalledTimes(3);
  });
});
