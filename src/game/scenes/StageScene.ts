import * as THREE from 'three';
import type { AssistDirection, Scene, SceneContext, StageConfig } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { InputSystem } from '../systems/InputSystem';
import type { AudioManager } from '../audio/AudioManager';
import type { SaveManager } from '../storage/SaveManager';
import { Spaceship } from '../entities/Spaceship';
import { Star } from '../entities/Star';
import { Meteorite } from '../entities/Meteorite';
import { CollisionSystem } from '../systems/CollisionSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { SpawnSystem } from '../systems/SpawnSystem';
import { BoostSystem } from '../systems/BoostSystem';
import { HUD } from '../../ui/HUD';
import { CountdownOverlay } from '../../ui/CountdownOverlay';
import { StageIntroOverlay } from '../../ui/StageIntroOverlay';
import { getStageConfig, TOTAL_STAGES } from '../config/StageConfig';
import { ParticleBurstManager } from '../effects/ParticleBurst';
import { AirShield } from '../effects/AirShield';
import { BoostLinesEffect } from '../effects/BoostLinesEffect';
import { BoostFlameEffect } from '../effects/BoostFlameEffect';
import { CompanionManager } from '../entities/CompanionManager';
import { followCameraZ } from '../utils/followCameraZ';
import { getViewportSize } from '../utils/getViewportSize';
import { ScorePopupManager } from '../../ui/ScorePopupManager';
import { getNextPlanetEncyclopediaEntry, getPlanetEncyclopediaEntry } from '../config/PlanetEncyclopedia';
import { TouchGuideOverlay, type TouchGuideMode } from '../../ui/TouchGuideOverlay';
import { attachReleaseConfirmButton } from '../../ui/attachReleaseConfirmButton';
import { PauseOverlay } from '../../ui/PauseOverlay';
import { StageClearOverlay } from '../../ui/StageClearOverlay';
import {
  __resetStageSceneSharedAssetCachesForTest,
  __stageSceneSharedAssetCachesForTest,
  createDestinationPlanet as buildStageDestinationPlanet,
  createStageBackground as buildStageBackground,
  prewarmStageVisualAssets,
} from './stageVisualAssets';

const BG_STAR_PARALLAX = 1.0;
const BG_STAR_COUNT = 2000;

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

export {
  __resetStageSceneSharedAssetCachesForTest,
  __stageSceneSharedAssetCachesForTest,
  prewarmStageVisualAssets,
};

type EncyclopediaOverlayModule = typeof import('../../ui/EncyclopediaOverlay');
type EncyclopediaOverlayCtor = EncyclopediaOverlayModule['EncyclopediaOverlay'];
type EncyclopediaOverlayInstance = InstanceType<EncyclopediaOverlayCtor>;

interface StageSceneOptions {
  scheduleIdleTask?: (callback: () => void) => void;
  loadEncyclopediaOverlay?: () => Promise<{ EncyclopediaOverlay: EncyclopediaOverlayCtor }>;
}

interface StagePauseHandlers {
  onPauseRequested?: () => void;
  onResumeRequested?: () => void;
  onExitHomeRequested?: () => void;
}

export class StageScene implements Scene {
  private static readonly VISUAL_QUALITY_SCALE_BY_TIER = [0.45, 0.7, 1];
  private static readonly BG_STAR_COUNT = BG_STAR_COUNT;
  private static readonly ASSIST_TRIGGER_HIT_WINDOW = 6;
  private static readonly ASSIST_TRIGGER_HIT_COUNT = 2;
  private static readonly ASSIST_DURATION = 5;
  private static readonly ASSIST_MESSAGE_DURATION = 3;
  private static readonly ASSIST_METEORITE_INTERVAL_MULTIPLIER = 1.7;
  private static readonly ASSIST_MESSAGE = 'だいじょうぶ！ ゆっくりいこう ✨';
  private static readonly ASSIST_DIRECTION_REFRESH_INTERVAL = 0.35;
  private static readonly ASSIST_DIRECTION_LOOKAHEAD = 42;
  private static readonly ASSIST_DIRECTION_SIDE_TARGET_X = 4.5;
  private static readonly ASSIST_DIRECTION_SIDE_RANGE = 7.5;
  private static readonly ASSIST_DIRECTION_DIFF_THRESHOLD = 1.1;
  private static readonly ASSIST_DIRECTION_DIFF_RATIO = 0.28;

  private threeScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private lastAspect = 0;
  private initialized = false;
  private sceneManager: SceneManager;
  private inputSystem: InputSystem;
  private audioManager: AudioManager;
  private saveManager: SaveManager;

  private ambientLight!: THREE.AmbientLight;
  private directionalLight!: THREE.DirectionalLight;
  private spaceship!: Spaceship;
  private stars: Star[] = [];
  private meteorites: Meteorite[] = [];

  private collisionSystem = new CollisionSystem();
  private scoreSystem = new ScoreSystem();
  private spawnSystem = new SpawnSystem();
  private boostSystem = new BoostSystem();
  private hud!: HUD;
  private scorePopupManager = new ScorePopupManager();
  private particleBurstManager = new ParticleBurstManager();
  private airShield!: AirShield;

  private stageConfig!: StageConfig;
  private stageNumber = 1;
  private launchSource: 'campaign' | 'encyclopedia' = 'campaign';
  private isCleared = false;
  private clearTimer = 0;
  private stageClearOverlay = new StageClearOverlay();
  private isClearRewardOpen = false;
  private isOpeningClearReward = false;
  private clearRewardOverlay: EncyclopediaOverlayInstance | null = null;
  private clearRewardOverlayPromise: Promise<EncyclopediaOverlayInstance> | null = null;
  private static readonly CLEAR_CONTINUE_DELAY = 0.6;
  private stageEntryTotalScore = 0;
  private stageEntryTotalStarCount = 0;
  private playTime = 0;
  private meteoriteHitTimes: number[] = [];
  private assistTimer = 0;
  private assistMessageTimer = 0;
  private assistDirection: AssistDirection | null = null;
  private assistDirectionRefreshTimer = 0;

  // Damage animation
  private damageTimer = 0;
  private static readonly DAMAGE_FLASH_DURATION = 0.5;
  private cameraShakeTimer = 0;
  private cameraShakeElapsed = 0;
  private readonly cameraShakeOffset = new THREE.Vector3();
  private static readonly CAMERA_SHAKE_DURATION = 0.28;
  private static readonly CAMERA_SHAKE_AMPLITUDE_X = 0.18;
  private static readonly CAMERA_SHAKE_AMPLITUDE_Y = 0.12;
  private static readonly CAMERA_SHAKE_FREQUENCY = 42;

  // Destination planet
  private destinationPlanet: THREE.Group | null = null;
  // Sub-object to spin (sphere body for ringed planets, sub-group for Earth+cloud,
  // sphere mesh for plain planets / sun). Kept separate from `destinationPlanet`
  // so that ring meshes stay tilted and the sun's pulse-scale on the parent group
  // composes cleanly with this rotation.
  private destinationPlanetSpinTarget: THREE.Object3D | null = null;
  private static readonly DESTINATION_PLANET_SPIN_SPEED = 0.2;
  private static readonly BOOST_HINT_INITIAL_DELAY = 3.5;
  private static readonly BOOST_HINT_REPEAT_DELAY = 12;
  private static readonly BOOST_HINT_DURATION = 2.4;
  private static readonly BOOST_HINT_MESSAGE = '🚀 いまだよ！';

