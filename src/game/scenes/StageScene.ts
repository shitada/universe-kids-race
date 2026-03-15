import * as THREE from 'three';
import type { Scene, SceneContext, StageConfig } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { InputSystem } from '../systems/InputSystem';
import { Spaceship } from '../entities/Spaceship';
import { Star } from '../entities/Star';
import { Meteorite } from '../entities/Meteorite';
import { CollisionSystem } from '../systems/CollisionSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { SpawnSystem } from '../systems/SpawnSystem';
import { BoostSystem } from '../systems/BoostSystem';
import { HUD } from '../../ui/HUD';
import { getStageConfig } from '../config/StageConfig';

export class StageScene implements Scene {
  private threeScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private sceneManager: SceneManager;
  private inputSystem: InputSystem;

  private spaceship!: Spaceship;
  private stars: Star[] = [];
  private meteorites: Meteorite[] = [];

  private collisionSystem = new CollisionSystem();
  private scoreSystem = new ScoreSystem();
  private spawnSystem = new SpawnSystem();
  private boostSystem = new BoostSystem();
  private hud: HUD;

  private stageConfig!: StageConfig;
  private stageNumber = 1;
  private isCleared = false;
  private clearTimer = 0;
  private clearDelay = 2.5;
  private clearOverlay: HTMLDivElement | null = null;

  // Damage animation
  private damageTimer = 0;
  private static readonly DAMAGE_FLASH_DURATION = 0.5;

  // Destination planet
  private destinationPlanet: THREE.Group | null = null;

  // Background stars
  private bgStars: THREE.Points | null = null;

  // Boost effects
  private boostLines: THREE.LineSegments | null = null;

