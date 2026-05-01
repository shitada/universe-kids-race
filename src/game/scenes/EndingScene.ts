import * as THREE from 'three';
import type { Scene, SceneContext } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { SaveManager } from '../storage/SaveManager';
import type { AudioManager } from '../audio/AudioManager';
import { CompanionManager } from '../entities/CompanionManager';
import { PLANET_ENCYCLOPEDIA } from '../config/PlanetEncyclopedia';
import { createMuteButton, type MuteButtonHandle } from '../../ui/createMuteButton';
import { getViewportSize } from '../utils/getViewportSize';

// ──────────────────────────────────────────────────────────────────────────────
// SHARED background-star resources for EndingScene
//
// `TitleScene` と同じく、再入場ごとの BufferGeometry / PointsMaterial 生成と
// VBO アップロードを避けるためモジュールレベルでキャッシュする。共有資源は
// `exit()` でも dispose しない (`StageScene` 規約と一致)。
// ──────────────────────────────────────────────────────────────────────────────

let SHARED_ENDING_BG_STARS_GEOMETRY: THREE.BufferGeometry | null = null;
let SHARED_ENDING_BG_STARS_MATERIAL: THREE.PointsMaterial | null = null;

function getEndingBgStarsGeometry(): THREE.BufferGeometry {
  if (!SHARED_ENDING_BG_STARS_GEOMETRY) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(3000);
    for (let i = 0; i < 3000; i++) {
      positions[i] = (Math.random() - 0.5) * 200;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    SHARED_ENDING_BG_STARS_GEOMETRY = geo;
  }
  return SHARED_ENDING_BG_STARS_GEOMETRY;
}

function getEndingBgStarsMaterial(): THREE.PointsMaterial {
  if (!SHARED_ENDING_BG_STARS_MATERIAL) {
    SHARED_ENDING_BG_STARS_MATERIAL = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3,
    });
  }
  return SHARED_ENDING_BG_STARS_MATERIAL;
}

/**
 * テスト用フック: モジュールレベルキャッシュをクリアする。
 * 本番コードからは呼ばない。
 */
export function __resetEndingSceneSharedAssetsForTest(): void {
  SHARED_ENDING_BG_STARS_GEOMETRY = null;
  SHARED_ENDING_BG_STARS_MATERIAL = null;
}

/**
 * テスト用フック: 内部キャッシュへ直接アクセスする。
 */
export const __endingSceneSharedAssetsForTest = {
  getBgStarsGeometry: (): THREE.BufferGeometry | null => SHARED_ENDING_BG_STARS_GEOMETRY,
  getBgStarsMaterial: (): THREE.PointsMaterial | null => SHARED_ENDING_BG_STARS_MATERIAL,
};

export class EndingScene implements Scene {
  private static readonly CIRCLE_RADIUS = 3.0;
  private static readonly POPIN_DELAY = 0.2;
  private static readonly POPIN_DURATION = 0.3;
  private static readonly BOUNCE_SPEED = 3.0;
  private static readonly BOUNCE_HEIGHT = 0.5;
  private static readonly THANK_YOU_DELAY = 2.5;

  private threeScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private lastAspect = 0;
  private sceneManager: SceneManager;
  private saveManager: SaveManager;
  private audioManager: AudioManager;
  private overlay: HTMLDivElement | null = null;
  private muteHandle: MuteButtonHandle | null = null;
  private bgStars: THREE.Points | null = null;
  private companionMeshes: THREE.Group[] = [];
  private companionGroup: THREE.Group | null = null;
  // 円周上の X/Z 座標は static なので setupCelebration() で 1 回だけ事前計算してキャッシュする。
  // 毎フレーム Math.cos/Math.sin を N 回呼ばないことで iPad Safari 60fps を守る。
  // (CompanionManager の cosTilt/sinTilt キャッシュと同じ最適化方針)
  private circleX: number[] = [];
  private circleZ: number[] = [];
  // popin が完了して scale=1 へ最終書き込み済みなら true。完了済みフレーム以降は
  // mesh.scale.set(1,1,1) を毎フレーム呼ばない (Star/Meteorite/AirShield と同じ rest skip 方針)。
  private popinSettled: boolean[] = [];
  private celebrationElapsed = 0;
  private thankYouShown = false;

