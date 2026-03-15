import * as THREE from 'three';
import type { Scene, SceneContext } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { SaveManager } from '../storage/SaveManager';
import type { AudioManager } from '../audio/AudioManager';
import { CompanionManager } from '../entities/CompanionManager';
import { PLANET_ENCYCLOPEDIA } from '../config/PlanetEncyclopedia';

export class EndingScene implements Scene {
  private static readonly CIRCLE_RADIUS = 3.0;
  private static readonly POPIN_DELAY = 0.2;
  private static readonly POPIN_DURATION = 0.3;
  private static readonly BOUNCE_SPEED = 3.0;
  private static readonly BOUNCE_HEIGHT = 0.5;
  private static readonly THANK_YOU_DELAY = 2.5;

  private threeScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private sceneManager: SceneManager;
  private saveManager: SaveManager;
  private audioManager: AudioManager;
  private overlay: HTMLDivElement | null = null;
  private bgStars: THREE.Points | null = null;
  private companionMeshes: THREE.Group[] = [];
  private companionGroup: THREE.Group | null = null;
  private celebrationElapsed = 0;
  private thankYouShown = false;

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

  enter(context: SceneContext): void {
    const totalScore = context.totalScore ?? 0;
    const totalStarCount = context.totalStarCount ?? 0;

    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x000030);

    // Starfield
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(3000);
    for (let i = 0; i < 3000; i++) {
      positions[i] = (Math.random() - 0.5) * 200;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.3 });
    this.bgStars = new THREE.Points(geo, mat);
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
    this.celebrationElapsed = 0;
    this.thankYouShown = false;

    for (let i = 0; i < PLANET_ENCYCLOPEDIA.length; i++) {
      const entry = PLANET_ENCYCLOPEDIA[i];
      const mesh = CompanionManager.createCompanionMesh(entry);

      const angle = i * ((2 * Math.PI) / PLANET_ENCYCLOPEDIA.length);
      mesh.position.set(
        Math.cos(angle) * EndingScene.CIRCLE_RADIUS,
        0,
        Math.sin(angle) * EndingScene.CIRCLE_RADIUS,
      );

      mesh.scale.set(0, 0, 0);

      this.companionMeshes.push(mesh);
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

    for (let i = 0; i < this.companionMeshes.length; i++) {
      const mesh = this.companionMeshes[i];
      const startTime = i * EndingScene.POPIN_DELAY;

      if (this.celebrationElapsed < startTime) {
        mesh.scale.set(0, 0, 0);
      } else if (this.celebrationElapsed < startTime + EndingScene.POPIN_DURATION) {
        const localT = (this.celebrationElapsed - startTime) / EndingScene.POPIN_DURATION;
        const s = this.bounceEase(localT);
        mesh.scale.set(s, s, s);
      } else {
        mesh.scale.set(1, 1, 1);
      }

      if (this.celebrationElapsed > POPIN_TOTAL) {
        const angle = i * ((2 * Math.PI) / this.companionMeshes.length);
        const bounceY =
          Math.abs(Math.sin(this.celebrationElapsed * EndingScene.BOUNCE_SPEED)) *
          EndingScene.BOUNCE_HEIGHT;
        mesh.position.set(
          Math.cos(angle) * EndingScene.CIRCLE_RADIUS,
          bounceY,
          Math.sin(angle) * EndingScene.CIRCLE_RADIUS,
        );
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

    if (this.companionGroup) {
      this.threeScene.remove(this.companionGroup);
      for (const mesh of this.companionMeshes) {
        mesh.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
      this.companionMeshes = [];
      this.companionGroup = null;
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
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    return this.camera;
  }
}