  constructor(sceneManager: SceneManager, inputSystem: InputSystem) {
    this.sceneManager = sceneManager;
    this.inputSystem = inputSystem;
    this.threeScene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000,
    );
    this.hud = new HUD();
  }

  enter(context: SceneContext): void {
    this.stageNumber = context.stageNumber ?? 1;
    this.stageConfig = getStageConfig(this.stageNumber);
    this.isCleared = false;
    this.clearTimer = 0;
    this.damageTimer = 0;

    // Restore total scores if passed
    if (context.totalScore !== undefined) {
      this.scoreSystem.setTotalScore(context.totalScore);
    }
    if (context.totalStarCount !== undefined) {
      this.scoreSystem.setTotalStarCount(context.totalStarCount);
    }

    // Reset scene
    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x000020);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.threeScene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(5, 10, 5);
    this.threeScene.add(directional);

    // Background starfield
    this.createBackground();

    // Spaceship
    this.spaceship = new Spaceship();
    this.threeScene.add(this.spaceship.mesh);

    // Camera behind spaceship
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, -10);

    // Destination planet
    this.createDestinationPlanet();

    // Clear systems
    this.stars = [];
    this.meteorites = [];
    this.spawnSystem.reset();
    this.boostSystem.reset();
    this.scoreSystem.resetStage();

    // HUD
    this.hud.show();
    this.hud.setBoostCallback(() => {
      this.inputSystem.setBoostPressed(true);
    });
    this.hud.update(this.scoreSystem.getStageScore(), this.scoreSystem.getStarCount());
  }

  private createBackground(): void {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(6000);
    for (let i = 0; i < 6000; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 400 - 200;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, sizeAttenuation: true });
    this.bgStars = new THREE.Points(geo, mat);
    this.threeScene.add(this.bgStars);
  }

  private createDestinationPlanet(): void {
    this.destinationPlanet = new THREE.Group();
    const goalZ = -(this.stageConfig.stageLength + 50);

    switch (this.stageNumber) {
      case 1: {
        // Moon - gray/white
        const moonGeo = new THREE.SphereGeometry(15, 24, 24);
        const moonMat = new THREE.MeshToonMaterial({ color: 0xcccccc });
        const moon = new THREE.Mesh(moonGeo, moonMat);
        this.destinationPlanet.add(moon);
        break;
      }
      case 2: {
        // Mars - red
        const marsGeo = new THREE.SphereGeometry(15, 24, 24);
        const marsMat = new THREE.MeshToonMaterial({ color: 0xcc4422 });
        const mars = new THREE.Mesh(marsGeo, marsMat);
        this.destinationPlanet.add(mars);
        break;
      }
      case 3: {
        // Saturn - yellow + ring
        const saturnGeo = new THREE.SphereGeometry(15, 24, 24);
        const saturnMat = new THREE.MeshToonMaterial({ color: 0xddaa44 });
        const saturn = new THREE.Mesh(saturnGeo, saturnMat);
        this.destinationPlanet.add(saturn);

        const ringGeo = new THREE.RingGeometry(20, 30, 48);
        const ringMat = new THREE.MeshToonMaterial({
          color: 0xeebb66,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 3;
        this.destinationPlanet.add(ring);
        break;
      }
    }

    this.destinationPlanet.position.set(0, 0, goalZ);
    this.threeScene.add(this.destinationPlanet);
  }

  update(deltaTime: number): void {
    if (this.isCleared) {
      this.clearTimer += deltaTime;
      if (this.clearTimer >= this.clearDelay) {
        this.handleStageComplete();
      }
      return;
    }

    const input = this.inputSystem.getState();

    // Boost
    if (input.boostPressed) {
      this.boostSystem.activate();
      this.inputSystem.setBoostPressed(false);
    }
    this.boostSystem.update(deltaTime);

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
    const spawnResult = this.spawnSystem.update(deltaTime, this.spaceship.position.z, this.stageConfig);
    for (const star of spawnResult.newStars) {
      this.stars.push(star);
      this.threeScene.add(star.mesh);
    }
    for (const met of spawnResult.newMeteorites) {
      this.meteorites.push(met);
      this.threeScene.add(met.mesh);
    }

    // Animate stars (rainbow hue cycling)
    for (const star of this.stars) {
      star.update(deltaTime);
    }

    // Collision
    const collisionResult = this.collisionSystem.check(this.spaceship, this.stars, this.meteorites);

    // Star collection
    for (const star of collisionResult.starCollisions) {
      this.scoreSystem.addStarScore(star.starType);
    }

    // Meteorite hit
    if (collisionResult.meteoriteCollision) {
      this.spaceship.onMeteoriteHit();
      this.boostSystem.cancel();
      this.damageTimer = StageScene.DAMAGE_FLASH_DURATION;
    }

    // Damage animation
    if (this.damageTimer > 0) {
      this.damageTimer -= deltaTime;
      const wobble = Math.sin(this.damageTimer * 30) * 0.3;
      this.spaceship.mesh.rotation.z = wobble;
      // Flash effect
      const flash = Math.sin(this.damageTimer * 20) > 0;
      this.spaceship.mesh.visible = flash || this.damageTimer <= 0;
    } else {
      this.spaceship.mesh.rotation.z = 0;
      this.spaceship.mesh.visible = true;
    }

    // Deactivate passed objects
    this.cleanupPassedObjects();

    // Camera follow
    this.camera.position.set(
      this.spaceship.position.x * 0.3,
      5,
      this.spaceship.position.z + 12,
    );
    this.camera.lookAt(
      this.spaceship.position.x * 0.5,
      0,
      this.spaceship.position.z - 20,
    );

    // Boost visual effects
    this.updateBoostEffects();

    // HUD update
    this.hud.update(this.scoreSystem.getStageScore(), this.scoreSystem.getStarCount());

    // Check stage clear
    const progress = this.spaceship.getProgress(this.stageConfig.stageLength);
    if (progress >= 1) {
      this.onStageClear();
    }
  }

  private updateBoostEffects(): void {
    // Remove old boost lines
    if (this.boostLines) {
      this.threeScene.remove(this.boostLines);
      this.boostLines.geometry.dispose();
      this.boostLines = null;
    }

    if (this.boostSystem.isActive()) {
      const positions: number[] = [];
      for (let i = 0; i < 20; i++) {
        const x = this.spaceship.position.x + (Math.random() - 0.5) * 4;
        const y = (Math.random() - 0.5) * 3;
        const z = this.spaceship.position.z + 2 + Math.random() * 8;
        positions.push(x, y, z);
        positions.push(x, y, z + 2 + Math.random() * 3);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({ color: 0x00ddff, transparent: true, opacity: 0.6 });
      this.boostLines = new THREE.LineSegments(geo, mat);
      this.threeScene.add(this.boostLines);
    }
  }

  private cleanupPassedObjects(): void {
    const shipZ = this.spaceship.position.z;
    for (const star of this.stars) {
      if (!star.isCollected && star.position.z > shipZ + 30) {
        star.isCollected = true;
        star.mesh.visible = false;
      }
    }
    for (const met of this.meteorites) {
      if (met.isActive && met.position.z > shipZ + 30) {
        met.isActive = false;
        met.mesh.visible = false;
      }
    }
  }

  private onStageClear(): void {
    this.isCleared = true;
    this.clearTimer = 0;
    this.showClearMessage();
  }

  private showClearMessage(): void {
    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    this.clearOverlay = document.createElement('div');
    this.clearOverlay.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 32, 0.6);
    `;

    const msg = document.createElement('div');
    msg.textContent = 'やったね！';
    msg.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 3rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
      margin-bottom: 1rem;
    `;

    const score = document.createElement('div');
    score.textContent = `⭐ ${this.scoreSystem.getStarCount()} こ あつめたよ！`;
    score.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
    `;

    this.clearOverlay.appendChild(msg);
    this.clearOverlay.appendChild(score);
    uiOverlay.appendChild(this.clearOverlay);
  }

  private handleStageComplete(): void {
    const { totalScore, totalStarCount } = this.scoreSystem.finalizeStage();

    if (this.stageNumber >= 3) {
      this.sceneManager.requestTransition('ending', { totalScore, totalStarCount });
    } else {
      this.sceneManager.requestTransition('stage', {
        stageNumber: this.stageNumber + 1,
        totalScore,
        totalStarCount,
      });
    }
  }

  exit(): void {
    this.hud.hide();
    if (this.clearOverlay) {
      this.clearOverlay.remove();
      this.clearOverlay = null;
    }
    // Cleanup Three.js objects
    this.threeScene.clear();
    this.stars = [];
    this.meteorites = [];
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