  constructor(sceneManager: SceneManager, saveManager: SaveManager, audioManager: AudioManager) {
    this.sceneManager = sceneManager;
    this.saveManager = saveManager;
    this.audioManager = audioManager;
    this.threeScene = new THREE.Scene();
    const { width: vw, height: vh } = getViewportSize();
    this.camera = new THREE.PerspectiveCamera(
      60,
      vw / vh,
      0.1,
      1000,
    );
    this.camera.position.set(0, 0, 5);
  }

  enter(context: SceneContext): void {
    this.lastAspect = 0;
    const totalScore = context.totalScore ?? 0;
    const totalStarCount = context.totalStarCount ?? 0;

    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x000030);

    // Starfield (SHARED: 共有 geometry / material は dispose しない)
    this.bgStars = new THREE.Points(getEndingBgStarsGeometry(), getEndingBgStarsMaterial());
    this.bgStars.userData.sharedAssets = true;
    this.bgStars.rotation.set(0, 0, 0);
    this.threeScene.add(this.bgStars);
    this.threeScene.add(new THREE.AmbientLight(0xffffff, 1));

    // Selective reset: keep unlockedPlanets, reset clearedStage only
    const saveData = this.saveManager.load();
    saveData.clearedStage = 0;
    this.saveManager.save(saveData);

    // Ending BGM
    this.audioManager.playBGM(-1);

    // Celebration setup
    this.setupCelebration();

    this.createOverlay(totalScore, totalStarCount);
    this.createMuteButton();
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

