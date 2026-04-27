import * as THREE from 'three';
import type { Scene, SceneContext, StageConfig } from '../../types';
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
import { getStageConfig } from '../config/StageConfig';
import { ParticleBurstManager } from '../effects/ParticleBurst';
import { AirShield } from '../effects/AirShield';
import { CompanionManager } from '../entities/CompanionManager';
import { PLANET_ENCYCLOPEDIA } from '../config/PlanetEncyclopedia';
import { disposeObject3D } from '../utils/disposeObject3D';

export class StageScene implements Scene {
  private threeScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private sceneManager: SceneManager;
  private inputSystem: InputSystem;
  private audioManager: AudioManager;
  private saveManager: SaveManager;

  private spaceship!: Spaceship;
  private stars: Star[] = [];
  private meteorites: Meteorite[] = [];

  private collisionSystem = new CollisionSystem();
  private scoreSystem = new ScoreSystem();
  private spawnSystem = new SpawnSystem();
  private boostSystem = new BoostSystem();
  private hud: HUD;
  private particleBurstManager = new ParticleBurstManager();
  private airShield!: AirShield;

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

  // Companion manager
  private companionManager: CompanionManager | null = null;

  // Sun pulse animation
  private elapsedTime = 0;

  // Boost flame particles
  private boostFlame: THREE.Points | null = null;
  private flamePositions: Float32Array | null = null;
  private flameColors: Float32Array | null = null;
  private flameLifetimes: Float32Array | null = null;
  private flameVelocities: Float32Array | null = null;
  private flameIndex = 0;
  private flameEmitting = false;
  private static readonly MAX_FLAME_PARTICLES = 150;