  // Background stars
  private bgStars: THREE.Points | null = null;

  // Boost effects (retained: single instance reused per frame; do not dispose per instance)
  private boostLinesEffect!: BoostLinesEffect;

  // Companion manager
  private companionManager: CompanionManager | null = null;

  // Sun pulse animation
  private elapsedTime = 0;

  // Boost flame particles
  private boostFlameEffect!: BoostFlameEffect;

  // Stage start countdown ("3 → 2 → 1 → スタート！")
  // While `isStarting` is true, input/spawn/ship-forward are skipped so the
  // child can mentally prepare. Background stars and the destination planet
  // continue to rotate gently for a calm waiting state.
  private isStarting = false;
  private stageIntroOverlay: StageIntroOverlay | null = null;
  private countdownOverlay: CountdownOverlay | null = null;

  // Background-resume countdown ("3 → 2 → 1 → スタート！" after Safari
  // returns from background). Constitution I (子供ファースト): 復帰直後の
  // 理不尽な衝突を防ぐ。While `awaitingResume` is true, the same input/
  // spawn/forward-motion gate as `isStarting` applies so the spaceship
  // does not move until the child is ready.
  private awaitingResume = false;
  private resumeCountdownOverlay: CountdownOverlay | null = null;
  private isHomeConfirmOpen = false;
  private shouldResumeAfterHomeConfirm = false;
  private pauseOverlay = new PauseOverlay();
  private isPauseOpen = false;
  private shouldResumeAfterPause = false;
  private touchGuide = new TouchGuideOverlay();
  private touchGuideMode: TouchGuideMode = 'intro';
  private touchGuideIdleTimer = 0;
  private hasSeenMoveInput = false;
  private isActive = false;
  private boostHintReadyTimer = 0;
  private boostHintDisplayTimer = 0;
  private boostHintNextTrigger = StageScene.BOOST_HINT_INITIAL_DELAY;
  private prewarmRequestToken = 0;
  private static readonly TOUCH_GUIDE_IDLE_DELAY = 3;
  private visualQualityTier = StageScene.VISUAL_QUALITY_SCALE_BY_TIER.length - 1;
  private readonly scheduleIdleTask: (callback: () => void) => void;
  private readonly loadEncyclopediaOverlay: () => Promise<{ EncyclopediaOverlay: EncyclopediaOverlayCtor }>;
  private clearRewardRequestToken = 0;
  private onPauseRequested: (() => void) | null = null;
  private onResumeRequested: (() => void) | null = null;
  private onExitHomeRequested: (() => void) | null = null;