  private createOverlay(totalScore: number, totalStarCount: number): void {
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
    title.textContent = 'うちゅうの たびは おしまい！';
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 2.5rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.5rem;
    `;

    const scoreDiv = document.createElement('div');
    scoreDiv.textContent = `スコア: ${totalScore}`;
    scoreDiv.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.5rem;
    `;

    const starDiv = document.createElement('div');
    starDiv.textContent = `⭐ ${totalStarCount} こ あつめたよ！`;
    starDiv.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 2rem;
    `;

    const button = document.createElement('button');
    button.textContent = 'タイトルに もどる';
    button.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      padding: 0.8rem 2.5rem;
      border: none;
      border-radius: 2rem;
      background: linear-gradient(135deg, #6B6BFF, #6DE6FF);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 4px 15px rgba(107, 107, 255, 0.4);
    `;

    button.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.sceneManager.requestTransition('title');
    });

    this.overlay.appendChild(title);
    this.overlay.appendChild(scoreDiv);
    this.overlay.appendChild(starDiv);
    this.overlay.appendChild(button);
    uiOverlay.appendChild(this.overlay);
  }

  update(deltaTime: number): void {
    if (this.bgStars) {
      this.bgStars.rotation.y += deltaTime * 0.03;
    }
    this.updateCelebration(deltaTime);
  }

  private setupCelebration(): void {
    this.companionGroup = new THREE.Group();
    this.companionMeshes = [];
    // 再入時の整合性のため、既存の円周キャッシュ・settled フラグをリセットしてから push する。
    this.circleX.length = 0;
    this.circleZ.length = 0;
    this.popinSettled.length = 0;
    this.celebrationElapsed = 0;
    this.thankYouShown = false;

    for (let i = 0; i < PLANET_ENCYCLOPEDIA.length; i++) {
      const entry = PLANET_ENCYCLOPEDIA[i];
      const mesh = CompanionManager.createCompanionMesh(entry);

      const angle = i * ((2 * Math.PI) / PLANET_ENCYCLOPEDIA.length);
      const x = Math.cos(angle) * EndingScene.CIRCLE_RADIUS;
      const z = Math.sin(angle) * EndingScene.CIRCLE_RADIUS;
      // 円周上 X/Z は static なのでここで 1 回だけ計算し、updateCelebration() ではキャッシュを使う。
      this.circleX.push(x);
      this.circleZ.push(z);
      mesh.position.set(x, 0, z);

      mesh.scale.set(0, 0, 0);

      this.companionMeshes.push(mesh);
      this.popinSettled.push(false);
      this.companionGroup.add(mesh);
    }

    this.threeScene.add(this.companionGroup);
  }

  private updateCelebration(deltaTime: number): void {
    if (this.companionMeshes.length === 0) return;
    this.celebrationElapsed += deltaTime;

    const POPIN_TOTAL =
      EndingScene.POPIN_DELAY * (this.companionMeshes.length - 1) +
      EndingScene.POPIN_DURATION;

    // bounceY はフレーム共通なのでループ外で 1 回だけ算出する。
    // (毎フレーム N 回 Math.abs(Math.sin(...)) を呼ばない)
    const bounceActive = this.celebrationElapsed > POPIN_TOTAL;
    const bounceY = bounceActive
      ? Math.abs(Math.sin(this.celebrationElapsed * EndingScene.BOUNCE_SPEED)) *
        EndingScene.BOUNCE_HEIGHT
      : 0;

    for (let i = 0; i < this.companionMeshes.length; i++) {
      const mesh = this.companionMeshes[i];

      if (this.popinSettled[i]) {
        // popin 完了済み: scale 書き込み・開始時刻判定をスキップし、bounce y + rotation のみの hot path。
        if (bounceActive) {
          mesh.position.y = bounceY;
        }
        mesh.rotation.y += deltaTime * 2;
        continue;
      }

      const startTime = i * EndingScene.POPIN_DELAY;

      if (this.celebrationElapsed < startTime) {
        // popin 開始前: setupCelebration() で scale=0 にしてあり以後変えていないので毎フレーム書き込まない。
        // 表示されないメッシュなので rotation も加算しない (視覚出力に影響なし)。
        continue;
      }

      if (this.celebrationElapsed < startTime + EndingScene.POPIN_DURATION) {
        const localT = (this.celebrationElapsed - startTime) / EndingScene.POPIN_DURATION;
        const s = this.bounceEase(localT);
        mesh.scale.set(s, s, s);
      } else {
        // popin が今フレームで完了。最終 scale=1 を 1 度だけ書き込み、以降はスキップする。
        mesh.scale.set(1, 1, 1);
        this.popinSettled[i] = true;
      }

      if (bounceActive) {
        // x/z は setupCelebration() で 1 回設定したまま触らない。
        // y のみ更新することで Object3D の matrixWorld 連鎖無効化発火を最小化する。
        mesh.position.y = bounceY;
      }

      mesh.rotation.y += deltaTime * 2;
    }

    if (!this.thankYouShown && this.celebrationElapsed >= EndingScene.THANK_YOU_DELAY) {
      this.showThankYouText();
      this.thankYouShown = true;
    }
  }

  private bounceEase(t: number): number {
    if (t < 0.6) return (t / 0.6) * 1.2;
    return 1.2 - ((t - 0.6) / 0.4) * 0.2;
  }

  private showThankYouText(): void {
    if (!this.overlay) return;

    const thankYou = document.createElement('div');
    thankYou.textContent = 'みんな ありがとう！';
    thankYou.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 2rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.5rem;
      opacity: 0;
      transition: opacity 0.5s ease-in;
    `;

    const button = this.overlay.querySelector('button');
    if (button) {
      this.overlay.insertBefore(thankYou, button);
    } else {
      this.overlay.appendChild(thankYou);
    }

    requestAnimationFrame(() => {
      thankYou.style.opacity = '1';
    });
  }

  exit(): void {
    this.audioManager.stopBGM();

    if (this.bgStars) {
      // SHARED: geometry / material はモジュールキャッシュで使い回すため dispose しない。
      this.threeScene.remove(this.bgStars);
      this.bgStars = null;
    }

    if (this.companionGroup) {
      // SHARED: CompanionManager の geometry / material はモジュール共有資産。
      // ここではシーングラフから外して参照だけ切り、dispose はしない。
      this.threeScene.remove(this.companionGroup);
      this.companionMeshes = [];
      this.companionGroup = null;
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