  constructor(sceneManager: SceneManager, inputSystem: InputSystem, audioManager: AudioManager, saveManager: SaveManager) {
    this.sceneManager = sceneManager;
    this.inputSystem = inputSystem;
    this.audioManager = audioManager;
    this.saveManager = saveManager;
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
    this.elapsedTime = 0;

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

    // Air shield
    this.airShield = new AirShield();
    this.threeScene.add(this.airShield.getMesh());

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
    const stageName = `ステージ${this.stageConfig.stageNumber}: ${this.stageConfig.emoji} ${this.stageConfig.displayName}`;
    this.hud.show(stageName);
    this.hud.setBoostCallback(() => {
      this.inputSystem.setBoostPressed(true);
    });
    this.hud.setHomeCallback(() => {
      this.sceneManager.requestTransition('title');
    });
    this.hud.update(this.scoreSystem.getStageScore(), this.scoreSystem.getStarCount());

    // Companions
    const saveData = this.saveManager.load();
    this.companionManager = new CompanionManager(saveData.unlockedPlanets);
    this.threeScene.add(this.companionManager.getGroup());

    // BGM
    this.audioManager.playBGM(this.stageNumber);
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
      case 2: {
        // Mercury — small gray sphere with crater canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#888888';
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 30; i++) {
          const x = Math.random() * 256;
          const y = Math.random() * 256;
          const r = 3 + Math.random() * 12;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(60,60,60,${0.3 + Math.random() * 0.4})`;
          ctx.fill();
        }
        const tex = new THREE.CanvasTexture(canvas);
        const geo = new THREE.SphereGeometry(10, 24, 24);
        const mat = new THREE.MeshToonMaterial({ map: tex });
        this.destinationPlanet.add(new THREE.Mesh(geo, mat));
        break;
      }
      case 3: {
        // Venus — yellow-orange sphere with swirl canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ddaa44';
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          const cx = 128 + (Math.random() - 0.5) * 100;
          const cy = 128 + (Math.random() - 0.5) * 100;
          ctx.strokeStyle = `rgba(200,150,60,${0.3 + Math.random() * 0.3})`;
          ctx.lineWidth = 3 + Math.random() * 5;
          for (let a = 0; a < Math.PI * 4; a += 0.1) {
            const r = 10 + a * 8;
            ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
          }
          ctx.stroke();
        }
        const tex = new THREE.CanvasTexture(canvas);
        const geo = new THREE.SphereGeometry(14, 24, 24);
        const mat = new THREE.MeshToonMaterial({ map: tex });
        this.destinationPlanet.add(new THREE.Mesh(geo, mat));
        break;
      }
      case 5: {
        // Jupiter — large sphere with horizontal stripe bands canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        const colors = ['#cc7733', '#dd9955', '#bb6622', '#eebb77', '#aa5511', '#ddaa66'];
        for (let y = 0; y < 256; y++) {
          const bandIdx = Math.floor(y / (256 / colors.length)) % colors.length;
          ctx.fillStyle = colors[bandIdx];
          ctx.fillRect(0, y, 256, 1);
        }
        const tex = new THREE.CanvasTexture(canvas);
        const geo = new THREE.SphereGeometry(20, 24, 24);
        const mat = new THREE.MeshToonMaterial({ map: tex });
        this.destinationPlanet.add(new THREE.Mesh(geo, mat));
        break;
      }
      case 6: {
        // Saturn — sphere with tilted ring
        const sphereGeo = new THREE.SphereGeometry(15, 24, 24);
        const sphereMat = new THREE.MeshToonMaterial({ color: this.stageConfig.planetColor });
        this.destinationPlanet.add(new THREE.Mesh(sphereGeo, sphereMat));
        const ringGeo = new THREE.RingGeometry(20, 30, 48);
        const ringMat = new THREE.MeshToonMaterial({ color: 0xeebb66, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 3;
        this.destinationPlanet.add(ring);
        break;
      }
      case 7: {
        // Uranus — cyan sphere with sideways ring (rotation.z = PI/2)
        const sphereGeo = new THREE.SphereGeometry(16, 24, 24);
        const sphereMat = new THREE.MeshToonMaterial({ color: 0x66ccdd });
        this.destinationPlanet.add(new THREE.Mesh(sphereGeo, sphereMat));
        const ringGeo = new THREE.RingGeometry(21, 28, 48);
        const ringMat = new THREE.MeshToonMaterial({ color: 0x99ddee, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.z = Math.PI / 2;
        this.destinationPlanet.add(ring);
        break;
      }
      case 9: {
        // Pluto — small sphere
        const geo = new THREE.SphereGeometry(8, 24, 24);
        const mat = new THREE.MeshToonMaterial({ color: 0xbbaaaa });
        this.destinationPlanet.add(new THREE.Mesh(geo, mat));
        break;
      }
      case 10: {
        // Sun — gold sphere with emissive, PointLight, pulse animation in update()
        const geo = new THREE.SphereGeometry(25, 24, 24);
        const mat = new THREE.MeshToonMaterial({ color: 0xffcc00, emissive: 0xffaa00, emissiveIntensity: 0.5 });
        this.destinationPlanet.add(new THREE.Mesh(geo, mat));
        const sunLight = new THREE.PointLight(0xffcc00, 2, 200);
        this.destinationPlanet.add(sunLight);
        break;
      }
      case 11: {
        // Earth — blue ocean + brown continents canvas texture + cloud layer
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        // Blue ocean
        ctx.fillStyle = '#2266aa';
        ctx.fillRect(0, 0, 512, 256);
        // Brown continents (simplified shapes)
        ctx.fillStyle = '#886644';
        // Eurasia-like landmass
        ctx.beginPath();
        ctx.ellipse(300, 80, 80, 40, 0.2, 0, Math.PI * 2);
        ctx.fill();
        // Africa-like landmass
        ctx.beginPath();
        ctx.ellipse(280, 150, 30, 50, 0.1, 0, Math.PI * 2);
        ctx.fill();
        // Americas-like landmass
        ctx.beginPath();
        ctx.ellipse(100, 90, 25, 60, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(110, 170, 20, 40, -0.2, 0, Math.PI * 2);
        ctx.fill();
        // Australia-like
        ctx.beginPath();
        ctx.ellipse(420, 170, 25, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        // Green patches on continents
        ctx.fillStyle = '#447733';
        ctx.beginPath();
        ctx.ellipse(290, 75, 40, 20, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(95, 85, 15, 30, 0.2, 0, Math.PI * 2);
        ctx.fill();

        const tex = new THREE.CanvasTexture(canvas);
        const geo = new THREE.SphereGeometry(15, 32, 32);
        const mat = new THREE.MeshToonMaterial({ map: tex });
        this.destinationPlanet.add(new THREE.Mesh(geo, mat));

        // Cloud layer
        const cloudCanvas = document.createElement('canvas');
        cloudCanvas.width = 512;
        cloudCanvas.height = 256;
        const cctx = cloudCanvas.getContext('2d')!;
        cctx.clearRect(0, 0, 512, 256);
        cctx.fillStyle = 'rgba(255,255,255,0.6)';
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 256;
          cctx.beginPath();
          cctx.ellipse(x, y, 20 + Math.random() * 40, 8 + Math.random() * 15, Math.random() * Math.PI, 0, Math.PI * 2);
          cctx.fill();
        }
        const cloudTex = new THREE.CanvasTexture(cloudCanvas);
        const cloudGeo = new THREE.SphereGeometry(15.5, 32, 32);
        const cloudMat = new THREE.MeshToonMaterial({ map: cloudTex, transparent: true, opacity: 0.3 });
        this.destinationPlanet.add(new THREE.Mesh(cloudGeo, cloudMat));
        break;
      }
      default: {
        // Moon(1), Mars(4), Neptune(8), and any other — simple colored sphere
        const sphereGeo = new THREE.SphereGeometry(15, 24, 24);
        const sphereMat = new THREE.MeshToonMaterial({ color: this.stageConfig.planetColor });
        this.destinationPlanet.add(new THREE.Mesh(sphereGeo, sphereMat));
        break;
      }
    }

    this.destinationPlanet.position.set(0, 0, goalZ);
    this.threeScene.add(this.destinationPlanet);
  }

  update(deltaTime: number): void {
    if (this.isCleared) {
      this.clearTimer += deltaTime;
      // Keep companion entrance animation progressing during clear screen
      this.companionManager?.update(
        deltaTime,
        this.spaceship.position.x,
        this.spaceship.position.y,
        this.spaceship.position.z,
      );
      if (this.clearTimer >= this.clearDelay) {
        this.handleStageComplete();
      }
      return;
    }

    const input = this.inputSystem.getState();

    // Capture boost state before changes
    const wasActive = this.boostSystem.isActive();
    const wasAvailable = this.boostSystem.isAvailable();

    // Boost activation
    if (input.boostPressed) {
      if (this.boostSystem.activate()) {
        this.audioManager.playSFX('boost');
        this.audioManager.startBoostSFX();
        this.initBoostFlame();
      }
      this.inputSystem.setBoostPressed(false);
    }
    this.boostSystem.update(deltaTime);

    // Boost end detection (wasActive → !isActive)
    if (wasActive && !this.boostSystem.isActive()) {
      this.audioManager.stopBoostSFX();
      this.flameEmitting = false;
    }

    // Cooldown completion detection
    if (!wasAvailable && this.boostSystem.isAvailable()) {
      this.audioManager.playSFX('boostReady');
    }

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
        this.particleBurstManager.emit(this.threeScene, {
          position: new THREE.Vector3(star.position.x, star.position.y, star.position.z),
          color: 0xffdd00,
          particleCount: 50,
          isRainbow: true,
        });
      } else {
        this.audioManager.playSFX('starCollect');
        this.particleBurstManager.emit(this.threeScene, {
          position: new THREE.Vector3(star.position.x, star.position.y, star.position.z),
          color: 0xffdd00,
          particleCount: 20,
          isRainbow: false,
        });
      }
    }

    // Meteorite hit
    if (collisionResult.meteoriteCollision) {
      this.spaceship.onMeteoriteHit();
      this.boostSystem.cancel();
      this.damageTimer = StageScene.DAMAGE_FLASH_DURATION;
      this.audioManager.playSFX('meteoriteHit');
      this.audioManager.stopBoostSFX();
      this.removeBoostFlame();
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

    // Sun pulse animation
    if (this.stageNumber === 10 && this.destinationPlanet) {
      const s = 1.0 + Math.sin(this.elapsedTime * 2) * 0.05;
      this.destinationPlanet.scale.set(s, s, s);
    }
    this.elapsedTime += deltaTime;

    // Boost visual effects
    this.updateBoostEffects();

    // Boost flame particles
    if (this.boostSystem.isActive()) {
      this.emitFlameParticles();
    }
    if (this.boostFlame) {
      this.updateFlameParticles(deltaTime);
    }

    // Air shield sync
    this.airShield.setPosition(
      this.spaceship.position.x,
      this.spaceship.position.y,
      this.spaceship.position.z,
    );
    this.airShield.setBoostMode(this.boostSystem.isActive());
    this.airShield.update(deltaTime);

    // Particle effects
    this.particleBurstManager.update(deltaTime);
    this.particleBurstManager.cleanup(this.threeScene);

    // HUD update
    this.hud.update(this.scoreSystem.getStageScore(), this.scoreSystem.getStarCount());
    this.hud.updateCooldown(this.boostSystem.getCooldownProgress());

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
      (this.boostLines.material as THREE.Material).dispose();
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
    const behindThreshold = shipZ + 30;

    const remainingStars: Star[] = [];
    for (const star of this.stars) {
      if (star.position.z > behindThreshold) {
        this.threeScene.remove(star.mesh);
        star.dispose();
      } else {
        remainingStars.push(star);
      }
    }
    this.stars = remainingStars;

    const remainingMeteorites: Meteorite[] = [];
    for (const met of this.meteorites) {
      if (met.position.z > behindThreshold) {
        this.threeScene.remove(met.mesh);
        met.dispose();
      } else {
        remainingMeteorites.push(met);
      }
    }
    this.meteorites = remainingMeteorites;
  }

  private initBoostFlame(): void {
    if (this.boostFlame) return;
    const MAX = StageScene.MAX_FLAME_PARTICLES;
    this.flamePositions = new Float32Array(MAX * 3);
    this.flameColors = new Float32Array(MAX * 3);
    this.flameLifetimes = new Float32Array(MAX);
    this.flameVelocities = new Float32Array(MAX * 2);
    this.flameIndex = 0;
    this.flameEmitting = true;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.flamePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.flameColors, 3));

    const material = new THREE.PointsMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      size: 0.5,
      depthWrite: false,
    });

    this.boostFlame = new THREE.Points(geometry, material);
    this.boostFlame.frustumCulled = false;
    this.threeScene.add(this.boostFlame);
  }

  private emitFlameParticles(): void {
    if (!this.flamePositions || !this.flameColors || !this.flameLifetimes || !this.flameVelocities) return;
    const MAX = StageScene.MAX_FLAME_PARTICLES;
    const shipPos = this.spaceship.position;

    // Fadeout calculation
    const progress = this.boostSystem.getDurationProgress();
    const fadeStart = 0.83;
    const emitCount = progress < fadeStart
      ? 8
      : Math.max(0, Math.round(8 * (1.0 - progress) / (1.0 - fadeStart)));
    const sizeFraction = progress < fadeStart
      ? 1.0
      : (1.0 - progress) / (1.0 - fadeStart);

    for (let p = 0; p < emitCount; p++) {
      const idx = this.flameIndex % MAX;
      const i3 = idx * 3;
      const i2 = idx * 2;

      this.flamePositions[i3] = shipPos.x + (Math.random() - 0.5) * sizeFraction;
      this.flamePositions[i3 + 1] = shipPos.y + (Math.random() - 0.5) * sizeFraction;
      this.flamePositions[i3 + 2] = shipPos.z + 2;

      const t = Math.random();
      this.flameColors[i3] = 1.0;
      this.flameColors[i3 + 1] = 0.4 * (1 - t) + 0.133 * t;
      this.flameColors[i3 + 2] = 0;

      this.flameLifetimes[idx] = 0.7;
      this.flameVelocities[i2] = 3 + Math.random() * 2;
      this.flameVelocities[i2 + 1] = (Math.random() - 0.5);

      this.flameIndex++;
    }

    // Scale particle size during fade phase
    if (this.boostFlame) {
      (this.boostFlame.material as THREE.PointsMaterial).size = 0.5 * sizeFraction;
    }
  }

  private updateFlameParticles(deltaTime: number): void {
    if (!this.flamePositions || !this.flameColors || !this.flameLifetimes || !this.flameVelocities || !this.boostFlame) return;
    const MAX = StageScene.MAX_FLAME_PARTICLES;
    let hasLive = false;

    for (let i = 0; i < MAX; i++) {
      if (this.flameLifetimes[i] <= 0) continue;
      this.flameLifetimes[i] -= deltaTime;
      const i3 = i * 3;
      const i2 = i * 2;

      if (this.flameLifetimes[i] <= 0) {
        this.flamePositions[i3 + 2] = 99999;
        this.flameColors[i3] = 0;
        this.flameColors[i3 + 1] = 0;
        this.flameColors[i3 + 2] = 0;
        continue;
      }

      hasLive = true;
      this.flamePositions[i3 + 2] += this.flameVelocities[i2] * deltaTime;
      this.flamePositions[i3 + 1] += this.flameVelocities[i2 + 1] * deltaTime;
    }

    (this.boostFlame.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.boostFlame.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;

    if (!this.flameEmitting && !hasLive) {
      this.removeBoostFlame();
    }
  }

  private removeBoostFlame(): void {
    if (this.boostFlame) {
      this.threeScene.remove(this.boostFlame);
      this.boostFlame.geometry.dispose();
      (this.boostFlame.material as THREE.PointsMaterial).dispose();
      this.boostFlame = null;
    }
    this.flamePositions = null;
    this.flameColors = null;
    this.flameLifetimes = null;
    this.flameVelocities = null;
    this.flameIndex = 0;
    this.flameEmitting = false;
  }

  private onStageClear(): void {
    this.isCleared = true;
    this.clearTimer = 0;
    this.audioManager.playSFX('stageClear');
    this.audioManager.stopBoostSFX();
    this.removeBoostFlame();

    // Add companion if this is a new planet unlock
    const saveData = this.saveManager.load();
    if (!saveData.unlockedPlanets.includes(this.stageNumber)) {
      this.companionManager?.addCompanion(this.stageNumber);
    }

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

    // Card acquisition notification for newly unlocked planets
    const saveData = this.saveManager.load();
    if (!saveData.unlockedPlanets.includes(this.stageNumber)) {
      const entry = PLANET_ENCYCLOPEDIA.find((e) => e.stageNumber === this.stageNumber);
      if (entry) {
        const cardMsg = document.createElement('div');
        cardMsg.textContent = `${entry.emoji} ${entry.name}の ずかんカード ゲット！`;
        cardMsg.style.cssText = `
          font-family: 'Zen Maru Gothic', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #FFD700;
          margin-top: 1rem;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
        `;
        this.clearOverlay.appendChild(cardMsg);

        const companionMsg = document.createElement('div');
        companionMsg.textContent = `${entry.emoji} ${entry.name}が なかまに なったよ！`;
        companionMsg.style.cssText = `
          font-family: 'Zen Maru Gothic', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #FFD700;
          margin-top: 0.5rem;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
        `;
        this.clearOverlay.appendChild(companionMsg);
      }
    }

    uiOverlay.appendChild(this.clearOverlay);
  }

  private handleStageComplete(): void {
    const { totalScore, totalStarCount } = this.scoreSystem.finalizeStage();

    if (this.stageNumber >= 11) {
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
    this.audioManager.stopBGM();
    this.audioManager.stopBoostSFX();
    this.removeBoostFlame();
    this.companionManager?.dispose();
    this.companionManager = null;
    this.airShield.dispose();
    if (this.clearOverlay) {
      this.clearOverlay.remove();
      this.clearOverlay = null;
    }
    // Cleanup Three.js objects (dispose geometry/material before clearing the scene)
    this.particleBurstManager.clear(this.threeScene);

    // Dispose entities
    this.spaceship?.dispose();
    for (const star of this.stars) star.dispose();
    for (const met of this.meteorites) met.dispose();

    // Dispose retained scene resources
    if (this.boostLines) {
      this.boostLines.geometry.dispose();
      (this.boostLines.material as THREE.Material).dispose();
      this.boostLines = null;
    }
    if (this.bgStars) {
      this.bgStars.geometry.dispose();
      (this.bgStars.material as THREE.Material).dispose();
      this.bgStars = null;
    }
    if (this.destinationPlanet) {
      disposeObject3D(this.destinationPlanet);
      this.destinationPlanet = null;
    }

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
