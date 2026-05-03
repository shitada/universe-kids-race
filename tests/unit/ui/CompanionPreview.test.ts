// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { PLANET_ENCYCLOPEDIA } from '../../../src/game/config/PlanetEncyclopedia';
import { mountCompanionPreview } from '../../../src/ui/CompanionPreview';

describe('mountCompanionPreview', () => {
  it('mounts a canvas preview and disposes renderer resources', () => {
    const host = document.createElement('div');
    const originalWebGLRenderingContext = window.WebGLRenderingContext;
    const render = vi.fn();
    const setPixelRatio = vi.fn();
    const setSize = vi.fn();
    const setClearColor = vi.fn();
    const dispose = vi.fn();
    const forceContextLoss = vi.fn();
    const cancelAnimationFrameSpy = vi.fn();
    let frame: FrameRequestCallback | null = null;

    Object.defineProperty(window, 'WebGLRenderingContext', {
      configurable: true,
      value: function WebGLRenderingContext() {},
    });

    try {
      const handle = mountCompanionPreview(host, PLANET_ENCYCLOPEDIA[0], {
        createRenderer: () => ({
          setPixelRatio,
          setSize,
          setClearColor,
          render,
          dispose,
          forceContextLoss,
        }),
        raf: (cb) => {
          frame = cb;
          return 77;
        },
        caf: cancelAnimationFrameSpy,
      });

      expect(host.querySelector('[data-companion-preview-canvas]')).not.toBeNull();
      expect(setPixelRatio).toHaveBeenCalledWith(1);
      expect(setSize).toHaveBeenCalledWith(120, 120, false);
      expect(setClearColor).toHaveBeenCalledWith(0x000000, 0);
      expect(render).toHaveBeenCalledTimes(1);

      frame?.(16);
      expect(render).toHaveBeenCalledTimes(2);

      handle.dispose();
      expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(77);
      expect(forceContextLoss).toHaveBeenCalledTimes(1);
      expect(dispose).toHaveBeenCalledTimes(1);
      expect(host.querySelector('[data-companion-preview-canvas]')).toBeNull();
    } finally {
      Object.defineProperty(window, 'WebGLRenderingContext', {
        configurable: true,
        value: originalWebGLRenderingContext,
      });
    }
  });

  it('falls back to a static emoji when WebGL setup fails', () => {
    const host = document.createElement('div');

    const handle = mountCompanionPreview(host, PLANET_ENCYCLOPEDIA[0], {
      createRenderer: () => {
        throw new Error('webgl unavailable');
      },
    });

    const fallback = host.querySelector('[data-companion-preview-fallback]') as HTMLElement | null;
    expect(fallback).not.toBeNull();
    expect(fallback?.textContent).toBe('👾');
    expect(host.querySelector('[data-companion-preview-canvas]')).toBeNull();

    handle.dispose();
    expect(host.querySelector('[data-companion-preview-fallback]')).toBeNull();
  });
});
