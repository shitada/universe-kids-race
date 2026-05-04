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

export interface CompanionPreviewController {
  show(entry: PlanetEncyclopediaEntry, container: HTMLElement): void;
  hide(): void;
  dispose(): void;
}

interface CompanionPreviewOptions {
  createRenderer?: (canvas: HTMLCanvasElement, devicePixelRatio: number) => RendererLike;
  createPreviewMesh?: (entry: PlanetEncyclopediaEntry) => THREE.Group;
  raf?: typeof requestAnimationFrame;
  caf?: typeof cancelAnimationFrame;
}

export function createCompanionPreviewController(
  options: CompanionPreviewOptions = {},
): CompanionPreviewController {
  const rendererFactory = options.createRenderer ?? createRenderer;
  const previewMeshFactory = options.createPreviewMesh ?? createCompanionPreviewMesh;
  const raf = options.raf ?? requestAnimationFrame;
  const caf = options.caf ?? cancelAnimationFrame;

  let disposed = false;
  let useFallback = false;
  let canvas: HTMLCanvasElement | null = null;
  let fallbackEl: HTMLDivElement | null = null;
  let renderer: RendererLike | null = null;
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let previewMesh: THREE.Group | null = null;
  let currentContainer: HTMLElement | null = null;
  let animationId: number | null = null;
  let isAnimating = false;

  const ensureCanvas = (): HTMLCanvasElement => {
    if (canvas) return canvas;
    canvas = document.createElement('canvas');
    canvas.setAttribute('data-companion-preview-canvas', '');
    canvas.style.cssText = `
      width: 100%;
      height: 100%;
      display: block;
    `;
    return canvas;
  };

  const ensureFallback = (): HTMLDivElement => {
    if (fallbackEl) return fallbackEl;
    fallbackEl = document.createElement('div');
    fallbackEl.setAttribute('data-companion-preview-fallback', '');
    fallbackEl.textContent = '👾';
    fallbackEl.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.35));
    `;
    return fallbackEl;
  };

  const stopAnimation = (): void => {
    if (!isAnimating) return;
    isAnimating = false;
    if (animationId !== null) {
      caf(animationId);
      animationId = null;
    }
  };

  const removePreviewMesh = (): void => {
    if (!scene || !previewMesh) return;
    scene.remove(previewMesh);
    disposeObject3D(previewMesh);
    previewMesh = null;
  };

  const detachDisplay = (): void => {
    currentContainer?.replaceChildren();
    canvas?.remove();
    fallbackEl?.remove();
    currentContainer = null;
  };

  const renderOnce = (): void => {
    if (!renderer || !scene || !camera) return;
    renderer.render(scene, camera);
  };

  const startAnimation = (): void => {
    if (isAnimating || !renderer || !scene || !camera || !previewMesh) return;
    isAnimating = true;

    const renderFrame = () => {
      if (!isAnimating || disposed || !renderer || !scene || !camera || !previewMesh) return;
      previewMesh.rotation.y += PREVIEW_ROTATION_SPEED;
      renderer.render(scene, camera);
      animationId = raf(renderFrame);
    };

    animationId = raf(renderFrame);
  };

  const ensureRenderer = (): boolean => {
    if (renderer && scene && camera) return true;

    const hasWebGLSupport =
      typeof window !== 'undefined'
      && (typeof window.WebGLRenderingContext !== 'undefined'
        || typeof window.WebGL2RenderingContext !== 'undefined');
    if (!hasWebGLSupport || useFallback) {
      useFallback = true;
      return false;
    }

    try {
      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, PREVIEW_DPR_CAP);
      const rendererInstance = rendererFactory(ensureCanvas(), dpr);
      rendererInstance.setPixelRatio(dpr);
      rendererInstance.setSize(PREVIEW_SIZE, PREVIEW_SIZE, false);
      rendererInstance.setClearColor(0x000000, 0);

      const sceneInstance = new THREE.Scene();
      const cameraInstance = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
      cameraInstance.position.set(0, 0.15, 3.1);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
      keyLight.position.set(2, 3, 4);
      sceneInstance.add(ambientLight, keyLight);

      renderer = rendererInstance;
      scene = sceneInstance;
      camera = cameraInstance;
      return true;
    } catch {
      canvas?.remove();
      renderer = null;
      scene = null;
      camera = null;
      useFallback = true;
      return false;
    }
  };

  return {
    show(entry, container) {
      if (disposed) return;

      stopAnimation();
      removePreviewMesh();
      currentContainer = container;

      if (!ensureRenderer()) {
        container.replaceChildren(ensureFallback());
        return;
      }

      container.replaceChildren(ensureCanvas());
      previewMesh = previewMeshFactory(entry);
      scene?.add(previewMesh);
      renderOnce();
      startAnimation();
    },

    hide() {
      if (disposed) return;
      stopAnimation();
      removePreviewMesh();
      detachDisplay();
    },

    dispose() {
      if (disposed) return;
      this.hide();
      disposed = true;
      renderer?.forceContextLoss?.();
      renderer?.dispose();
      renderer = null;
      scene = null;
      camera = null;
      canvas = null;
      fallbackEl = null;
    },
  };
}

export function mountCompanionPreview(
  container: HTMLElement,
  entry: PlanetEncyclopediaEntry,
  options: CompanionPreviewOptions = {},
): CompanionPreviewHandle {
  const controller = createCompanionPreviewController(options);
  controller.show(entry, container);
  return {
    dispose() {
      controller.dispose();
    },
  };
}
