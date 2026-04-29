import * as THREE from 'three';
import type { Scene, SceneContext } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { SaveManager } from '../storage/SaveManager';
import type { AudioManager } from '../audio/AudioManager';
import { TutorialOverlay } from '../../ui/TutorialOverlay';
import { EncyclopediaOverlay } from '../../ui/EncyclopediaOverlay';
import { TOTAL_STAGES } from '../config/StageConfig';

// ──────────────────────────────────────────────────────────────────────────────
// SHARED background-star resources for TitleScene
//
// `enter()` は毎回 `Float32Array(3000)` の `BufferGeometry` と
// `PointsMaterial` を新規生成していたが、対応する `exit()` で dispose されず
// GPU バッファが滞留していた。HUD の 🏠 ボタンでタイトルへ何度も戻る構成のため
// 再入場ごとに VBO アップロードと Math.random ループが走り、60fps 維持上の
// 不利益となる。
//
// `StageScene` の SHARED_BG_STARS_* と同じ「SHARED 資源は dispose しない」
// 規約に従い、モジュールレベルでキャッシュする。共有 Mesh には
// `userData.sharedAssets = true` を付与し、将来 `disposeObject3D` 経由で
// クリーンされた場合の安全網とする。
// ──────────────────────────────────────────────────────────────────────────────

let SHARED_TITLE_BG_STARS_GEOMETRY: THREE.BufferGeometry | null = null;
let SHARED_TITLE_BG_STARS_MATERIAL: THREE.PointsMaterial | null = null;

function getTitleBgStarsGeometry(): THREE.BufferGeometry {
  if (!SHARED_TITLE_BG_STARS_GEOMETRY) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(3000);
    for (let i = 0; i < 3000; i++) {
      positions[i] = (Math.random() - 0.5) * 200;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    SHARED_TITLE_BG_STARS_GEOMETRY = geo;
  }
  return SHARED_TITLE_BG_STARS_GEOMETRY;
}

function getTitleBgStarsMaterial(): THREE.PointsMaterial {
  if (!SHARED_TITLE_BG_STARS_MATERIAL) {
    SHARED_TITLE_BG_STARS_MATERIAL = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3,
      sizeAttenuation: true,
    });
  }
  return SHARED_TITLE_BG_STARS_MATERIAL;
}

/**
 * テスト用フック: モジュールレベルキャッシュをクリアする。
 * 本番コードからは呼ばない。
 */
export function __resetTitleSceneSharedAssetsForTest(): void {
  SHARED_TITLE_BG_STARS_GEOMETRY = null;
  SHARED_TITLE_BG_STARS_MATERIAL = null;
}

/**
 * テスト用フック: 内部キャッシュへ直接アクセスする。
 */
export const __titleSceneSharedAssetsForTest = {
  getBgStarsGeometry: (): THREE.BufferGeometry | null => SHARED_TITLE_BG_STARS_GEOMETRY,
  getBgStarsMaterial: (): THREE.PointsMaterial | null => SHARED_TITLE_BG_STARS_MATERIAL,
};

export class TitleScene implements Scene {
  private threeScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private lastAspect = 0;
  private sceneManager: SceneManager;
  private saveManager: SaveManager;
  private audioManager: AudioManager;
  private stars: THREE.Points | null = null;
  private overlay: HTMLDivElement | null = null;
  private tutorialOverlay = new TutorialOverlay();
  private encyclopediaOverlay = new EncyclopediaOverlay();

  constructor(sceneManager: SceneManager, saveManager: SaveManager, audioManager: AudioManager) {
    this.sceneManager = sceneManager;
    this.saveManager = saveManager;
    this.audioManager = audioManager;
    this.threeScene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.set(0, 0, 5);
  }

  enter(_context: SceneContext): void {
    this.lastAspect = 0;
    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x000020);

    // Starfield background (SHARED: 共有 geometry / material は dispose しない)
    this.stars = new THREE.Points(getTitleBgStarsGeometry(), getTitleBgStarsMaterial());
    this.stars.userData.sharedAssets = true;
    this.stars.rotation.set(0, 0, 0);
    this.threeScene.add(this.stars);

    // Ambient light
    this.threeScene.add(new THREE.AmbientLight(0xffffff, 1));

    this.createOverlay();
  }

  private createOverlay(): void {
    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      pointer-events: auto;
    `;

    const title = document.createElement('div');
    title.textContent = 'うちゅうの たび';
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 3rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin-bottom: 2rem;
    `;

    const button = document.createElement('button');
    button.textContent = 'あそぶ';
    button.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      padding: 1rem 3rem;
      border: none;
      border-radius: 2rem;
      background: linear-gradient(135deg, #FF6B6B, #FFE66D);
      color: #333;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    `;

    button.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      // Initialize AudioContext synchronously on user gesture (iPad Safari requirement)
      this.audioManager.initSync();
      this.audioManager.playBGM(0);
      const saveData = this.saveManager.load();
      const startStage = Math.min(saveData.clearedStage + 1, TOTAL_STAGES);
      this.sceneManager.requestTransition('stage', { stageNumber: startStage });
    });

    // Tutorial button
    const tutorialBtn = document.createElement('button');
    tutorialBtn.textContent = 'あそびかた';
    tutorialBtn.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      padding: 0.6rem 1.5rem;
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      position: absolute;
      bottom: max(2rem, calc(env(safe-area-inset-bottom, 0px) + 1rem));
      right: max(2rem, calc(env(safe-area-inset-right, 0px) + 1rem));
    `;
    tutorialBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.tutorialOverlay.show(() => {
        this.tutorialOverlay.hide();
      });
    });

    // Encyclopedia button
    const encyclopediaBtn = document.createElement('button');
    encyclopediaBtn.textContent = 'ずかん';
    encyclopediaBtn.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      padding: 0.6rem 1.5rem;
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      position: absolute;
      bottom: max(2rem, calc(env(safe-area-inset-bottom, 0px) + 1rem));
      left: max(2rem, calc(env(safe-area-inset-left, 0px) + 1rem));
    `;
    encyclopediaBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      const saveData = this.saveManager.load();
      this.encyclopediaOverlay.show(
        saveData.unlockedPlanets,
        () => {},
        (stageNumber) => {
          this.audioManager.initSync();
          this.sceneManager.requestTransition('stage', {
            stageNumber,
            totalScore: 0,
            totalStarCount: 0,
          });
        },
      );
    });

    this.overlay.appendChild(title);
    this.overlay.appendChild(button);
    this.overlay.appendChild(tutorialBtn);
    this.overlay.appendChild(encyclopediaBtn);
    uiOverlay.appendChild(this.overlay);

    // First touch anywhere on overlay initializes audio (iPad Safari requirement)
    this.overlay.addEventListener('pointerdown', () => {
      this.audioManager.initSync();
    }, { once: true });
  }

  update(deltaTime: number): void {
    // Rotate starfield slowly
    if (this.stars) {
      this.stars.rotation.y += deltaTime * 0.05;
    }
  }

  exit(): void {
    this.tutorialOverlay.hide();
    this.encyclopediaOverlay.hide();
    if (this.stars) {
      // SHARED: geometry / material はモジュールキャッシュで使い回すため dispose しない。
      this.stars.parent?.remove(this.stars);
      this.stars = null;
    }
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }

  getThreeScene(): THREE.Scene {
    return this.threeScene;
  }

  getCamera(): THREE.Camera {
    const aspect = window.innerWidth / window.innerHeight;
    if (aspect !== this.lastAspect && Number.isFinite(aspect) && aspect > 0) {
      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
      this.lastAspect = aspect;
    }
    return this.camera;
  }
}
