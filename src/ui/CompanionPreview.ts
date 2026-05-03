import * as THREE from 'three';
import type { PlanetEncyclopediaEntry } from '../types';
import { createCompanionPreviewMesh } from '../game/entities/CompanionMeshFactory';
import { createRenderer } from '../game/utils/createRenderer';
import { disposeObject3D } from '../game/utils/disposeObject3D';

const PREVIEW_SIZE = 120;
const PREVIEW_DPR_CAP = 1.5;
const PREVIEW_ROTATION_SPEED = 0.015;

type RendererLike = Pick<
  THREE.WebGLRenderer,
  'setPixelRatio' | 'setSize' | 'setClearColor' | 'render' | 'dispose'
> & Partial<Pick<THREE.WebGLRenderer, 'forceContextLoss'>>;

export interface CompanionPreviewHandle {
  dispose(): void;
}

interface CompanionPreviewOptions {
  createRenderer?: (canvas: HTMLCanvasElement, devicePixelRatio: number) => RendererLike;
  raf?: typeof requestAnimationFrame;
  caf?: typeof cancelAnimationFrame;
}

export function mountCompanionPreview(
  container: HTMLElement,
  entry: PlanetEncyclopediaEntry,
  options: CompanionPreviewOptions = {},
): CompanionPreviewHandle {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('data-companion-preview-canvas', '');
  canvas.style.cssText = `
    width: 100%;
    height: 100%;
    display: block;
  `;
  container.appendChild(canvas);

  const fallbackToEmoji = (): CompanionPreviewHandle => {
    canvas.remove();
    const fallback = document.createElement('div');
    fallback.setAttribute('data-companion-preview-fallback', '');
    fallback.textContent = '👾';
    fallback.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.35));
    `;
    container.appendChild(fallback);
    return {
      dispose() {
        fallback.remove();
      },
    };
  };

  const hasWebGLSupport =
    typeof window !== 'undefined'
    && (typeof window.WebGLRenderingContext !== 'undefined'
      || typeof window.WebGL2RenderingContext !== 'undefined');
  if (!hasWebGLSupport) {
    return fallbackToEmoji();
  }

  let renderer: RendererLike | null = null;
  let previewMesh: THREE.Group | null = null;
  try {
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, PREVIEW_DPR_CAP);
    const rendererFactory = options.createRenderer ?? createRenderer;
    renderer = rendererFactory(canvas, dpr);

    renderer.setPixelRatio(dpr);
    renderer.setSize(PREVIEW_SIZE, PREVIEW_SIZE, false);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
    camera.position.set(0, 0.15, 3.1);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(2, 3, 4);
    scene.add(ambientLight, keyLight);

    previewMesh = createCompanionPreviewMesh(entry);
    scene.add(previewMesh);

    const rendererInstance = renderer;
    const previewMeshInstance = previewMesh;

    let disposed = false;
    let animationId = 0;
    const raf = options.raf ?? requestAnimationFrame;
    const caf = options.caf ?? cancelAnimationFrame;

    const renderFrame = () => {
      if (disposed) return;
      previewMeshInstance.rotation.y += PREVIEW_ROTATION_SPEED;
      rendererInstance.render(scene, camera);
      animationId = raf(renderFrame);
    };

    rendererInstance.render(scene, camera);
    animationId = raf(renderFrame);

    return {
      dispose() {
        if (disposed) return;
        disposed = true;
        caf(animationId);
        disposeObject3D(previewMeshInstance);
        rendererInstance.forceContextLoss?.();
        rendererInstance.dispose();
        canvas.remove();
      },
    };
  } catch {
    if (previewMesh) {
      disposeObject3D(previewMesh);
    }
    renderer?.forceContextLoss?.();
    renderer?.dispose();
    return fallbackToEmoji();
  }
}