  constructor(
    sceneManager: SceneManager,
    inputSystem: InputSystem,
    audioManager: AudioManager,
    saveManager: SaveManager,
    options: StageSceneOptions = {},
  ) {
    this.sceneManager = sceneManager;
    this.inputSystem = inputSystem;
    this.audioManager = audioManager;
    this.saveManager = saveManager;
    this.scheduleIdleTask = options.scheduleIdleTask ?? scheduleIdleTask;
    this.loadEncyclopediaOverlay =
      options.loadEncyclopediaOverlay ??
      (() => import('../../ui/EncyclopediaOverlay'));
    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x000020);
    const { width: vw, height: vh } = getViewportSize();
    this.camera = new THREE.PerspectiveCamera(
      60,
      vw / vh,
      0.1,
      2000,
    );
  }

  private ensureInitialized(): void {
    if (this.initialized) {
      return;
    }

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(5, 10, 5);
    this.threeScene.add(this.ambientLight);
    this.threeScene.add(this.directionalLight);

    this.spaceship = new Spaceship();
    this.threeScene.add(this.spaceship.mesh);

    this.airShield = new AirShield();
    this.threeScene.add(this.airShield.getMesh());

    this.companionManager = new CompanionManager([]);
    this.threeScene.add(this.companionManager.getGroup());

    this.boostLinesEffect = new BoostLinesEffect();
    this.boostLinesEffect.init(this.threeScene);

    this.boostFlameEffect = new BoostFlameEffect();
    this.boostFlameEffect.init(this.threeScene);

    this.hud = new HUD();
    this.initialized = true;
    this.applyVisualQualityTier();
  }

  setVisualQualityTier(tier: number): void {
    this.visualQualityTier = StageScene.clampVisualQualityTier(tier);
    this.applyVisualQualityTier();
  }

  enter(context: SceneContext): void {
    this.ensureInitialized();
    this.isActive = true;
    this.prewarmRequestToken += 1;
    this.clearRewardRequestToken += 1;
    this.lastAspect = 0;
    this.stageNumber = context.stageNumber ?? 1;
    this.launchSource = context.launchSource ?? 'campaign';
    this.stageConfig = getStageConfig(this.stageNumber);
    this.prefetchEndingSceneModuleIfNeeded();
    this.isCleared = false;
    this.clearTimer = 0;
    this.stageClearOverlay.hide();
    this.isClearRewardOpen = false;
    this.isOpeningClearReward = false;
    this.damageTimer = 0;
    this.elapsedTime = 0;
    this.destinationPlanetSpinTarget = null;
    this.isHomeConfirmOpen = false;
    this.shouldResumeAfterHomeConfirm = false;
    this.isPauseOpen = false;
    this.shouldResumeAfterPause = false;
    this.pauseOverlay.hide();
    this.touchGuideIdleTimer = 0;
    this.hasSeenMoveInput = false;
    this.touchGuideMode = 'intro';
    this.playTime = 0;
    this.meteoriteHitTimes.length = 0;
    this.assistTimer = 0;
    this.assistMessageTimer = 0;
    this.assistDirection = null;
    this.assistDirectionRefreshTimer = 0;
    this.resetBoostHintState();

    const totalScore = context.totalScore ?? 0;
    const totalStarCount = context.totalStarCount ?? 0;
    this.stageEntryTotalScore = totalScore;
    this.stageEntryTotalStarCount = totalStarCount;
    this.scoreSystem.setTotalScore(totalScore);
    this.scoreSystem.setTotalStarCount(totalStarCount);

    this.resetStageObjects();
    this.spaceship.reset();
    // Clear any ghost pointers that may have survived a stage transition.
    // When a DOM overlay (stage-clear, encyclopedia) appears above the canvas
    // while the user's finger is still down, pointerup fires on the overlay
    // and the pointer stays in activePointers, causing permanent drift.
    this.inputSystem.resetPointers?.();
    this.airShield.reset(0, 0, 0);
    this.boostLinesEffect.update(false, 0, 0);
    this.boostFlameEffect.remove();
    this.companionManager?.resetUnlockedPlanets([]);
    this.createBackground();
    this.applyVisualQualityTier();

    // Camera behind spaceship
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, -10);

    // Destination planet
    this.createDestinationPlanet();
    this.scheduleNextStageVisualPrewarm();

    // Clear systems
    this.stars.length = 0;
    this.meteorites.length = 0;
    this.spawnSystem.reset();
    this.spawnSystem.setMeteoriteIntervalMultiplier(1);
    this.boostSystem.reset();
    this.scoreSystem.resetStage();

    // HUD
    const stageName = `ステージ${this.stageConfig.stageNumber}: ${this.stageConfig.emoji} ${this.stageConfig.displayName}`;
    this.hud.show(stageName, this.stageConfig.planetColor);
    this.hud.setBoostCallback(() => {
      this.inputSystem.setBoostPressed(true);
    });
    this.hud.setBoostDeniedCallback(() => {
      this.audioManager.playSFX('boostDenied');
    });
    this.hud.setHomeCallback(() => {
      this.isHomeConfirmOpen = false;
      this.shouldResumeAfterHomeConfirm = false;
      this.syncBoostInputLock();
      this.syncPauseAvailability();
      this.sceneManager.requestTransition('title');
    });
    this.hud.setHomeConfirmOpenCallback(() => {
      this.shouldResumeAfterHomeConfirm = this.isPlaying();
      this.clearBlockedGameplayInput();
      this.isHomeConfirmOpen = true;
      this.syncBoostInputLock();
      this.syncPauseAvailability();
    });
    this.hud.setHomeConfirmCancelCallback(() => {
      const shouldResume = this.shouldResumeAfterHomeConfirm;
      this.isHomeConfirmOpen = false;
      this.shouldResumeAfterHomeConfirm = false;
      this.syncPauseAvailability();
      if (shouldResume) {
        this.requestResumeCountdown();
        return;
      }
      this.syncBoostInputLock();
    });
    this.hud.setPauseCallback(() => {
      this.requestManualPause();
    });
    this.hud.setMuteState(this.audioManager.isMuted());
    this.hud.setMuteCallback(() => {
      const newMuted = this.audioManager.toggleMute();
      this.hud.setMuteState(newMuted);
      const data = this.saveManager.load();
      data.muted = newMuted;
      this.saveManager.save(data);
    });
    this.hud.update(this.scoreSystem.getStageScore(), this.scoreSystem.getStarCount());
    this.hud.hideAssistMessage();
    this.touchGuide.show('intro');
    this.syncPauseAvailability();

    // Companions
    const saveData = this.saveManager.load();
    // Show personal best ⭐ for this stage in the HUD so the child can see
    // their target score during play. enter() runs on every (re)entry so a
    // freshly-updated best (from a prior clear) is reflected immediately.
    this.hud.setBestStarCount(saveData.bestStageStars?.[this.stageNumber] ?? 0);
    this.companionManager?.resetUnlockedPlanets(saveData.unlockedPlanets);
    if (this.bgStars) {
      followCameraZ(this.bgStars, this.spaceship.position.z, BG_STAR_PARALLAX);
    }

    // BGM
    this.audioManager.playBGM(this.stageNumber);

    this.stageIntroOverlay?.dispose();
    this.stageIntroOverlay = null;

    // Stage start flow. Campaign transitions can show a short planet intro
    // card before the existing countdown; retries / encyclopedia launches keep
    // the existing tempo.
    this.startOpeningSequence(context);
  }

  private prefetchEndingSceneModuleIfNeeded(): void {
    if (this.stageNumber < TOTAL_STAGES - 1) {
      return;
    }

    const prefetchSceneModule = (this.sceneManager as SceneManager & {
      prefetchSceneModule?: (sceneType: 'ending') => Promise<void>;
    }).prefetchSceneModule;

    const prefetchPromise = prefetchSceneModule?.call(this.sceneManager, 'ending');
    void prefetchPromise?.catch(() => {});
  }

  private startOpeningSequence(context: SceneContext): void {
    this.isStarting = true;
    this.syncBoostInputLock();
    this.syncPauseAvailability();

    if (!this.shouldShowStageIntro(context)) {
      this.startCountdown();
      return;
    }

    const entry = getPlanetEncyclopediaEntry(this.stageNumber);
    if (!entry) {
      this.startCountdown();
      return;
    }

    this.stageIntroOverlay = new StageIntroOverlay(entry);
    this.stageIntroOverlay.show(() => {
      this.stageIntroOverlay = null;
      this.startCountdown();
    });
  }

  private startCountdown(): void {
    this.isStarting = true;
    this.syncBoostInputLock();
    this.syncPauseAvailability();
    if (this.shouldSkipCountdown()) {
      this.isStarting = false;
      this.countdownOverlay = null;
      this.syncBoostInputLock();
      this.syncPauseAvailability();
      return;
    }
    this.countdownOverlay = new CountdownOverlay({
      onTick: () => {
        this.audioManager.playSFX('countdownTick');
      },
      onGo: () => {
        this.audioManager.playSFX('countdownGo');
      },
    });
    this.countdownOverlay.show(() => {
      this.isStarting = false;
      this.countdownOverlay = null;
      this.syncBoostInputLock();
      this.syncPauseAvailability();
    });
  }

  private shouldShowStageIntro(context: SceneContext): boolean {
    if (this.shouldSkipCountdown()) return false;
    if (this.launchSource !== 'campaign') return false;
    if (context.replayToken !== undefined) return false;
    if (context.totalScore === undefined || context.totalStarCount === undefined) return false;
    return getPlanetEncyclopediaEntry(this.stageNumber) !== undefined;
  }

  private releasePointerInputForLock(): void {
    this.inputSystem.resetPointers?.();
  }

  private syncBoostInputLock(): void {
    const locked = this.isStarting || this.awaitingResume || this.isHomeConfirmOpen || this.isPauseOpen;
    this.hud.setBoostLocked(locked);
    if (locked) {
      this.resetBoostHintState();
      this.inputSystem.setBoostPressed?.(false);
    }
  }

  private clearBlockedGameplayInput(): void {
    this.inputSystem.resetPointers?.();
    this.inputSystem.setBoostPressed?.(false);
  }

  private syncPauseAvailability(): void {
    this.hud.setPauseEnabled(this.canPause());
  }

  private shouldSkipCountdown(): boolean {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('nocount') === '1';
    } catch {
      return false;
    }
  }

  /**
   * バックグラウンド復帰時に呼ぶための公開 API。
   * このシーンが「プレイ中」であることを示し、`requestResumeCountdown()` の
   * 発火可否を main.ts 側から判断するために使う。
   *
   * プレイ中の定義:
   *   - `enter()` 済み (stageConfig が初期化されている)
   *   - クリア演出中 (`isCleared`) ではない
   *   - 開始時カウントダウン中 (`isStarting`) ではない
   *   - 既に復帰カウントダウン中 (`awaitingResume`) ではない
   */
  isPlaying(): boolean {
    if (!this.stageConfig) return false;
    if (this.isCleared) return false;
    if (this.isClearRewardOpen || this.isOpeningClearReward) return false;
    if (this.isStarting) return false;
    if (this.awaitingResume) return false;
    if (this.isHomeConfirmOpen) return false;
    if (this.isPauseOpen) return false;
    return true;
  }

  isUserPaused(): boolean {
    return this.isPauseOpen;
  }

  /**
   * バックグラウンド復帰直後に「3・2・1・スタート！」を挟んでから
   * プレイを再開させる。プレイ中でない場合や既に復帰カウントダウン中の
   * 場合は何もしない（多重表示防止）。
   *
   * Constitution I (子供ファースト): 画面から目を離している間に隕石へ
   * 即衝突する事故を防ぐ。
   */
  requestResumeCountdown(): void {
    if (!this.isPlaying()) return;
    if (this.resumeCountdownOverlay) return;
    if (this.shouldSkipCountdown()) return;

    this.clearBlockedGameplayInput();
    this.awaitingResume = true;
    this.syncBoostInputLock();
    this.syncPauseAvailability();
    this.resumeCountdownOverlay = new CountdownOverlay({
      onTick: () => {
        this.audioManager.playSFX('countdownTick');
      },
      onGo: () => {
        this.audioManager.playSFX('countdownGo');
      },
    });
    this.resumeCountdownOverlay.show(() => {
      this.awaitingResume = false;
      this.resumeCountdownOverlay = null;
      this.syncBoostInputLock();
      this.syncPauseAvailability();
    });
  }

  setPauseHandlers(handlers: StagePauseHandlers): void {
    this.onPauseRequested = handlers.onPauseRequested ?? null;
    this.onResumeRequested = handlers.onResumeRequested ?? null;
    this.onExitHomeRequested = handlers.onExitHomeRequested ?? null;
  }

  isManuallyPaused(): boolean {
    return this.isPauseOpen;
  }

  requestManualPause(): void {
    if (!this.canPause()) return;

    this.clearBlockedGameplayInput();
    this.isPauseOpen = true;
    this.syncBoostInputLock();
    this.syncPauseAvailability();
    this.pauseOverlay.show(
      () => {
        this.isPauseOpen = false;
        this.syncBoostInputLock();
        this.syncPauseAvailability();
        this.onResumeRequested?.();
      },
      () => {
        this.isPauseOpen = false;
        this.syncBoostInputLock();
        this.syncPauseAvailability();
        this.onExitHomeRequested?.();
      },
    );
    this.onPauseRequested?.();
  }

  private canPause(): boolean {
    if (!this.stageConfig) return false;
    if (this.isCleared) return false;
    if (this.isClearRewardOpen || this.isOpeningClearReward) return false;
    if (this.isStarting) return false;
    if (this.awaitingResume) return false;
    if (this.isHomeConfirmOpen) return false;
    if (this.isPauseOpen) return false;
    return true;
  }

  private createBackground(): void {
    if (this.bgStars) return;
    this.bgStars = buildStageBackground(this.getBackgroundStarDrawCount());
    this.threeScene.add(this.bgStars);
  }

  private createDestinationPlanet(): void {
    this.removeDestinationPlanet();
    const goalZ = -(this.stageConfig.stageLength + 50);
    const { planet, spinTarget } = buildStageDestinationPlanet(
      this.stageNumber,
      this.stageConfig,
      goalZ,
    );
    this.destinationPlanet = planet;
    this.destinationPlanetSpinTarget = spinTarget;
    this.threeScene.add(this.destinationPlanet);
  }

  private scheduleNextStageVisualPrewarm(): void {
    const nextStageNumber = this.stageNumber + 1;
    if (nextStageNumber > TOTAL_STAGES) {
      return;
    }
    const requestToken = this.prewarmRequestToken;
    this.scheduleIdleTask(() => {
      if (!this.isActive || this.prewarmRequestToken !== requestToken) {
        return;
      }
      prewarmStageVisualAssets(nextStageNumber);
    });
  }

  private removeDestinationPlanet(): void {
    if (!this.destinationPlanet) return;
    this.destinationPlanet.parent?.remove(this.destinationPlanet);
    this.destinationPlanet = null;
    this.destinationPlanetSpinTarget = null;
  }

  private resetStageObjects(): void {
    this.clearRewardOverlay?.hide();
    this.stageClearOverlay.hide();
    this.isClearRewardOpen = false;
    this.isOpeningClearReward = false;
    this.removeDestinationPlanet();
    this.resetCameraShake();
    this.particleBurstManager.clear(this.threeScene);
    this.spawnSystem.recycleAll();
    this.spawnSystem.setMeteoriteIntervalMultiplier(1);
    this.stars.length = 0;
    this.meteorites.length = 0;
    this.hud?.hideAssistMessage();
    this.resetBoostHintState();
  }


  update(deltaTime: number): void {
    if (!this.initialized) {
      return;
    }
    if (this.isCleared) {
      this.resetBoostHintState();
      this.clearTimer += deltaTime;
      // Keep companion entrance animation progressing during clear screen
      this.companionManager?.update(
        deltaTime,
        this.spaceship.position.x,
        this.spaceship.position.y,
        this.spaceship.position.z,
      );
      this.revealClearActionButtonsIfReady();
      return;
    }

    // Countdown gate: while the start countdown OR the background-resume
    // countdown is showing, freeze input, spawning, and ship forward motion.
    // Only the destination planet's gentle spin and background-star centering
    // keep moving so the scene feels alive (Constitution I/IV).
    if (this.isStarting || this.awaitingResume || this.isHomeConfirmOpen || this.isPauseOpen) {
      this.resetBoostHintState();
      this.inputSystem.setBoostPressed?.(false);
      if (!this.isHomeConfirmOpen && !this.isPauseOpen) {
        const hadStageIntro = this.stageIntroOverlay?.isActive() ?? false;
        this.stageIntroOverlay?.tick(deltaTime);
        if (!hadStageIntro) {
          this.countdownOverlay?.tick(deltaTime);
        }
        this.resumeCountdownOverlay?.tick(deltaTime);
      }
      if (this.destinationPlanetSpinTarget) {
        this.destinationPlanetSpinTarget.rotation.y +=
          deltaTime * StageScene.DESTINATION_PLANET_SPIN_SPEED;
      }
      if (this.bgStars) {
        followCameraZ(this.bgStars, this.spaceship.position.z, BG_STAR_PARALLAX);
      }
      this.airShield.setPosition(
        this.spaceship.position.x,
        this.spaceship.position.y,
        this.spaceship.position.z,
      );
      this.airShield.update(deltaTime);
      this.hud.update(this.scoreSystem.getStageScore(), this.scoreSystem.getStarCount());
      return;
    }

    const input = this.inputSystem.getState();
    this.playTime += deltaTime;
    this.updateAssistTimers(deltaTime);
    this.updateTouchGuide(input.moveDirection, deltaTime);

    // Capture boost state before changes
    const wasActive = this.boostSystem.isActive();
    const wasAvailable = this.boostSystem.isAvailable();

    // Boost activation
    if (input.boostPressed) {
      if (this.boostSystem.activate()) {
        this.audioManager.playSFX('boost');
        this.audioManager.startBoostSFX();
        this.boostFlameEffect.start();
      } else {
        this.audioManager.playSFX('boostDenied');
      }
      this.inputSystem.setBoostPressed(false);
    }
    this.boostSystem.update(deltaTime);

    // Boost end detection (wasActive → !isActive)
    if (wasActive && !this.boostSystem.isActive()) {
      this.audioManager.stopBoostSFX();
      this.boostFlameEffect.stopEmitting();
    }

    // Cooldown completion detection
    if (!wasAvailable && this.boostSystem.isAvailable()) {
      this.audioManager.playSFX('boostReady');
      this.hud.flashBoostReady();
    }

    this.updateBoostHint(deltaTime);

    // Apply boost state to spaceship
    if (this.boostSystem.isActive() && this.spaceship.speedState !== 'BOOST') {
      this.spaceship.activateBoost();
    }

    // Movement
    if (input.moveDirection === -1) {
      this.spaceship.moveLeft(deltaTime);
    } else if (input.moveDirection === 1) {
      this.spaceship.moveRight(deltaTime);
    }

    // Update spaceship
    this.spaceship.update(deltaTime);

    // Spawn
    const spawnResult = this.spawnSystem.update(
      deltaTime,
      this.spaceship.position.z,
      this.stageConfig,
      this.stars,
      this.meteorites,
    );
    for (const star of spawnResult.newStars) {
      this.stars.push(star);
      this.threeScene.add(star.mesh);
    }
    for (const met of spawnResult.newMeteorites) {
      this.meteorites.push(met);
      this.threeScene.add(met.mesh);
    }

    // Note: star.update() (rainbow hue / Y rotation) is folded into the
    // retain branch of cleanupPassedObjects() below so this.stars is walked
    // only once per frame. Collision detection does not depend on per-frame
    // rotation/hue, so the reordering is visually equivalent.
    // The same single-pass folding is applied to meteorite.update() (X/Z
    // rotation) inside cleanupPassedObjects(); do not call met.update() here.

    // Companion orbit update
    this.companionManager?.update(
      deltaTime,
      this.spaceship.position.x,
      this.spaceship.position.y,
      this.spaceship.position.z,
    );

    // Collision (with companion star attraction bonus)
    const companionBonus = this.companionManager?.getStarAttractionBonus() ?? 0;
    const collisionResult = this.collisionSystem.check(this.spaceship, this.stars, this.meteorites, companionBonus);

    // Star collection
    for (const star of collisionResult.starCollisions) {
      this.scoreSystem.addStarScore(star.starType);
      if (star.starType === 'RAINBOW') {
        this.audioManager.playSFX('rainbowCollect');
        this.particleBurstManager.emit(
          this.threeScene,
          star.position.x,
          star.position.y,
          star.position.z,
          0xffdd00,
          50,
          true,
        );
      } else {
        this.audioManager.playSFX('starCollect');
        this.particleBurstManager.emit(
          this.threeScene,
          star.position.x,
          star.position.y,
          star.position.z,
          0xffdd00,
          20,
          false,
        );
      }
    }

    // Note: Score/SFX/particle emit above already consumed the collected
    // star positions. The actual array compaction + pool release for both
    // collected stars and stars that drifted behind happens in a single
    // pass inside cleanupPassedObjects() below, so this.stars is only walked
    // once per frame even when collisions occurred.

    // Meteorite hit
    if (collisionResult.meteoriteCollision) {
      // Mark the hit meteorite consumed so subsequent frames early-continue
      // in CollisionSystem.check() and cannot register a duplicate hit (e.g.
      // after SLOWDOWN invincibility ends but the meteorite is still within
      // collision range). cleanupPassedObjects() runs at the end of this same
      // frame and returns inactive meteorites to the pool immediately, so we
      // don't pay 18-36 frames of empty CollisionSystem / scene-graph scans
      // while waiting for the meteorite to scroll past behindThreshold.
      if (collisionResult.meteoriteHit) {
        const hit = collisionResult.meteoriteHit;
        hit.isActive = false;
        // Hide the hit meteorite immediately so it does not appear to fly
        // past the spaceship after collision; mirrors the "stars vanish on
        // pickup" feedback for UX consistency. Visibility is restored by
        // Meteorite.reset()/recycle() before the mesh re-enters the pool.
        hit.mesh.visible = false;
        // Subtle orange particle burst at the hit position to signal impact
        // without distracting from gameplay; uses the non-rainbow burst
        // variant for the same low cost as a regular star pickup.
        this.particleBurstManager.emit(
          this.threeScene,
          hit.position.x,
          hit.position.y,
          hit.position.z,
          0xffaa44,
          24,
          false,
        );
      }
      this.spaceship.onMeteoriteHit();
      this.recordMeteoriteHit();
      this.boostSystem.cancel();
      this.damageTimer = StageScene.DAMAGE_FLASH_DURATION;
      this.startCameraShake();
      this.audioManager.playSFX('meteoriteHit');
      this.audioManager.stopBoostSFX();
      this.boostFlameEffect.remove();
    }

    // Damage animation (overrides bank rotation while active)
    this.updateDamageEffect(deltaTime);

    // Deactivate passed objects
    this.cleanupPassedObjects(deltaTime);

    // Camera follow
    this.updateCameraFollow(deltaTime);

    for (const star of collisionResult.starCollisions) {
      this.scorePopupManager.show(star.scoreValue, star.position, this.camera);
    }

    // Sun pulse animation
    if (this.stageNumber === 10 && this.destinationPlanet) {
      const s = 1.0 + Math.sin(this.elapsedTime * 2) * 0.05;
      this.destinationPlanet.scale.set(s, s, s);
    }
    // Gentle Y-axis self-rotation for the goal planet (Constitution I/II:
    // a "living universe" feel). For ringed planets the spin target is the
    // sphere body only so the ring keeps its tilt; for the sun this composes
    // with the parent group's pulse-scale.
    if (this.destinationPlanetSpinTarget) {
      this.destinationPlanetSpinTarget.rotation.y +=
        deltaTime * StageScene.DESTINATION_PLANET_SPIN_SPEED;
    }
    this.elapsedTime += deltaTime;

    // Keep background star field centered around the spaceship so the
    // sky doesn't appear empty deep into the stage (Constitution IV).
    if (this.bgStars) {
      followCameraZ(this.bgStars, this.spaceship.position.z, BG_STAR_PARALLAX);
    }

    // Boost visual effects
    this.boostLinesEffect.update(
      this.boostSystem.isActive(),
      this.spaceship.position.x,
      this.spaceship.position.z,
    );

    // Boost flame particles
    if (this.boostSystem.isActive()) {
      this.boostFlameEffect.emit(this.spaceship.position, this.boostSystem.getDurationProgress());
    }
    this.boostFlameEffect.update(deltaTime);

    // Air shield sync
    this.airShield.setPosition(
      this.spaceship.position.x,
      this.spaceship.position.y,
      this.spaceship.position.z,
    );
    // Air shield mode: BOOST (blue) > INVINCIBLE (pink, post-hit) > OFF.
    // During SLOWDOWN the shield stays at full strength so kids see they're
    // safe; during RECOVERING it fades out 1→0 over the recovery window.
    if (this.boostSystem.isActive()) {
      this.airShield.setShieldMode('BOOST');
    } else if (this.spaceship.speedState === 'SLOWDOWN') {
      this.airShield.setShieldMode('INVINCIBLE', 1);
    } else if (this.spaceship.speedState === 'RECOVERING') {
      this.airShield.setShieldMode('INVINCIBLE', this.spaceship.getSpeedStateRemainingRatio());
    } else {
      this.airShield.setShieldMode('OFF');
    }
    this.airShield.update(deltaTime);

    // Particle effects
    this.particleBurstManager.update(this.threeScene, deltaTime);

    // HUD update
    this.hud.update(this.scoreSystem.getStageScore(), this.scoreSystem.getStarCount());
    this.hud.updateCooldown(this.boostSystem.getCooldownProgress());

    // Check stage clear
    const progress = this.spaceship.getProgress(this.stageConfig.stageLength);
    this.hud.updateStageProgress(progress);
    if (progress >= 1) {
      this.onStageClear();
    }
  }

  private updateTouchGuide(moveDirection: number, deltaTime: number): void {
    if (this.assistTimer > 0) {
      this.setTouchGuideMode(this.getAssistTouchGuideMode());
      return;
    }

    if (moveDirection !== 0) {
      this.touchGuideIdleTimer = 0;
      this.hasSeenMoveInput = true;
      this.setTouchGuideMode(moveDirection < 0 ? 'active-left' : 'active-right');
      return;
    }

    if (!this.hasSeenMoveInput) {
      this.setTouchGuideMode('intro');
      return;
    }

    this.touchGuideIdleTimer += deltaTime;
    if (this.touchGuideIdleTimer >= StageScene.TOUCH_GUIDE_IDLE_DELAY) {
      this.setTouchGuideMode('idle');
      return;
    }

    this.setTouchGuideMode('hidden');
  }

  private setTouchGuideMode(mode: TouchGuideMode): void {
    if (this.touchGuideMode === mode) return;
    this.touchGuideMode = mode;
    this.touchGuide.setMode(mode);
  }

  private resetAssistNavigation(): void {
    this.meteoriteHitTimes.length = 0;
    this.assistTimer = 0;
    this.assistMessageTimer = 0;
    this.assistDirection = null;
    this.assistDirectionRefreshTimer = 0;
  }

  private updateAssistTimers(deltaTime: number): void {
    if (this.assistTimer > 0) {
      this.assistDirectionRefreshTimer = Math.max(0, this.assistDirectionRefreshTimer - deltaTime);
      if (this.assistDirectionRefreshTimer === 0) {
        this.refreshAssistDirection();
      }
      this.assistTimer = Math.max(0, this.assistTimer - deltaTime);
      if (this.assistTimer === 0) {
        this.spawnSystem.setMeteoriteIntervalMultiplier(1);
        this.assistDirection = null;
        this.assistDirectionRefreshTimer = 0;
      }
    }

    if (this.assistMessageTimer > 0) {
      this.assistMessageTimer = Math.max(0, this.assistMessageTimer - deltaTime);
      if (this.assistMessageTimer === 0) {
        this.hud.hideAssistMessage();
      }
    }
  }

  private resetBoostHintState(): void {
    this.boostHintReadyTimer = 0;
    this.boostHintDisplayTimer = 0;
    this.boostHintNextTrigger = StageScene.BOOST_HINT_INITIAL_DELAY;
    this.hud?.hideBoostHint();
  }

  private updateBoostHint(deltaTime: number): void {
    const boostReady = this.boostSystem.isAvailable() && !this.boostSystem.isActive();
    if (!boostReady) {
      this.resetBoostHintState();
      return;
    }

    if (this.boostHintDisplayTimer > 0) {
      this.boostHintDisplayTimer = Math.max(0, this.boostHintDisplayTimer - deltaTime);
      if (this.boostHintDisplayTimer === 0) {
        this.hud.hideBoostHint();
      }
    }

    this.boostHintReadyTimer += deltaTime;
    if (this.boostHintReadyTimer < this.boostHintNextTrigger) {
      return;
    }

    this.hud.showBoostHint(StageScene.BOOST_HINT_MESSAGE);
    this.boostHintDisplayTimer = StageScene.BOOST_HINT_DURATION;
    this.boostHintReadyTimer = 0;
    this.boostHintNextTrigger = StageScene.BOOST_HINT_REPEAT_DELAY;
  }

  private recordMeteoriteHit(): void {
    const now = this.playTime;
    this.meteoriteHitTimes.push(now);
    while (
      this.meteoriteHitTimes.length > 0 &&
      now - this.meteoriteHitTimes[0] > StageScene.ASSIST_TRIGGER_HIT_WINDOW
    ) {
      this.meteoriteHitTimes.shift();
    }

    if (this.assistTimer > 0) {
      return;
    }
    if (this.meteoriteHitTimes.length < StageScene.ASSIST_TRIGGER_HIT_COUNT) {
      return;
    }

    this.activateAssistMode();
  }

  private activateAssistMode(): void {
    this.assistTimer = StageScene.ASSIST_DURATION;
    this.assistMessageTimer = StageScene.ASSIST_MESSAGE_DURATION;
    this.assistDirectionRefreshTimer = 0;
    this.refreshAssistDirection();
    this.spawnSystem.setMeteoriteIntervalMultiplier(StageScene.ASSIST_METEORITE_INTERVAL_MULTIPLIER);
    this.hud.showAssistMessage(StageScene.ASSIST_MESSAGE);
    this.meteoriteHitTimes.length = 0;
  }

  private refreshAssistDirection(): void {
    this.assistDirection = this.getSaferAssistDirection();
    this.assistDirectionRefreshTimer = StageScene.ASSIST_DIRECTION_REFRESH_INTERVAL;
  }

  private getAssistTouchGuideMode(): TouchGuideMode {
    if (this.assistDirection === 'left') return 'assist-left';
    if (this.assistDirection === 'right') return 'assist-right';
    return 'hidden';
  }

  private getSaferAssistDirection(): AssistDirection | null {
    const shipX = this.spaceship.position.x;
    const shipZ = this.spaceship.position.z;
    const leftTargetX = Math.min(shipX - 2.5, -StageScene.ASSIST_DIRECTION_SIDE_TARGET_X);
    const rightTargetX = Math.max(shipX + 2.5, StageScene.ASSIST_DIRECTION_SIDE_TARGET_X);
    let leftDanger = 0;
    let rightDanger = 0;

    for (const meteorite of this.meteorites) {
      if (!meteorite.isActive) continue;
      const aheadDistance = shipZ - meteorite.position.z;
      if (aheadDistance < 0 || aheadDistance > StageScene.ASSIST_DIRECTION_LOOKAHEAD) continue;

      const proximityWeight = 1 + (StageScene.ASSIST_DIRECTION_LOOKAHEAD - aheadDistance) / 7;
      const leftDistance = Math.abs(meteorite.position.x - leftTargetX);
      const rightDistance = Math.abs(meteorite.position.x - rightTargetX);
      const leftWeight = Math.max(0, 1 - leftDistance / StageScene.ASSIST_DIRECTION_SIDE_RANGE);
      const rightWeight = Math.max(0, 1 - rightDistance / StageScene.ASSIST_DIRECTION_SIDE_RANGE);

      leftDanger += proximityWeight * leftWeight;
      rightDanger += proximityWeight * rightWeight;
    }

    const diff = Math.abs(leftDanger - rightDanger);
    const maxDanger = Math.max(leftDanger, rightDanger);
    if (diff < StageScene.ASSIST_DIRECTION_DIFF_THRESHOLD) {
      return null;
    }
    if (maxDanger > 0 && diff < maxDanger * StageScene.ASSIST_DIRECTION_DIFF_RATIO) {
      return null;
    }

    return leftDanger < rightDanger ? 'left' : 'right';
  }

  private updateDamageEffect(deltaTime: number): void {
    if (this.damageTimer > 0) {
      this.damageTimer -= deltaTime;
      if (this.damageTimer <= 0) {
        // Damage flash just ended this frame: reset wobble residue so that
        // Spaceship.update()'s "rest skip" optimization doesn't leave the
        // ship visibly tilted. Subsequent frames take the no-write else-branch.
        this.damageTimer = 0;
        this.spaceship.mesh.rotation.z = 0;
        this.spaceship.mesh.rotation.y = 0;
        this.spaceship.mesh.visible = true;
        return;
      }
      const wobble = Math.sin(this.damageTimer * 30) * 0.3;
      this.spaceship.mesh.rotation.z = wobble;
      this.spaceship.mesh.rotation.y = 0;
      // Flash effect
      const flash = Math.sin(this.damageTimer * 20) > 0;
      this.spaceship.mesh.visible = flash;
    } else {
      // Bank rotations are managed by Spaceship.update(); only ensure visibility.
      this.spaceship.mesh.visible = true;
    }
  }

  private resetCameraShake(): void {
    this.cameraShakeTimer = 0;
    this.cameraShakeElapsed = 0;
    this.cameraShakeOffset.set(0, 0, 0);
  }

  private startCameraShake(): void {
    this.cameraShakeTimer = StageScene.CAMERA_SHAKE_DURATION;
    this.cameraShakeElapsed = 0;
  }

  private updateCameraShake(deltaTime: number): void {
    if (this.cameraShakeTimer <= 0) {
      this.cameraShakeOffset.set(0, 0, 0);
      return;
    }

    this.cameraShakeElapsed += deltaTime;
    this.cameraShakeTimer = Math.max(0, this.cameraShakeTimer - deltaTime);

    if (this.cameraShakeTimer === 0) {
      this.cameraShakeOffset.set(0, 0, 0);
      return;
    }

    const decay = this.cameraShakeTimer / StageScene.CAMERA_SHAKE_DURATION;
    const phase = this.cameraShakeElapsed * StageScene.CAMERA_SHAKE_FREQUENCY;
    this.cameraShakeOffset.set(
      Math.sin(phase) * StageScene.CAMERA_SHAKE_AMPLITUDE_X * decay,
      Math.cos(phase * 0.8) * StageScene.CAMERA_SHAKE_AMPLITUDE_Y * decay,
      0,
    );
  }

  private updateCameraFollow(deltaTime: number): void {
    this.updateCameraShake(deltaTime);
    this.camera.position.set(
      this.spaceship.position.x * 0.3 + this.cameraShakeOffset.x,
      5 + this.cameraShakeOffset.y,
      this.spaceship.position.z + 12,
    );
    this.camera.lookAt(
      this.spaceship.position.x * 0.5,
      0,
      this.spaceship.position.z - 20,
    );
  }

  private cleanupPassedObjects(deltaTime: number): void {
    const shipZ = this.spaceship.position.z;
    const behindThreshold = shipZ + 30;

    const stars = this.stars;
    let starWrite = 0;
    for (let read = 0; read < stars.length; read++) {
      const star = stars[read];
      if (star.isCollected || star.position.z > behindThreshold) {
        // releaseStar handles scene detach (via recycle) and pool re-use.
        this.spawnSystem.releaseStar(star);
      } else {
        // Animate retained stars (rainbow hue cycling / Y rotation) here so
        // this.stars is walked only once per frame.
        star.update(deltaTime, shipZ);
        if (starWrite !== read) stars[starWrite] = star;
        starWrite++;
      }
    }
    stars.length = starWrite;

    const meteorites = this.meteorites;
    let metWrite = 0;
    for (let read = 0; read < meteorites.length; read++) {
      const met = meteorites[read];
      // Inactive meteorites have been consumed by a collision earlier in this
      // same frame (StageScene.update meteorite-hit branch). Returning them
      // to the pool immediately avoids 18-36 frames of empty CollisionSystem
      // checks and scene-graph traversals before they would otherwise drift
      // past behindThreshold at the spaceship's BASE_SPEED..BOOST advance.
      if (!met.isActive || met.position.z > behindThreshold) {
        this.spawnSystem.releaseMeteorite(met);
      } else {
        // Animate retained meteorites (X/Z rotation) here so this.meteorites
        // is walked only once per frame, mirroring the star retain branch.
        // The isActive guard is defensive: with the !met.isActive release path
        // above, all retained meteorites are active, but we keep the check so
        // any future code path that flips isActive without immediate cleanup
        // still doesn't animate a consumed meteorite.
        if (met.isActive) {
          met.update(deltaTime, shipZ);
        }
        if (metWrite !== read) meteorites[metWrite] = met;
        metWrite++;
      }
    }
    meteorites.length = metWrite;
  }


  private onStageClear(): void {
    this.isCleared = true;
    this.clearTimer = 0;
    this.stageClearOverlay.hide();
    this.resetAssistNavigation();
    this.resetBoostHintState();
    this.touchGuide.hide();
    this.syncPauseAvailability();
    const isNewPlanetUnlock = this.saveManager.markStageCleared(this.stageNumber);
    this.audioManager.playSFX('stageClear');
    this.audioManager.stopBoostSFX();
    this.boostFlameEffect.remove();

    // Capture previous best BEFORE updating, so we can show "じこベスト
    // こうしん" feedback only when the child actually improved.
    const earnedStars = this.scoreSystem.getStarCount();
    const previousBest = this.saveManager.load().bestStageStars?.[this.stageNumber] ?? 0;

    // Persist best (highest) star count for this stage.
    this.saveManager.updateBestStageStars(this.stageNumber, earnedStars);

    const bestStarCount = Math.max(previousBest, earnedStars);
    const isBestUpdated = earnedStars > previousBest;

    // Add companion if this is a new planet unlock
    if (isNewPlanetUnlock) {
      this.companionManager?.addCompanion(this.stageNumber);
      this.prefetchClearRewardOverlay();
    }

    this.showClearMessage(isBestUpdated, earnedStars, isNewPlanetUnlock, bestStarCount);

    if (isBestUpdated) {
      this.audioManager.playSFX('rainbowCollect');
    }
  }

  private getClearRewardOverlay(): Promise<EncyclopediaOverlayInstance> {
    if (this.clearRewardOverlay) {
      return Promise.resolve(this.clearRewardOverlay);
    }
    if (this.clearRewardOverlayPromise) {
      return this.clearRewardOverlayPromise;
    }

    this.clearRewardOverlayPromise = this.loadEncyclopediaOverlay()
      .then(({ EncyclopediaOverlay: EncyclopediaOverlayClass }) => {
        const overlay = new EncyclopediaOverlayClass();
        this.clearRewardOverlay = overlay;
        return overlay;
      })
      .finally(() => {
        this.clearRewardOverlayPromise = null;
      });

    return this.clearRewardOverlayPromise;
  }

  private isCurrentClearRewardRequest(requestToken: number): boolean {
    return this.isActive && this.clearRewardRequestToken === requestToken;
  }

  private restoreClearRewardButton(): void {
    this.stageClearOverlay.setRewardOpen(false);
  }

  private prefetchClearRewardOverlay(): void {
    if (this.clearRewardOverlay || this.clearRewardOverlayPromise) {
      return;
    }
    void this.getClearRewardOverlay().catch(() => {});
  }

  private async openClearRewardOverlay(starCount: number): Promise<void> {
    if (this.isClearRewardOpen || this.isOpeningClearReward) {
      return;
    }

    const requestToken = this.clearRewardRequestToken;
    this.isOpeningClearReward = true;
    this.stageClearOverlay.setRewardOpen(true);

    try {
      const overlay = this.clearRewardOverlay ?? await this.getClearRewardOverlay();
      if (!this.isCurrentClearRewardRequest(requestToken)) {
        return;
      }
      const didOpen = overlay.showStageDetail(this.stageNumber, () => {
        if (!this.isCurrentClearRewardRequest(requestToken)) {
          return;
        }
        this.isClearRewardOpen = false;
        this.syncPauseAvailability();
        this.restoreClearRewardButton();
      }, {
        bestStageStars: { [this.stageNumber]: starCount },
        backLabel: 'クリアへ もどる',
        zIndex: 50,
      });
      if (!didOpen) {
        this.restoreClearRewardButton();
        return;
      }
      this.isClearRewardOpen = true;
      this.syncPauseAvailability();
    } catch {
      if (!this.isCurrentClearRewardRequest(requestToken)) {
        return;
      }
      this.restoreClearRewardButton();
    } finally {
      if (this.clearRewardRequestToken === requestToken) {
        this.isOpeningClearReward = false;
        this.syncPauseAvailability();
        if (!this.isClearRewardOpen) {
          this.restoreClearRewardButton();
        }
      }
    }
  }

  private showClearMessage(
    isBestUpdated = false,
    _earnedStars?: number,
    isNewPlanetUnlock = false,
    bestStars?: number,
  ): void {
    const starCount = _earnedStars ?? this.scoreSystem.getStarCount();
    const bestStarCount = bestStars ?? starCount;
    const nextEntry = this.launchSource === 'encyclopedia'
      ? undefined
      : getNextPlanetEncyclopediaEntry(this.stageNumber);
    const rewardEntry = isNewPlanetUnlock ? getPlanetEncyclopediaEntry(this.stageNumber) : undefined;
    this.stageClearOverlay.show({
      stageNumber: this.stageNumber,
      starCount,
      bestStarCount,
      isBestUpdated,
      continueLabel: this.launchSource === 'encyclopedia'
        ? 'タイトルへ'
        : (this.stageNumber >= TOTAL_STAGES ? 'おいわいへ' : 'つぎへ'),
      nextEntry,
      rewardEntry,
      onContinue: () => {
        this.handleStageComplete();
      },
      onRetry: () => {
        this.handleStageRetry();
      },
      onReward: rewardEntry
        ? () => {
          void this.openClearRewardOverlay(starCount);
        }
        : undefined,
    });
  }

  private revealClearActionButtonsIfReady(): void {
    if (this.clearTimer < StageScene.CLEAR_CONTINUE_DELAY) return;
    this.stageClearOverlay.enableContinue();
  }

  private handleStageComplete(): void {
    const { totalScore, totalStarCount } = this.scoreSystem.finalizeStage();

    if (this.launchSource === 'encyclopedia') {
      this.sceneManager.requestTransition('title');
      return;
    }

    if (this.stageNumber >= TOTAL_STAGES) {
      this.sceneManager.requestTransition('ending', { totalScore, totalStarCount });
    } else {
      this.sceneManager.requestTransition('stage', {
        stageNumber: this.stageNumber + 1,
        totalScore,
        totalStarCount,
      });
    }
  }

  private handleStageRetry(): void {
    const context: SceneContext = {
      stageNumber: this.stageNumber,
      totalScore: this.stageEntryTotalScore,
      totalStarCount: this.stageEntryTotalStarCount,
      replayToken: Date.now() + Math.random(),
    };
    if (this.launchSource !== 'campaign') {
      context.launchSource = this.launchSource;
    }
    this.sceneManager.requestTransition('stage', context);
  }

  exit(): void {
    if (!this.initialized) {
      return;
    }
    this.isActive = false;
    this.prewarmRequestToken += 1;
    this.clearRewardRequestToken += 1;
    this.clearRewardOverlay?.hide();
    this.stageClearOverlay.hide();
    this.isClearRewardOpen = false;
    this.isOpeningClearReward = false;
    this.pauseOverlay.hide();
    this.touchGuide.hide();
    this.hud.hide();
    this.scorePopupManager.dispose();
    this.audioManager.stopBGM();
    this.audioManager.stopBoostSFX();
    if (this.stageIntroOverlay) {
      this.stageIntroOverlay.dispose();
      this.stageIntroOverlay = null;
    }
    if (this.countdownOverlay) {
      this.countdownOverlay.dispose();
      this.countdownOverlay = null;
    }
    if (this.resumeCountdownOverlay) {
      this.resumeCountdownOverlay.dispose();
      this.resumeCountdownOverlay = null;
    }
    this.isStarting = false;
    this.awaitingResume = false;
    this.isHomeConfirmOpen = false;
    this.shouldResumeAfterHomeConfirm = false;
    this.isPauseOpen = false;
    this.shouldResumeAfterPause = false;
    this.boostFlameEffect.remove();
    this.boostLinesEffect.update(false, this.spaceship.position.x, this.spaceship.position.z);
    this.airShield.reset(this.spaceship.position.x, this.spaceship.position.y, this.spaceship.position.z);
    this.resetStageObjects();
    if (this.bgStars) {
      this.bgStars.parent?.remove(this.bgStars);
      this.bgStars = null;
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

  private applyVisualQualityTier(): void {
    const clampedTier = StageScene.clampVisualQualityTier(this.visualQualityTier);
    this.particleBurstManager.setQualityTier(clampedTier);
    if (!this.initialized) {
      if (this.bgStars) {
        this.bgStars.geometry.setDrawRange(0, this.getBackgroundStarDrawCount());
      }
      return;
    }
    this.boostLinesEffect.setQualityTier(clampedTier);
    this.boostFlameEffect.setQualityTier(clampedTier);
    if (this.bgStars) {
      this.bgStars.geometry.setDrawRange(0, this.getBackgroundStarDrawCount());
    }
  }

  private getBackgroundStarDrawCount(): number {
    return Math.max(
      1,
      Math.round(StageScene.BG_STAR_COUNT * StageScene.getVisualQualityScale(this.visualQualityTier)),
    );
  }

  private static clampVisualQualityTier(tier: number): number {
    const maxTier = StageScene.VISUAL_QUALITY_SCALE_BY_TIER.length - 1;
    return Math.max(0, Math.min(maxTier, Math.round(tier)));
  }

  private static getVisualQualityScale(tier: number): number {
    return StageScene.VISUAL_QUALITY_SCALE_BY_TIER[StageScene.clampVisualQualityTier(tier)];
  }
}
