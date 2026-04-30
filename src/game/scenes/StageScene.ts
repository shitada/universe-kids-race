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
import { getStageConfig, TOTAL_STAGES } from '../config/StageConfig';
import { ParticleBurstManager } from '../effects/ParticleBurst';
import { AirShield } from '../effects/AirShield';
import { BoostLinesEffect } from '../effects/BoostLinesEffect';
import { BoostFlameEffect } from '../effects/BoostFlameEffect';
import { CompanionManager } from '../entities/CompanionManager';
import { PLANET_ENCYCLOPEDIA } from '../config/PlanetEncyclopedia';
import { disposeObject3D } from '../utils/disposeObject3D';
import { followCameraZ } from '../utils/followCameraZ';

const BG_STAR_PARALLAX = 1.0;

// ──────────────────────────────────────────────────────────────────────────────
// SHARED destination-planet / background-star resources
//
// `createDestinationPlanet()` と `createBackground()` は、毎回ステージへ入場する
// たびに Canvas 描画 / CanvasTexture 生成 / SphereGeometry 生成 / 6000 要素の
// Float32 BufferAttribute 生成を行っており、再入場時の入場直後フレームで
// 大きなスパイクの原因となっていた (#31 のずかん経由の頻繁な再入場で顕著)。
//
// ここでは Star / Meteorite と同じ「SHARED 資源は dispose しない」規約に従い、
// stageNumber や planetColor をキーとしてモジュールレベルでキャッシュする。
// 共有 Mesh には `mesh.userData.sharedAssets = true` を付与しており、
// `disposeObject3D` は当該 Mesh の geometry / material を dispose しない。
//
// 結果として、Canvas の Math.random() 由来の模様は初回生成のもので固定される。
// ステージ毎の見た目同一性はむしろ望ましく (子どもユーザーの混乱回避)、
// PR / コミットに明記する。
// ──────────────────────────────────────────────────────────────────────────────

const planetTextureCache = new Map<string, THREE.CanvasTexture>();
const planetGeometryCache = new Map<string, THREE.BufferGeometry>();
const planetMaterialCache = new Map<string, THREE.Material>();

let SHARED_BG_STARS_GEOMETRY: THREE.BufferGeometry | null = null;
let SHARED_BG_STARS_MATERIAL: THREE.PointsMaterial | null = null;

function getPlanetTexture(key: string, factory: () => THREE.CanvasTexture): THREE.CanvasTexture {
  let tex = planetTextureCache.get(key);
  if (!tex) {
    tex = factory();
    planetTextureCache.set(key, tex);
  }
  return tex;
}

function getPlanetGeometry<T extends THREE.BufferGeometry>(key: string, factory: () => T): T {
  let geo = planetGeometryCache.get(key) as T | undefined;
  if (!geo) {
    geo = factory();
    planetGeometryCache.set(key, geo);
  }
  return geo;
}

function getPlanetMaterial<T extends THREE.Material>(key: string, factory: () => T): T {
  let mat = planetMaterialCache.get(key) as T | undefined;
  if (!mat) {
    mat = factory();
    planetMaterialCache.set(key, mat);
  }
  return mat;
}

function makeSharedMesh(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.sharedAssets = true;
  return mesh;
}

function buildMercuryTexture(): THREE.CanvasTexture {
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
  return new THREE.CanvasTexture(canvas);
}

function buildVenusTexture(): THREE.CanvasTexture {
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
  return new THREE.CanvasTexture(canvas);
}

function buildJupiterTexture(): THREE.CanvasTexture {
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
  return new THREE.CanvasTexture(canvas);
}

function buildEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#2266aa';
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = '#886644';
  ctx.beginPath();
  ctx.ellipse(300, 80, 80, 40, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(280, 150, 30, 50, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(100, 90, 25, 60, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(110, 170, 20, 40, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(420, 170, 25, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#447733';
  ctx.beginPath();
  ctx.ellipse(290, 75, 40, 20, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(95, 85, 15, 30, 0.2, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

function buildEarthCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 512, 256);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    ctx.beginPath();
    ctx.ellipse(x, y, 20 + Math.random() * 40, 8 + Math.random() * 15, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

/**
 * テスト用フック: モジュールレベルキャッシュをクリアする。
 * 本番コードからは呼ばない。
 */
export function __resetStageSceneSharedAssetCachesForTest(): void {
  planetTextureCache.clear();
  planetGeometryCache.clear();
  planetMaterialCache.clear();
  SHARED_BG_STARS_GEOMETRY = null;
  SHARED_BG_STARS_MATERIAL = null;
}

/**
 * テスト用フック: 内部キャッシュへ直接アクセスする。
 */
export const __stageSceneSharedAssetCachesForTest = {
  planetTextureCache,
  planetGeometryCache,
  planetMaterialCache,
  getBgStarsGeometry: (): THREE.BufferGeometry | null => SHARED_BG_STARS_GEOMETRY,
  getBgStarsMaterial: (): THREE.PointsMaterial | null => SHARED_BG_STARS_MATERIAL,
};

export class StageScene implements Scene {
  private threeScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private lastAspect = 0;
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

  // Boost effects (retained: single instance reused per frame; do not dispose per instance)
  private boostLinesEffect = new BoostLinesEffect();

  // Companion manager
  private companionManager: CompanionManager | null = null;

  // Sun pulse animation
  private elapsedTime = 0;

  // Boost flame particles
  private boostFlameEffect = new BoostFlameEffect();

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
    this.lastAspect = 0;
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
    this.stars.length = 0;
    this.meteorites.length = 0;
    this.spawnSystem.reset();
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
      this.sceneManager.requestTransition('title');
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

    // Companions
    const saveData = this.saveManager.load();
    this.companionManager = new CompanionManager(saveData.unlockedPlanets);
    this.threeScene.add(this.companionManager.getGroup());

    // Boost line effect (created once, reused per frame)
    this.boostLinesEffect.init(this.threeScene);

    // Boost flame particles (allocated once per stage, reused per boost)
    this.boostFlameEffect.init(this.threeScene);

    // BGM
    this.audioManager.playBGM(this.stageNumber);
  }

  private createBackground(): void {
    // SHARED: BufferGeometry / PointsMaterial / position attribute はモジュール
    // レベルで 1 度だけ生成し、再入場時は同じ参照を使い回す。Points (mesh) のみ
    // per-instance だが、`userData.sharedAssets = true` を付与して dispose 経路で
    // geometry/material を破棄しないようにする。
    if (!SHARED_BG_STARS_GEOMETRY) {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(6000);
      for (let i = 0; i < 6000; i += 3) {
        positions[i] = (Math.random() - 0.5) * 200;
        positions[i + 1] = (Math.random() - 0.5) * 200;
        positions[i + 2] = (Math.random() - 0.5) * 400;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      SHARED_BG_STARS_GEOMETRY = geo;
    }
    if (!SHARED_BG_STARS_MATERIAL) {
      SHARED_BG_STARS_MATERIAL = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        sizeAttenuation: true,
      });
    }
    this.bgStars = new THREE.Points(SHARED_BG_STARS_GEOMETRY, SHARED_BG_STARS_MATERIAL);
    this.bgStars.userData.sharedAssets = true;
    this.threeScene.add(this.bgStars);
  }

  private createDestinationPlanet(): void {
    this.destinationPlanet = new THREE.Group();
    const goalZ = -(this.stageConfig.stageLength + 50);

    switch (this.stageNumber) {
      case 2: {
        // Mercury — small gray sphere with crater canvas texture
        const tex = getPlanetTexture('mercury', buildMercuryTexture);
        const geo = getPlanetGeometry('mercury:sphere', () => new THREE.SphereGeometry(10, 24, 24));
        const mat = getPlanetMaterial('mercury:mat', () => new THREE.MeshToonMaterial({ map: tex }));
        this.destinationPlanet.add(makeSharedMesh(geo, mat));
        break;
      }
      case 3: {
        // Venus — yellow-orange sphere with swirl canvas texture
        const tex = getPlanetTexture('venus', buildVenusTexture);
        const geo = getPlanetGeometry('venus:sphere', () => new THREE.SphereGeometry(14, 24, 24));
        const mat = getPlanetMaterial('venus:mat', () => new THREE.MeshToonMaterial({ map: tex }));
        this.destinationPlanet.add(makeSharedMesh(geo, mat));
        break;
      }
      case 5: {
        // Jupiter — large sphere with horizontal stripe bands canvas texture
        const tex = getPlanetTexture('jupiter', buildJupiterTexture);
        const geo = getPlanetGeometry('jupiter:sphere', () => new THREE.SphereGeometry(20, 24, 24));
        const mat = getPlanetMaterial('jupiter:mat', () => new THREE.MeshToonMaterial({ map: tex }));
        this.destinationPlanet.add(makeSharedMesh(geo, mat));
        break;
      }
      case 6: {
        // Saturn — sphere with tilted ring
        const sphereGeo = getPlanetGeometry('saturn:sphere', () => new THREE.SphereGeometry(15, 24, 24));
        const sphereColor = this.stageConfig.planetColor;
        const sphereMat = getPlanetMaterial(
          `saturn:mat:${sphereColor}`,
          () => new THREE.MeshToonMaterial({ color: sphereColor }),
        );
        this.destinationPlanet.add(makeSharedMesh(sphereGeo, sphereMat));
        const ringGeo = getPlanetGeometry('saturn:ring', () => new THREE.RingGeometry(20, 30, 48));
        const ringMat = getPlanetMaterial(
          'saturn:ringMat',
          () => new THREE.MeshToonMaterial({ color: 0xeebb66, side: THREE.DoubleSide }),
        );
        const ring = makeSharedMesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 3;
        this.destinationPlanet.add(ring);
        break;
      }
      case 7: {
        // Uranus — cyan sphere with sideways ring (rotation.z = PI/2)
        const sphereGeo = getPlanetGeometry('uranus:sphere', () => new THREE.SphereGeometry(16, 24, 24));
        const sphereMat = getPlanetMaterial(
          'uranus:mat',
          () => new THREE.MeshToonMaterial({ color: 0x66ccdd }),
        );
        this.destinationPlanet.add(makeSharedMesh(sphereGeo, sphereMat));
        const ringGeo = getPlanetGeometry('uranus:ring', () => new THREE.RingGeometry(21, 28, 48));
        const ringMat = getPlanetMaterial(
          'uranus:ringMat',
          () => new THREE.MeshToonMaterial({ color: 0x99ddee, side: THREE.DoubleSide }),
        );
        const ring = makeSharedMesh(ringGeo, ringMat);
        ring.rotation.z = Math.PI / 2;
        this.destinationPlanet.add(ring);
        break;
      }
      case 9: {
        // Pluto — small sphere
        const geo = getPlanetGeometry('pluto:sphere', () => new THREE.SphereGeometry(8, 24, 24));
        const mat = getPlanetMaterial('pluto:mat', () => new THREE.MeshToonMaterial({ color: 0xbbaaaa }));
        this.destinationPlanet.add(makeSharedMesh(geo, mat));
        break;
      }
      case 10: {
        // Sun — gold sphere with emissive, PointLight, pulse animation in update()
        const geo = getPlanetGeometry('sun:sphere', () => new THREE.SphereGeometry(25, 24, 24));
        const mat = getPlanetMaterial(
          'sun:mat',
          () => new THREE.MeshToonMaterial({ color: 0xffcc00, emissive: 0xffaa00, emissiveIntensity: 0.5 }),
        );
        this.destinationPlanet.add(makeSharedMesh(geo, mat));
        // PointLight は per-instance (light は dispose 不要、GC で解放)
        const sunLight = new THREE.PointLight(0xffcc00, 2, 200);
        this.destinationPlanet.add(sunLight);
        break;
      }
      case 11: {
        // Earth — stage ID 11 (happens to equal TOTAL_STAGES). This is a per-stage
        // visual branch keyed by stage number, not a "last stage" check.
        // blue ocean + brown continents canvas texture + cloud layer
        const tex = getPlanetTexture('earth', buildEarthTexture);
        const geo = getPlanetGeometry('earth:sphere', () => new THREE.SphereGeometry(15, 32, 32));
        const mat = getPlanetMaterial('earth:mat', () => new THREE.MeshToonMaterial({ map: tex }));
        this.destinationPlanet.add(makeSharedMesh(geo, mat));

        // Cloud layer
        const cloudTex = getPlanetTexture('earth:cloud', buildEarthCloudTexture);
        const cloudGeo = getPlanetGeometry('earth:cloudSphere', () => new THREE.SphereGeometry(15.5, 32, 32));
        const cloudMat = getPlanetMaterial(
          'earth:cloudMat',
          () => new THREE.MeshToonMaterial({ map: cloudTex, transparent: true, opacity: 0.3 }),
        );
        this.destinationPlanet.add(makeSharedMesh(cloudGeo, cloudMat));
        break;
      }
      default: {
        // Moon(1), Mars(4), Neptune(8), and any other — simple colored sphere.
        // 同一 (radius, segments) のジオメトリは全 default ステージで共有。
        // material のみ planetColor をキーに分離する。
        const sphereGeo = getPlanetGeometry('default:sphere', () => new THREE.SphereGeometry(15, 24, 24));
        const color = this.stageConfig.planetColor;
        const sphereMat = getPlanetMaterial(
          `default:mat:${color}`,
          () => new THREE.MeshToonMaterial({ color }),
        );
        this.destinationPlanet.add(makeSharedMesh(sphereGeo, sphereMat));
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
      this.spaceship.onMeteoriteHit();
      this.boostSystem.cancel();
      this.damageTimer = StageScene.DAMAGE_FLASH_DURATION;
      this.audioManager.playSFX('meteoriteHit');
      this.audioManager.stopBoostSFX();
      this.boostFlameEffect.remove();
    }

    // Damage animation (overrides bank rotation while active)
    if (this.damageTimer > 0) {
      this.damageTimer -= deltaTime;
      const wobble = Math.sin(this.damageTimer * 30) * 0.3;
      this.spaceship.mesh.rotation.z = wobble;
      this.spaceship.mesh.rotation.y = 0;
      // Flash effect
      const flash = Math.sin(this.damageTimer * 20) > 0;
      this.spaceship.mesh.visible = flash || this.damageTimer <= 0;
    } else {
      // Bank rotations are managed by Spaceship.update(); only ensure visibility.
      this.spaceship.mesh.visible = true;
    }

    // Deactivate passed objects
    this.cleanupPassedObjects(deltaTime);

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
      if (met.position.z > behindThreshold) {
        this.spawnSystem.releaseMeteorite(met);
      } else {
        // Animate retained meteorites (X/Z rotation) here so this.meteorites
        // is walked only once per frame, mirroring the star retain branch.
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
    this.audioManager.playSFX('stageClear');
    this.audioManager.stopBoostSFX();
    this.boostFlameEffect.remove();

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

  exit(): void {
    this.hud.hide();
    this.audioManager.stopBGM();
    this.audioManager.stopBoostSFX();
    this.boostFlameEffect.dispose();
    this.companionManager?.dispose();
    this.companionManager = null;
    this.airShield.dispose();
    if (this.clearOverlay) {
      this.clearOverlay.remove();
      this.clearOverlay = null;
    }
    // Cleanup Three.js objects (dispose geometry/material before clearing the scene)
    this.particleBurstManager.clear(this.threeScene);

    // Dispose entities. All star types and meteorites (both still-active and
    // previously released) are pooled and freed via spawnSystem.dispose().
    this.spaceship?.dispose();
    this.spawnSystem.dispose();

    // Dispose retained scene resources
    this.boostLinesEffect.dispose();
    if (this.bgStars) {
      // SHARED: geometry / material はモジュールキャッシュ済み。dispose しない。
      this.bgStars.parent?.remove(this.bgStars);
      this.bgStars = null;
    }
    if (this.destinationPlanet) {
      disposeObject3D(this.destinationPlanet);
      this.destinationPlanet = null;
    }

    this.threeScene.clear();
    this.stars.length = 0;
    this.meteorites.length = 0;
  }

  getThreeScene(): THREE.Scene {
    return this.threeScene;
  }

  getCamera(): THREE.Camera {
    const aspect = window.innerWidth / window.innerHeight;
    if (aspect !== this.lastAspect && Number.isFinite(aspect) && aspect > 0) {
      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
      this.lastAspect = aspect;
    }
    return this.camera;
  }
}
