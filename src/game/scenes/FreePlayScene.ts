import * as THREE from 'three';
import type { Scene, SceneContext, StageConfig } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { InputSystem } from '../systems/InputSystem';
import type { AudioManager } from '../audio/AudioManager';
import type { SaveManager } from '../storage/SaveManager';
import { Spaceship } from '../entities/Spaceship';
import { CompanionManager } from '../entities/CompanionManager';
import { getStageAtmosphereConfig } from '../config/StageAtmosphereConfig';
import { getStageConfig, TOTAL_STAGES } from '../config/StageConfig';
import { createDestinationPlanet, createStageBackground } from './stageVisualAssets';
import { StageAtmosphereEffect } from '../effects/StageAtmosphereEffect';
import { FreePlayEffectSystem } from '../systems/FreePlayEffectSystem';
import { attachReleaseConfirmButton } from '../../ui/attachReleaseConfirmButton';
import { getViewportSize } from '../utils/getViewportSize';
import { followCameraZ } from '../utils/followCameraZ';

interface FreePlaySceneOptions {
  randomProvider?: () => number;
  stageDurationSeconds?: number;
  effectSystem?: FreePlayEffectSystem;
}

export class FreePlayScene implements Scene {
  private readonly threeScene = new THREE.Scene();
  private readonly ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
  private readonly directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  private readonly camera: THREE.PerspectiveCamera;
  private readonly stageAtmosphereEffect = new StageAtmosphereEffect();
  private readonly randomProvider: () => number;
  private readonly effectSystem: FreePlayEffectSystem;
  private readonly stageDurationSeconds: number;
  private readonly overlayButtonCleanups = new Set<() => void>();
  private readonly currentLookAt = new THREE.Vector3();
  private ship: Spaceship | null = null;
  private companionManager: CompanionManager | null = null;
  private backgroundStars: THREE.Points | null = null;
  private currentPlanet: THREE.Group | null = null;
  private currentPlanetSpinTarget: THREE.Object3D | null = null;
  private overlay: HTMLDivElement | null = null;
  private stageLabel: HTMLDivElement | null = null;
  private companionBadge: HTMLDivElement | null = null;
  private currentStageNumber = 1;
  private currentStageConfig: StageConfig = getStageConfig(1);
  private stageTimeRemaining = 0;
  private lastAspect = 0;
  private isActive = false;

