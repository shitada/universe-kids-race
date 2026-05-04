// @vitest-environment jsdom
import * as THREE from 'three';
import { describe, it, expect, vi } from 'vitest';
import { PLANET_ENCYCLOPEDIA } from '../../../src/game/config/PlanetEncyclopedia';
import { createCompanionPreviewController } from '../../../src/ui/CompanionPreview';

describe('createCompanionPreviewController', () => {
  it('reuses one renderer across sequential detail shows', () => {
    const firstHost = document.createElement('div');
    const secondHost = document.createElement('div');
    const originalWebGLRenderingContext = window.WebGLRenderingContext;
    const createRenderer = vi.fn();
    const render = vi.fn();
    const setPixelRatio = vi.fn();
    const setSize = vi.fn();
    const setClearColor = vi.fn();
    const dispose = vi.fn();
    const forceContextLoss = vi.fn();
    const cancelAnimationFrameSpy = vi.fn();
    let frameId = 0;
    let frame: FrameRequestCallback | null = null;

    const createPreviewMesh = vi.fn((entry) => {
      const group = new THREE.Group();
      group.name = String(entry.stageNumber);
      return group;
    });

    Object.defineProperty(window, 'WebGLRenderingContext', {
      configurable: true,
      value: function WebGLRenderingContext() {},
    });

    try {
      createRenderer.mockImplementation(() => ({
        setPixelRatio,
        setSize,
        setClearColor,
        render,
        dispose,
        forceContextLoss,
      }));

      const controller = createCompanionPreviewController({
        createRenderer,
        createPreviewMesh,
        raf: (cb) => {
          frame = cb;
          frameId += 1;
          return frameId;
        },
        caf: cancelAnimationFrameSpy,
      });

      controller.show(PLANET_ENCYCLOPEDIA[0], firstHost);
      const firstCanvas = firstHost.querySelector('[data-companion-preview-canvas]');

      expect(firstCanvas).not.toBeNull();
      expect(createRenderer).toHaveBeenCalledTimes(1);
      expect(createPreviewMesh).toHaveBeenCalledTimes(1);
      expect(setPixelRatio).toHaveBeenCalledWith(1);
      expect(setSize).toHaveBeenCalledWith(120, 120, false);
      expect(setClearColor).toHaveBeenCalledWith(0x000000, 0);
      expect(render).toHaveBeenCalledTimes(1);

      controller.hide();
      expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(1);
      expect(firstHost.querySelector('[data-companion-preview-canvas]')).toBeNull();
      expect(dispose).not.toHaveBeenCalled();
      expect(forceContextLoss).not.toHaveBeenCalled();

      controller.show(PLANET_ENCYCLOPEDIA[1], secondHost);
      const secondCanvas = secondHost.querySelector('[data-companion-preview-canvas]');

      expect(createRenderer).toHaveBeenCalledTimes(1);
      expect(createPreviewMesh).toHaveBeenCalledTimes(2);
      expect(secondCanvas).toBe(firstCanvas);
      expect(render).toHaveBeenCalledTimes(2);

      controller.dispose();
      expect(forceContextLoss).toHaveBeenCalledTimes(1);
      expect(dispose).toHaveBeenCalledTimes(1);
    } finally {
      Object.defineProperty(window, 'WebGLRenderingContext', {
        configurable: true,
        value: originalWebGLRenderingContext,
      });
    }
  });

  it('stops the render loop while hidden', () => {
    const host = document.createElement('div');
    const originalWebGLRenderingContext = window.WebGLRenderingContext;
    const render = vi.fn();
    const setPixelRatio = vi.fn();
    const setSize = vi.fn();
    const setClearColor = vi.fn();
    const dispose = vi.fn();
    const forceContextLoss = vi.fn();
    const cancelAnimationFrameSpy = vi.fn();
    let frameId = 0;
    let frame: FrameRequestCallback | null = null;

    Object.defineProperty(window, 'WebGLRenderingContext', {
      configurable: true,
      value: function WebGLRenderingContext() {},
    });

    try {
      const controller = createCompanionPreviewController({
        createRenderer: () => ({
          setPixelRatio,
          setSize,
          setClearColor,
          render,
          dispose,
          forceContextLoss,
        }),
        createPreviewMesh: () => new THREE.Group(),
        raf: (cb) => {
          frame = cb;
          frameId += 1;
          return frameId;
        },
        caf: cancelAnimationFrameSpy,
      });

      controller.show(PLANET_ENCYCLOPEDIA[0], host);
      expect(render).toHaveBeenCalledTimes(1);

      frame?.(16);
      expect(render).toHaveBeenCalledTimes(2);

      controller.hide();
      expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(2);

      frame?.(32);
      expect(render).toHaveBeenCalledTimes(2);

      controller.dispose();
    } finally {
      Object.defineProperty(window, 'WebGLRenderingContext', {
        configurable: true,
        value: originalWebGLRenderingContext,
      });
    }
  });

  it('falls back to a static emoji when WebGL setup fails', () => {
    const host = document.createElement('div');

    const controller = createCompanionPreviewController({
      createRenderer: () => {
        throw new Error('webgl unavailable');
      },
    });
    controller.show(PLANET_ENCYCLOPEDIA[0], host);

    const fallback = host.querySelector('[data-companion-preview-fallback]') as HTMLElement | null;
    expect(fallback).not.toBeNull();
    expect(fallback?.textContent).toBe('👾');
    expect(host.querySelector('[data-companion-preview-canvas]')).toBeNull();

    controller.dispose();
    expect(host.querySelector('[data-companion-preview-fallback]')).toBeNull();
  });
});
