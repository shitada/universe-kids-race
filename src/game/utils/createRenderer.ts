import { WebGLRenderer } from 'three';

/**
 * Creates a WebGLRenderer with options tuned for iPad Safari 60fps
 * (Constitution IV). Disables the unused stencil buffer to save VRAM and
 * frame-buffer bandwidth, and hints the platform to pick the high-performance
 * GPU path. MSAA is enabled only on low-DPR displays where the fillrate cost
 * is acceptable.
 */
export function createRenderer(
  canvas: HTMLCanvasElement,
  devicePixelRatio: number = typeof window !== 'undefined' ? window.devicePixelRatio : 1,
): WebGLRenderer {
  const useMSAA = (devicePixelRatio ?? 1) < 2;
  return new WebGLRenderer({
    canvas,
    antialias: useMSAA,
    stencil: false,
    powerPreference: 'high-performance',
  });
}
