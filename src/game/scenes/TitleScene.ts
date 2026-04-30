import * as THREE from 'three';
import type { Scene, SceneContext } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { SaveManager } from '../storage/SaveManager';
import type { AudioManager } from '../audio/AudioManager';
import { TutorialOverlay } from '../../ui/TutorialOverlay';
import { EncyclopediaOverlay } from '../../ui/EncyclopediaOverlay';
import { createMuteButton, type MuteButtonHandle } from '../../ui/createMuteButton';
import { TOTAL_STAGES } from '../config/StageConfig';
import { getViewportSize } from '../utils/getViewportSize';

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
  // Scene / AmbientLight はインスタンスで再利用し、🏠 ボタンによる再入場ごとの
  // per-entry GPU/JS アロケーションを抑える。
  private readonly threeScene: THREE.Scene;
  private readonly ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 1);
  private camera: THREE.PerspectiveCamera;
  private lastAspect = 0;
  private sceneManager: SceneManager;
  private saveManager: SaveManager;
  private audioManager: AudioManager;
  private stars: THREE.Points | null = null;
  private overlay: HTMLDivElement | null = null;
  private muteHandle: MuteButtonHandle | null = null;
  private tutorialOverlay = new TutorialOverlay();
  private encyclopediaOverlay = new EncyclopediaOverlay();
  // タイトル滞在中、初回 user gesture（AudioContext 初期化）を待つフラグ。
  // iPad Safari の AudioContext は user gesture 必須のため、enter() 直後の
  // 即時 playBGM(0) は AudioManager が既に初期化済みのとき（再訪問時）のみ
  // 機能する。初回起動時は overlay の pointerdown ハンドラ内で initSync()
  // 直後に再生開始するため、その判定にこのフラグを利用する。
  private bgmPending = false;

  constructor(sceneManager: SceneManager, saveManager: SaveManager, audioManager: AudioManager) {
    this.sceneManager = sceneManager;
    this.saveManager = saveManager;
    this.audioManager = audioManager;
    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x000020);
    const { width: vw, height: vh } = getViewportSize();
    this.camera = new THREE.PerspectiveCamera(
      60,
      vw / vh,
      0.1,
      1000,
    );
    this.camera.position.set(0, 0, 5);
  }

  enter(_context: SceneContext): void {
    this.lastAspect = 0;

    // Starfield background (SHARED: 共有 geometry / material は dispose しない)
    this.stars = new THREE.Points(getTitleBgStarsGeometry(), getTitleBgStarsMaterial());
    this.stars.userData.sharedAssets = true;
    this.stars.rotation.set(0, 0, 0);
    this.threeScene.add(this.stars);

    // Ambient light: 再入場時の重複 add を防ぐため parent チェック
    if (!this.ambientLight.parent) {
      this.threeScene.add(this.ambientLight);
    }

    this.createOverlay();
    this.createMuteButton();

    // タイトル BGM (BGM_0) を再生する。
    // - AudioContext が既に初期化済み（エンディング後・🏠 ボタン経由でタイトル
    //   へ戻った再訪問ケース）であれば即時再生を開始する。
    // - 未初期化（初回起動）であれば bgmPending フラグだけ立て、overlay の
    //   pointerdown {once:true} ハンドラ側で initSync() 直後に再生する。
    //   iPad Safari は user gesture 内でしか AudioContext を起動できないため。
    if (this.audioManager.isInitialized()) {
      this.audioManager.playBGM(0);
      this.bgmPending = false;
    } else {
      this.bgmPending = true;
    }
  }

  private createMuteButton(): void {
    const container = document.getElementById('hud') ?? document.getElementById('ui-overlay');
    if (!container) return;
    this.muteHandle = createMuteButton({
      initialMuted: this.audioManager.isMuted(),
      container,
      onToggle: () => {
        const newMuted = this.audioManager.toggleMute();
        this.muteHandle?.setMuted(newMuted);
        const data = this.saveManager.load();
        data.muted = newMuted;
        this.saveManager.save(data);
      },
    });
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
      // Initialize AudioContext synchronously on user gesture (iPad Safari requirement).
      // ここで playBGM(0) は呼ばない。直後の StageScene.enter() が
      // playBGM(stageNumber) を呼び、内部の stopBGM() でタイトル BGM を即停止
      // するため、タイトル BGM は実質的に再生されない無駄な処理になっていた。
      this.audioManager.initSync();
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
        saveData.bestStageStars ?? {},
      );
    });

    this.overlay.appendChild(title);
    this.overlay.appendChild(button);
    this.overlay.appendChild(tutorialBtn);
    this.overlay.appendChild(encyclopediaBtn);
    uiOverlay.appendChild(this.overlay);

    // First touch anywhere on overlay initializes audio (iPad Safari requirement).
    // 初回起動時は AudioContext 未初期化のため enter() 内では BGM_0 を開始
    // できない（user gesture 必須）。ここで initSync() 直後に bgmPending を
    // 確認し、まだ再生されていなければ BGM_0 を開始する。
    this.overlay.addEventListener('pointerdown', () => {
      this.audioManager.initSync();
      if (this.bgmPending) {
        this.audioManager.playBGM(0);
        this.bgmPending = false;
      }
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
    // タイトル BGM を明示的に停止する。StageScene.enter() 内の playBGM() が
    // stopBGM() を呼ぶため二重実行になるが、stopBGM() は冪等であり
    // bgmGeneration インクリメント・配列クリアともに副作用はない。
    // 「タイトル BGM がステージ突入後にうっすら残る」可能性を断つ。
    this.audioManager.stopBGM();
    this.bgmPending = false;
    if (this.stars) {
      // SHARED: geometry / material はモジュールキャッシュで使い回すため dispose しない。
      this.stars.parent?.remove(this.stars);
      this.stars = null;
    }
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    if (this.muteHandle) {
      this.muteHandle.remove();
      this.muteHandle = null;
    }
  }

  getThreeScene(): THREE.Scene {
    return this.threeScene;
  }

  getCamera(): THREE.Camera {
    const { width, height } = getViewportSize();
    const aspect = width / height;
    if (aspect !== this.lastAspect && Number.isFinite(aspect) && aspect > 0) {
      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
      this.lastAspect = aspect;
    }
    return this.camera;
  }
}
