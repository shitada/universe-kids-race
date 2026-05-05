import { describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import {
  ColorVisionPostProcessor,
  getActiveColorVisionSupportMode,
  setActiveColorVisionSupportMode,
} from '../../../src/game/effects/ColorVisionPostProcessor';

describe('ColorVisionPostProcessor', () => {
  it('renders directly when the selected mode does not use a filter', () => {
    const renderer = {
      render: vi.fn(),
      setRenderTarget: vi.fn(),
    };
    const postProcessor = new ColorVisionPostProcessor(renderer);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    postProcessor.setMode('color-and-marks');
    postProcessor.render(scene, camera);

    expect(renderer.setRenderTarget).toHaveBeenCalledWith(null);
    expect(renderer.render).toHaveBeenCalledTimes(1);
    expect(renderer.render).toHaveBeenCalledWith(scene, camera);
    postProcessor.dispose();
  });

  it('renders through an offscreen pass for filter modes', () => {
    const renderer = {
      render: vi.fn(),
      setRenderTarget: vi.fn(),
    };
    const postProcessor = new ColorVisionPostProcessor(renderer);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    postProcessor.setSize(640, 360);
    postProcessor.setMode('tritanopia-filter');
    postProcessor.render(scene, camera);

    expect(renderer.setRenderTarget).toHaveBeenNthCalledWith(1, expect.any(THREE.WebGLRenderTarget));
    expect(renderer.setRenderTarget).toHaveBeenNthCalledWith(2, null);
    expect(renderer.render).toHaveBeenCalledTimes(2);
    expect(renderer.render).toHaveBeenNthCalledWith(1, scene, camera);
    postProcessor.dispose();
  });

  it('shares the active mode across scenes', () => {
    setActiveColorVisionSupportMode('deuteranopia-filter');
    expect(getActiveColorVisionSupportMode()).toBe('deuteranopia-filter');
    setActiveColorVisionSupportMode('color-only');
  });
});
