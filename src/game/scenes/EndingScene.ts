import * as THREE from 'three';
import type { Scene, SceneContext } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { SaveManager } from '../storage/SaveManager';
import type { AudioManager } from '../audio/AudioManager';

export class EndingScene implements Scene {
  private threeScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private sceneManager: SceneManager;
  private saveManager: SaveManager;
  private audioManager: AudioManager;
  private overlay: HTMLDivElement | null = null;
  private bgStars: THREE.Points | null = null;

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

    // Reset save data
    this.saveManager.clear();

    // Ending BGM
    this.audioManager.playBGM(-1);

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
  }

  exit(): void {
    this.audioManager.stopBGM();
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