  constructor(
    private readonly sceneManager: SceneManager,
    private readonly inputSystem: InputSystem,
    private readonly audioManager: AudioManager,
    private readonly saveManager: SaveManager,
    options: FreePlaySceneOptions = {},
  ) {
    this.randomProvider = options.randomProvider ?? Math.random;
    this.effectSystem = options.effectSystem ?? new FreePlayEffectSystem({
      randomProvider: this.randomProvider,
    });
    this.stageDurationSeconds = options.stageDurationSeconds ?? 8;
    const { width, height } = getViewportSize();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1400);
    this.camera.position.set(0, 2.8, 12);
    this.threeScene.background = new THREE.Color(0x000020);
    this.directionalLight.position.set(4, 6, 5);
    this.stageAtmosphereEffect.init(this.threeScene);
    this.effectSystem.init(this.threeScene);
  }

  enter(_context: SceneContext): void {
    this.isActive = true;
    this.lastAspect = 0;
    this.inputSystem.resetPointers?.();
    this.setupSceneObjects();
    this.createOverlay();
    this.audioManager.playBGM(0);
  }

  update(deltaTime: number): void {
    if (!this.isActive || !this.ship) {
      return;
    }

    const safeDelta = Math.max(0, deltaTime);
    const inputState = this.inputSystem.getState();
    if (inputState.moveDirection < 0) {
      this.ship.moveLeft(safeDelta);
    } else if (inputState.moveDirection > 0) {
      this.ship.moveRight(safeDelta);
    }
    this.ship.update(safeDelta);

    const shipPosition = this.ship.mesh.position;
    this.companionManager?.update(safeDelta, shipPosition.x, shipPosition.y + 1.15, shipPosition.z + 0.8);
    this.effectSystem.update(safeDelta, shipPosition);
    this.stageAtmosphereEffect.update(safeDelta, this.camera, shipPosition.x, shipPosition.z);
    this.updateCamera();
    this.updatePlanet(safeDelta);
    this.updateStageRotation(safeDelta);
    if (this.backgroundStars) {
      this.backgroundStars.rotation.y += safeDelta * 0.02;
      followCameraZ(this.backgroundStars, shipPosition.z, 1);
    }
  }

  exit(): void {
    this.isActive = false;
    this.inputSystem.resetPointers?.();
    this.audioManager.stopBGM();
    this.effectSystem.clear();
    this.stageAtmosphereEffect.clear();
    this.companionManager?.dispose();
    this.companionManager = null;
    this.ship?.dispose();
    this.ship = null;
    this.clearPlanet();
    if (this.backgroundStars) {
      this.backgroundStars.parent?.remove(this.backgroundStars);
      this.backgroundStars = null;
    }
    const cleanupFns = Array.from(this.overlayButtonCleanups);
    this.overlayButtonCleanups.clear();
    for (const cleanup of cleanupFns) {
      cleanup();
    }
    this.overlay?.remove();
    this.overlay = null;
    this.stageLabel = null;
    this.companionBadge = null;
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

  private setupSceneObjects(): void {
    this.threeScene.background = new THREE.Color(0x000020);
    if (!this.ambientLight.parent) {
      this.threeScene.add(this.ambientLight);
    }
    if (!this.directionalLight.parent) {
      this.threeScene.add(this.directionalLight);
    }

    this.backgroundStars = createStageBackground(2000);
    this.backgroundStars.name = 'free-play-background-stars';
    this.threeScene.add(this.backgroundStars);

    const saveData = this.saveManager.load();
    this.ship = new Spaceship(saveData.spaceshipCustomization);
    this.ship.mesh.name = 'free-play-spaceship';
    this.ship.mesh.position.set(0, -0.3, 0);
    this.ship.boundaryMin = -9;
    this.ship.boundaryMax = 9;
    this.threeScene.add(this.ship.mesh);

    this.companionManager = new CompanionManager([...new Set(saveData.unlockedPlanets)]);
    const companionGroup = this.companionManager.getGroup();
    companionGroup.name = 'free-play-companions';
    this.threeScene.add(companionGroup);
    this.updateCompanionBadge();

    this.applyStage(this.pickRandomStage());
  }

  private createOverlay(): void {
    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) {
      return;
    }

    this.overlay = document.createElement('div');
    this.overlay.setAttribute('data-free-play-overlay', '');
    this.overlay.style.cssText = `
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      padding: 1rem 1.25rem;
      box-sizing: border-box;
      pointer-events: none;
    `;

    const topRow = document.createElement('div');
    topRow.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    `;

    const infoCard = document.createElement('div');
    infoCard.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      padding: 0.85rem 1rem;
      border-radius: 1.5rem;
      background: rgba(7, 16, 56, 0.62);
      color: #fff;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
    `;

    const title = document.createElement('div');
    title.textContent = 'あそびの うちゅう';
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.55rem;
      font-weight: 900;
      color: #ffe66d;
    `;

    this.stageLabel = document.createElement('div');
    this.stageLabel.setAttribute('data-free-play-stage-label', '');
    this.stageLabel.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
    `;

    this.companionBadge = document.createElement('div');
    this.companionBadge.setAttribute('data-free-play-companion-count', '');
    this.companionBadge.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.92);
    `;

    infoCard.append(title, this.stageLabel, this.companionBadge);

    const backButton = document.createElement('button');
    backButton.textContent = 'もどる';
    backButton.setAttribute('data-free-play-back-button', '');
    backButton.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.15rem;
      font-weight: 900;
      padding: 0.75rem 1.6rem;
      border: none;
      border-radius: 999px;
      background: linear-gradient(135deg, #7bd9ff, #b197fc);
      color: #1f2040;
      cursor: pointer;
      pointer-events: auto;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
    `;
    this.overlayButtonCleanups.add(attachReleaseConfirmButton(backButton, {
      onActivate: () => {
        this.inputSystem.resetPointers?.();
        this.sceneManager.requestTransition('title');
      },
      onPressChange: (pressed) => {
        backButton.style.transform = pressed ? 'scale(0.96)' : 'scale(1)';
      },
    }));

    topRow.append(infoCard, backButton);

    const bottomHint = document.createElement('div');
    bottomHint.style.cssText = `
      align-self: center;
      padding: 0.7rem 1.1rem;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.28);
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `;
    bottomHint.textContent = '← → で ゆったり うちゅうさんぽ';

    this.overlay.append(topRow, bottomHint);
    uiOverlay.appendChild(this.overlay);
    this.updateStageLabel();
    this.updateCompanionBadge();
  }

  private updateCamera(): void {
    if (!this.ship) {
      return;
    }
    const shipPosition = this.ship.mesh.position;
    this.camera.position.x += (shipPosition.x * 0.32 - this.camera.position.x) * 0.12;
    this.camera.position.y = 2.8;
    this.camera.position.z = shipPosition.z + 12;
    this.currentLookAt.set(shipPosition.x * 0.18, shipPosition.y + 0.4, shipPosition.z - 18);
    this.camera.lookAt(this.currentLookAt);
  }

  private updatePlanet(deltaTime: number): void {
    if (!this.currentPlanet || !this.ship) {
      return;
    }
    this.currentPlanet.position.set(0, 0.5, this.ship.mesh.position.z - 52);
    this.currentPlanet.rotation.y += deltaTime * 0.08;
    this.currentPlanetSpinTarget?.rotateY(deltaTime * 0.22);
  }

  private updateStageRotation(deltaTime: number): void {
    this.stageTimeRemaining -= deltaTime;
    if (this.stageTimeRemaining > 0) {
      return;
    }
    this.applyStage(this.pickRandomStage(this.currentStageNumber));
  }

  private applyStage(stageNumber: number): void {
    this.currentStageNumber = stageNumber;
    this.currentStageConfig = getStageConfig(stageNumber);
    this.stageTimeRemaining = this.sampleStageDuration();
    this.clearPlanet();
    const { planet, spinTarget } = createDestinationPlanet(stageNumber, this.currentStageConfig, -52);
    planet.name = 'free-play-stage-planet';
    this.currentPlanet = planet;
    this.currentPlanetSpinTarget = spinTarget;
    this.threeScene.add(planet);
    this.stageAtmosphereEffect.start(getStageAtmosphereConfig(stageNumber));
    this.effectSystem.setCurrentStage(stageNumber);
    this.updateStageLabel();
  }

  private clearPlanet(): void {
    if (!this.currentPlanet) {
      return;
    }
    this.currentPlanet.parent?.remove(this.currentPlanet);
    this.currentPlanet = null;
    this.currentPlanetSpinTarget = null;
  }

  private updateStageLabel(): void {
    if (!this.stageLabel) {
      return;
    }
    this.stageLabel.textContent =
      `${this.currentStageConfig.emoji} ${this.currentStageConfig.destinationReading}の そらで あそんでるよ`;
  }

  private updateCompanionBadge(): void {
    if (!this.companionBadge) {
      return;
    }
    const count = this.companionManager?.getCount() ?? 0;
    this.companionBadge.textContent =
      count > 0 ? `👾 なかま ${count}にん と いっしょ！` : '👾 なかまを あつめると ここに くるよ！';
  }

  private sampleStageDuration(): number {
    return this.stageDurationSeconds * (0.8 + this.randomProvider() * 0.4);
  }

  private pickRandomStage(excludeStageNumber?: number): number {
    const stageNumbers = Array.from({ length: TOTAL_STAGES }, (_, index) => index + 1);
    const candidates = excludeStageNumber === undefined
      ? stageNumbers
      : stageNumbers.filter((stageNumber) => stageNumber !== excludeStageNumber);
    const index = Math.min(candidates.length - 1, Math.floor(this.randomProvider() * candidates.length));
    return candidates[index];
  }
}
