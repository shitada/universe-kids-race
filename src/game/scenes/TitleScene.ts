import * as THREE from 'three';
import type { Scene, SceneContext } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { SaveManager } from '../storage/SaveManager';
import type { AudioManager } from '../audio/AudioManager';
import { TutorialOverlay } from '../../ui/TutorialOverlay';
import { LoadingOverlay } from '../../ui/LoadingOverlay';
import { LoadFailureOverlay } from '../../ui/LoadFailureOverlay';
import { createMuteButton, type MuteButtonHandle } from '../../ui/createMuteButton';
import { getStageConfig, TOTAL_STAGES } from '../config/StageConfig';
import { PLANET_ENCYCLOPEDIA, getPlanetEncyclopediaEntry } from '../config/PlanetEncyclopedia';
import { formatEncyclopediaLabel } from '../../ui/formatEncyclopediaLabel';
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

type EncyclopediaOverlayModule = typeof import('../../ui/EncyclopediaOverlay');
type EncyclopediaOverlayCtor = EncyclopediaOverlayModule['EncyclopediaOverlay'];
type EncyclopediaOverlayInstance = InstanceType<EncyclopediaOverlayCtor>;
type TitleCompanionFactoryModule = typeof import('../entities/CompanionMeshFactory');
type TitleCompanionFactory = Pick<TitleCompanionFactoryModule, 'createCompanionMesh'>;

interface TitleSceneOptions {
  loadingOverlay?: Pick<LoadingOverlay, 'show' | 'hide'>;
  loadFailureOverlay?: Pick<LoadFailureOverlay, 'show' | 'hide'>;
  loadEncyclopediaOverlay?: () => Promise<{ EncyclopediaOverlay: EncyclopediaOverlayCtor }>;
  loadTitleCompanionFactory?: () => Promise<TitleCompanionFactory>;
  scheduleIdleTask?: (callback: () => void) => void;
}

