import * as THREE from 'three';
import type { Scene, SceneContext } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { SaveManager } from '../storage/SaveManager';
import type { AudioManager } from '../audio/AudioManager';
import { TutorialOverlay } from '../../ui/TutorialOverlay';

export class TitleScene implements Scene {
  private threeScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private sceneManager: SceneManager;
  private saveManager: SaveManager;
  private audioManager: AudioManager;
  private stars: THREE.Points | null = null;
  private overlay: HTMLDivElement | null = null;
  private tutorialOverlay = new TutorialOverlay();

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
    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x000020);

    // Starfield background
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(3000);
    for (let i = 0; i < 3000; i++) {
      positions[i] = (Math.random() - 0.5) * 200;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3,
      sizeAttenuation: true,
    });
    this.stars = new THREE.Points(starGeo, starMat);
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
      const startStage = Math.min(saveData.clearedStage + 1, 11);
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
      bottom: 2rem;
      right: 2rem;
    `;
    tutorialBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.tutorialOverlay.show(() => {
        this.tutorialOverlay.hide();
      });
    });

    this.overlay.appendChild(title);
    this.overlay.appendChild(button);
    this.overlay.appendChild(tutorialBtn);
    uiOverlay.appendChild(this.overlay);

    // First touch anywhere on overlay initializes audio and starts title BGM
    this.overlay.addEventListener('pointerdown', () => {
      this.audioManager.initSync();
      this.audioManager.playBGM(0);
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
