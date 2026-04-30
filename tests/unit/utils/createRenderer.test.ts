import { describe, it, expect, vi, beforeEach } from 'vitest';

const webGLRendererSpy = vi.fn();

vi.mock('three', () => {
  return {
    WebGLRenderer: vi.fn().mockImplementation((options: unknown) => {
      webGLRendererSpy(options);
      return { options };
    }),
  };
});

import { createRenderer } from '../../../src/game/utils/createRenderer';

describe('createRenderer', () => {
  beforeEach(() => {
    webGLRendererSpy.mockClear();
  });

  it('disables MSAA on high-DPR displays while always disabling stencil and requesting high-performance GPU', () => {
    const canvas = {} as HTMLCanvasElement;
    createRenderer(canvas, 2.0);
    expect(webGLRendererSpy).toHaveBeenCalledTimes(1);
    expect(webGLRendererSpy).toHaveBeenCalledWith({
      canvas,
      antialias: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
  });

  it('enables MSAA on low-DPR displays while always disabling stencil and requesting high-performance GPU', () => {
    const canvas = {} as HTMLCanvasElement;
    createRenderer(canvas, 1.0);
    expect(webGLRendererSpy).toHaveBeenCalledTimes(1);
    expect(webGLRendererSpy).toHaveBeenCalledWith({
      canvas,
      antialias: true,
      stencil: false,
      powerPreference: 'high-performance',
    });
  });

  it('treats DPR exactly equal to 2 as high-DPR (no MSAA)', () => {
    const canvas = {} as HTMLCanvasElement;
    createRenderer(canvas, 2);
    expect(webGLRendererSpy).toHaveBeenCalledWith(
      expect.objectContaining({ antialias: false, stencil: false, powerPreference: 'high-performance' }),
    );
  });
});