function scheduleIdleTask(callback: () => void): void {
  const requestIdle = (window as Window & {
    requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
  }).requestIdleCallback;
  if (typeof requestIdle === 'function') {
    requestIdle(callback, { timeout: 1500 });
    return;
  }
  window.setTimeout(callback, 800);
}

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
  private companionParade: THREE.Group | null = null;
  private overlay: HTMLDivElement | null = null;
  private muteHandle: MuteButtonHandle | null = null;
  private tutorialOverlay = new TutorialOverlay();
  private encyclopediaOverlay: EncyclopediaOverlayInstance | null = null;
  private encyclopediaOverlayPromise: Promise<EncyclopediaOverlayInstance> | null = null;
  private companionFactory: TitleCompanionFactory | null = null;
  private companionFactoryPromise: Promise<TitleCompanionFactory> | null = null;
  private readonly loadEncyclopediaOverlay: () => Promise<{ EncyclopediaOverlay: EncyclopediaOverlayCtor }>;
  private readonly loadTitleCompanionFactory: () => Promise<TitleCompanionFactory>;
  private readonly loadingOverlay: Pick<LoadingOverlay, 'show' | 'hide'>;
  private readonly loadFailureOverlay: Pick<LoadFailureOverlay, 'show' | 'hide'>;
  private readonly scheduleIdleTask: (callback: () => void) => void;
  private encyclopediaBtn: HTMLButtonElement | null = null;
  private isOpeningEncyclopedia = false;
  private isActive = false;
  private encyclopediaRequestToken = 0;
  // タイトル滞在中、初回 user gesture（AudioContext 初期化）を待つフラグ。
  // iPad Safari の AudioContext は user gesture 必須のため、enter() 直後の
  // 即時 playBGM(0) は AudioManager が既に初期化済みのとき（再訪問時）のみ
  // 機能する。初回起動時は overlay の pointerdown ハンドラ内で initSync()
  // 直後に再生開始するため、その判定にこのフラグを利用する。
  private bgmPending = false;

  constructor(
    sceneManager: SceneManager,
    saveManager: SaveManager,
    audioManager: AudioManager,
    options: TitleSceneOptions = {},
  ) {
    this.sceneManager = sceneManager;
    this.saveManager = saveManager;
    this.audioManager = audioManager;
    this.loadingOverlay = options.loadingOverlay ?? new LoadingOverlay();
    this.loadFailureOverlay = options.loadFailureOverlay ?? new LoadFailureOverlay();
    this.scheduleIdleTask = options.scheduleIdleTask ?? scheduleIdleTask;
    this.loadEncyclopediaOverlay =
      options.loadEncyclopediaOverlay ??
      (() => import('../../ui/EncyclopediaOverlay'));
    this.loadTitleCompanionFactory =
      options.loadTitleCompanionFactory ??
      (() => import('../entities/CompanionMeshFactory'));
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
    this.isActive = true;
    this.encyclopediaRequestToken += 1;
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

    const saveData = this.saveManager.load();
    void this.createCompanionParade(saveData.unlockedPlanets);

    this.createOverlay();
    this.createMuteButton();
    this.prefetchEncyclopediaOnIdle();

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

    // First-run onboarding: auto-show the tutorial overlay on the very first
    // TitleScene entry (Constitution I). The TutorialOverlay is modal
    // (z-index: 30, full-viewport) so it visually overlays the title controls
    // until the child taps "とじる". Closing flips the persisted flag so this
    // runs at most once per save data lifetime; the manual "あそびかた" button
    // remains available for later replays. Registration order matters: the
    // overlay's pointerdown for AudioContext init ({once: true}) is attached
    // by createOverlay() above, so the close-tap on the tutorial does not
    // consume it (the tutorial overlay is a separate DOM subtree).
    if (!saveData.tutorialShown) {
      this.tutorialOverlay.show(() => {
        this.ensureTitleAudioInitialized(true);
        this.tutorialOverlay.hide();
        this.saveManager.markTutorialShown();
      });
    }
  }

  private createMuteButton(): void {
    const container = document.getElementById('hud') ?? document.getElementById('ui-overlay');
    if (!container) return;
    this.muteHandle = createMuteButton({
      initialMuted: this.audioManager.isMuted(),
      container,
      onToggle: () => {
        this.ensureTitleAudioInitialized(true);
        const newMuted = this.audioManager.toggleMute();
        this.muteHandle?.setMuted(newMuted);
        const data = this.saveManager.load();
        data.muted = newMuted;
        this.saveManager.save(data);
      },
    });
  }

  private getEncyclopediaOverlay(): Promise<EncyclopediaOverlayInstance> {
    if (this.encyclopediaOverlay) {
      return Promise.resolve(this.encyclopediaOverlay);
    }
    if (this.encyclopediaOverlayPromise) {
      return this.encyclopediaOverlayPromise;
    }

    this.encyclopediaOverlayPromise = this.loadEncyclopediaOverlay()
      .then(({ EncyclopediaOverlay: EncyclopediaOverlayClass }) => {
        const overlay = new EncyclopediaOverlayClass();
        this.encyclopediaOverlay = overlay;
        return overlay;
      })
      .finally(() => {
        this.encyclopediaOverlayPromise = null;
      });

    return this.encyclopediaOverlayPromise;
  }

  private getTitleCompanionFactory(): Promise<TitleCompanionFactory> {
    if (this.companionFactory) {
      return Promise.resolve(this.companionFactory);
    }
    if (this.companionFactoryPromise) {
      return this.companionFactoryPromise;
    }

    this.companionFactoryPromise = this.loadTitleCompanionFactory()
      .then((factory) => {
        this.companionFactory = factory;
        return factory;
      })
      .finally(() => {
        this.companionFactoryPromise = null;
      });

    return this.companionFactoryPromise;
  }

  private showEncyclopedia(): void {
    if (!this.isActive || !this.encyclopediaOverlay) return;
    const saveData = this.saveManager.load();
    this.encyclopediaOverlay.show(
      saveData.unlockedPlanets,
      () => this.refreshEncyclopediaButtonLabel(),
      (stageNumber) => {
        this.ensureTitleAudioInitialized(false);
        this.sceneManager.requestTransition('stage', {
          stageNumber,
          totalScore: 0,
          totalStarCount: 0,
        });
      },
      saveData.bestStageStars ?? {},
    );
  }

  private isCurrentEncyclopediaRequest(requestToken: number): boolean {
    return this.isActive && this.encyclopediaRequestToken === requestToken;
  }

  private prefetchEncyclopediaOnIdle(): void {
    const requestToken = this.encyclopediaRequestToken;
    this.scheduleIdleTask(() => {
      if (
        !this.isCurrentEncyclopediaRequest(requestToken) ||
        this.encyclopediaOverlay ||
        this.encyclopediaOverlayPromise
      ) {
        return;
      }
      void this.getEncyclopediaOverlay().catch(() => {});
    });
  }

  private async openEncyclopedia(): Promise<void> {
    if (!this.isActive) {
      return;
    }

    this.loadFailureOverlay.hide();
    if (this.encyclopediaOverlay) {
      this.showEncyclopedia();
      return;
    }
    if (this.isOpeningEncyclopedia) {
      return;
    }

    const requestToken = this.encyclopediaRequestToken;
    this.isOpeningEncyclopedia = true;
    this.loadingOverlay.show('ずかんを よんでるよ...');
    try {
      await this.getEncyclopediaOverlay();
      if (!this.isCurrentEncyclopediaRequest(requestToken)) {
        return;
      }
      this.loadingOverlay.hide();
      this.showEncyclopedia();
    } catch (error) {
      if (!this.isCurrentEncyclopediaRequest(requestToken)) {
        return;
      }
      this.loadingOverlay.hide();
      console.error('Failed to load encyclopedia overlay', error);
      this.loadFailureOverlay.show({
        title: 'ずかんの じゅんびが できなかったよ',
        message: '「もういちど よむ」を おしてね',
        primaryAction: {
          label: 'もういちど よむ',
          onSelect: () => this.openEncyclopedia(),
        },
      });
    } finally {
      if (this.encyclopediaRequestToken === requestToken) {
        this.isOpeningEncyclopedia = false;
      }
    }
  }

  private createOverlay(): void {
    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    const initialSaveData = this.saveManager.load();
    const startStage = Math.min(initialSaveData.clearedStage + 1, TOTAL_STAGES);
    const startStageConfig = getStageConfig(startStage);
    const playHintText = initialSaveData.clearedStage >= TOTAL_STAGES
      ? `ぜんぶ クリア！ ステージ ${startStage} ・ ${startStageConfig.destination}へ もういちど！`
      : initialSaveData.clearedStage === 0
        ? `ステージ ${startStage} ・ ${startStageConfig.destination}へ はじめての しゅっぱつ！`
        : `ステージ ${startStage} ・ ${startStageConfig.destination}へ つづきから！`;

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

    const nextAdventureCard = document.createElement('div');
    nextAdventureCard.dataset.nextAdventureCard = 'true';
    nextAdventureCard.dataset.stageNumber = String(startStage);
    nextAdventureCard.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      min-width: min(88vw, 22rem);
      margin-bottom: 1rem;
      padding: 1rem 1.5rem;
      border-radius: 1.5rem;
      background: rgba(10, 25, 70, 0.78);
      border: 2px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
      color: #fff;
    `;

    const nextAdventureLabel = document.createElement('div');
    nextAdventureLabel.textContent = 'つぎの ぼうけん';
    nextAdventureLabel.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: #FFE66D;
    `;

    const nextAdventureStage = document.createElement('div');
    nextAdventureStage.textContent = `ステージ ${startStage}`;
    nextAdventureStage.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.4rem;
      font-weight: 900;
    `;

    const nextAdventureDestination = document.createElement('div');
    nextAdventureDestination.textContent = `${startStageConfig.emoji} ${startStageConfig.displayName}`;
    nextAdventureDestination.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
    `;

    nextAdventureCard.appendChild(nextAdventureLabel);
    nextAdventureCard.appendChild(nextAdventureStage);
    nextAdventureCard.appendChild(nextAdventureDestination);

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
      this.ensureTitleAudioInitialized(false);
      this.sceneManager.requestTransition('stage', {
        stageNumber: startStage,
        totalScore: 0,
        totalStarCount: 0,
      });
    });

    const playHint = document.createElement('div');
    playHint.dataset.playHint = 'true';
    playHint.textContent = playHintText;
    playHint.style.cssText = `
      margin-top: 0.75rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.92);
      text-align: center;
    `;

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
      this.ensureTitleAudioInitialized(true);
      this.tutorialOverlay.show(() => {
        this.ensureTitleAudioInitialized(true);
        this.tutorialOverlay.hide();
      });
    });

    // Encyclopedia button
    const encyclopediaBtn = document.createElement('button');
    encyclopediaBtn.textContent = formatEncyclopediaLabel(
      initialSaveData.unlockedPlanets.length,
      PLANET_ENCYCLOPEDIA.length,
    );
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
      white-space: nowrap;
      position: absolute;
      bottom: max(2rem, calc(env(safe-area-inset-bottom, 0px) + 1rem));
      left: max(2rem, calc(env(safe-area-inset-left, 0px) + 1rem));
    `;
    this.encyclopediaBtn = encyclopediaBtn;
    encyclopediaBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.ensureTitleAudioInitialized(true);
      void this.openEncyclopedia();
    });

    this.overlay.appendChild(title);
    this.overlay.appendChild(nextAdventureCard);
    this.overlay.appendChild(button);
    this.overlay.appendChild(playHint);
    this.overlay.appendChild(tutorialBtn);
    this.overlay.appendChild(encyclopediaBtn);
    uiOverlay.appendChild(this.overlay);

    // First touch anywhere on overlay initializes audio (iPad Safari requirement).
    // 初回起動時は AudioContext 未初期化のため enter() 内では BGM_0 を開始
    // できない（user gesture 必須）。ここで initSync() 直後に bgmPending を
    // 確認し、まだ再生されていなければ BGM_0 を開始する。
    this.overlay.addEventListener('pointerdown', () => {
      this.ensureTitleAudioInitialized(true);
    }, { once: true });
  }

  private ensureTitleAudioInitialized(playTitleBgm: boolean): void {
    if (!this.bgmPending && this.audioManager.isInitialized()) {
      return;
    }

    this.audioManager.initSync();
    if (playTitleBgm && this.bgmPending) {
      this.audioManager.playBGM(0);
    }
    this.bgmPending = false;
  }

  private refreshEncyclopediaButtonLabel(): void {
    if (!this.encyclopediaBtn) return;
    const saveData = this.saveManager.load();
    this.encyclopediaBtn.textContent = formatEncyclopediaLabel(
      saveData.unlockedPlanets.length,
      PLANET_ENCYCLOPEDIA.length,
    );
  }

  private async createCompanionParade(unlockedPlanets: number[]): Promise<void> {
    this.clearCompanionParade();

    const unlockedEntries = [...new Set(unlockedPlanets)].reduce<Array<NonNullable<ReturnType<typeof getPlanetEncyclopediaEntry>>>>(
      (entries, stageNumber) => {
        const entry = getPlanetEncyclopediaEntry(stageNumber);
        if (entry) {
          entries.push(entry);
        }
        return entries;
      },
      [],
    );

    if (unlockedEntries.length === 0) {
      return;
    }

    const requestToken = this.encyclopediaRequestToken;
    const { createCompanionMesh } = await this.getTitleCompanionFactory();
    if (!this.isActive || this.encyclopediaRequestToken !== requestToken) {
      return;
    }

    const group = new THREE.Group();
    group.name = 'title-companion-parade';
    group.position.set(0, 1.35, -1.2);
    group.rotation.x = -0.12;

    const radius = Math.min(2.1, 1.1 + unlockedEntries.length * 0.18);
    const verticalAmplitude = Math.min(0.45, 0.18 + unlockedEntries.length * 0.02);

    unlockedEntries.forEach((entry, index) => {
      const mesh = createCompanionMesh(entry);
      const angle = (index / unlockedEntries.length) * Math.PI * 2;
      mesh.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * verticalAmplitude,
        Math.sin(angle) * radius * 0.45,
      );
      mesh.rotation.y = Math.PI * 0.15 - angle;
      mesh.scale.setScalar(0.6);
      group.add(mesh);
    });

    this.companionParade = group;
    this.threeScene.add(group);
  }

  private clearCompanionParade(): void {
    if (!this.companionParade) {
      return;
    }
    this.companionParade.parent?.remove(this.companionParade);
    this.companionParade = null;
  }

  update(deltaTime: number): void {
    // Rotate starfield slowly
    if (this.stars) {
      this.stars.rotation.y += deltaTime * 0.05;
    }
    if (this.companionParade) {
      this.companionParade.rotation.y += deltaTime * 0.35;
    }
  }

  exit(): void {
    this.isActive = false;
    this.encyclopediaRequestToken += 1;
    this.isOpeningEncyclopedia = false;
    this.tutorialOverlay.hide();
    this.encyclopediaOverlay?.hide();
    this.loadingOverlay.hide();
    this.loadFailureOverlay.hide();
    // タイトル BGM を明示的に停止する。StageScene.enter() 内の playBGM() が
    // stopBGM() を呼ぶため二重実行になるが、stopBGM() は冪等であり
    // bgmGeneration インクリメント・配列クリアともに副作用はない。
    // 「タイトル BGM がステージ突入後にうっすら残る」可能性を断つ。
    this.audioManager.stopBGM();
    this.bgmPending = false;
    this.clearCompanionParade();
    if (this.stars) {
      // SHARED: geometry / material はモジュールキャッシュで使い回すため dispose しない。
      this.stars.parent?.remove(this.stars);
      this.stars = null;
    }
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.encyclopediaBtn = null;
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
