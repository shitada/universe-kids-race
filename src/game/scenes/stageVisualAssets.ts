import * as THREE from 'three';
import type { StageConfig } from '../../types';
import { getStageConfig, TOTAL_STAGES } from '../config/StageConfig';

const BG_STAR_COUNT = 2000;

const planetTextureCache = new Map<string, THREE.CanvasTexture>();
const planetGeometryCache = new Map<string, THREE.BufferGeometry>();
const planetMaterialCache = new Map<string, THREE.Material>();

let sharedBgStarsGeometry: THREE.BufferGeometry | null = null;
let sharedBgStarsMaterial: THREE.PointsMaterial | null = null;

function getPlanetTexture(key: string, factory: () => THREE.CanvasTexture): THREE.CanvasTexture {
  let tex = planetTextureCache.get(key);
  if (!tex) {
    tex = factory();
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
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

function prewarmBackgroundAssets(): void {
  if (!sharedBgStarsGeometry) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(BG_STAR_COUNT * 3);
    for (let i = 0; i < BG_STAR_COUNT * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 400;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    sharedBgStarsGeometry = geo;
  }
  if (!sharedBgStarsMaterial) {
    sharedBgStarsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.2,
      sizeAttenuation: true,
    });
  }
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
    ctx.ellipse(
      x,
      y,
      20 + Math.random() * 40,
      8 + Math.random() * 15,
      Math.random() * Math.PI,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

export function __resetStageSceneSharedAssetCachesForTest(): void {
  planetTextureCache.clear();
  planetGeometryCache.clear();
  planetMaterialCache.clear();
  sharedBgStarsGeometry = null;
  sharedBgStarsMaterial = null;
}

export const __stageSceneSharedAssetCachesForTest = {
  planetTextureCache,
  planetGeometryCache,
  planetMaterialCache,
  getBgStarsGeometry: (): THREE.BufferGeometry | null => sharedBgStarsGeometry,
  getBgStarsMaterial: (): THREE.PointsMaterial | null => sharedBgStarsMaterial,
};

export interface DestinationPlanetBuildResult {
  planet: THREE.Group;
  spinTarget: THREE.Object3D | null;
}

function buildDestinationPlanet(
  stageNumber: number,
  stageConfig: StageConfig,
  goalZ: number,
): DestinationPlanetBuildResult {
  const destinationPlanet = new THREE.Group();
  let spinTarget: THREE.Object3D | null = null;

  switch (stageNumber) {
    case 2: {
      const tex = getPlanetTexture('mercury', buildMercuryTexture);
      const geo = getPlanetGeometry('mercury:sphere', () => new THREE.SphereGeometry(10, 24, 24));
      const mat = getPlanetMaterial('mercury:mat', () => new THREE.MeshToonMaterial({ map: tex }));
      const mesh = makeSharedMesh(geo, mat);
      destinationPlanet.add(mesh);
      spinTarget = mesh;
      break;
    }
    case 3: {
      const tex = getPlanetTexture('venus', buildVenusTexture);
      const geo = getPlanetGeometry('venus:sphere', () => new THREE.SphereGeometry(14, 24, 24));
      const mat = getPlanetMaterial('venus:mat', () => new THREE.MeshToonMaterial({ map: tex }));
      const mesh = makeSharedMesh(geo, mat);
      destinationPlanet.add(mesh);
      spinTarget = mesh;
      break;
    }
    case 5: {
      const tex = getPlanetTexture('jupiter', buildJupiterTexture);
      const geo = getPlanetGeometry('jupiter:sphere', () => new THREE.SphereGeometry(20, 24, 24));
      const mat = getPlanetMaterial('jupiter:mat', () => new THREE.MeshToonMaterial({ map: tex }));
      const mesh = makeSharedMesh(geo, mat);
      destinationPlanet.add(mesh);
      spinTarget = mesh;
      break;
    }
    case 6: {
      const sphereGeo = getPlanetGeometry('saturn:sphere', () => new THREE.SphereGeometry(15, 24, 24));
      const sphereColor = stageConfig.planetColor;
      const sphereMat = getPlanetMaterial(
        `saturn:mat:${sphereColor}`,
        () => new THREE.MeshToonMaterial({ color: sphereColor }),
      );
      const sphere = makeSharedMesh(sphereGeo, sphereMat);
      destinationPlanet.add(sphere);
      const ringGeo = getPlanetGeometry('saturn:ring', () => new THREE.RingGeometry(20, 30, 48));
      const ringMat = getPlanetMaterial(
        'saturn:ringMat',
        () => new THREE.MeshToonMaterial({ color: 0xeebb66, side: THREE.DoubleSide }),
      );
      const ring = makeSharedMesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      destinationPlanet.add(ring);
      spinTarget = sphere;
      break;
    }
    case 7: {
      const sphereGeo = getPlanetGeometry('uranus:sphere', () => new THREE.SphereGeometry(16, 24, 24));
      const sphereMat = getPlanetMaterial(
        'uranus:mat',
        () => new THREE.MeshToonMaterial({ color: 0x66ccdd }),
      );
      const sphere = makeSharedMesh(sphereGeo, sphereMat);
      destinationPlanet.add(sphere);
      const ringGeo = getPlanetGeometry('uranus:ring', () => new THREE.RingGeometry(21, 28, 48));
      const ringMat = getPlanetMaterial(
        'uranus:ringMat',
        () => new THREE.MeshToonMaterial({ color: 0x99ddee, side: THREE.DoubleSide }),
      );
      const ring = makeSharedMesh(ringGeo, ringMat);
      ring.rotation.z = Math.PI / 2;
      destinationPlanet.add(ring);
      spinTarget = sphere;
      break;
    }
    case 9: {
      const geo = getPlanetGeometry('pluto:sphere', () => new THREE.SphereGeometry(8, 24, 24));
      const mat = getPlanetMaterial('pluto:mat', () => new THREE.MeshToonMaterial({ color: 0xbbaaaa }));
      const mesh = makeSharedMesh(geo, mat);
      destinationPlanet.add(mesh);
      spinTarget = mesh;
      break;
    }
    case 10: {
      const geo = getPlanetGeometry('sun:sphere', () => new THREE.SphereGeometry(25, 24, 24));
      const mat = getPlanetMaterial(
        'sun:mat',
        () => new THREE.MeshToonMaterial({ color: 0xffcc00, emissive: 0xffaa00, emissiveIntensity: 0.5 }),
      );
      const mesh = makeSharedMesh(geo, mat);
      destinationPlanet.add(mesh);
      destinationPlanet.add(new THREE.PointLight(0xffcc00, 2, 200));
      spinTarget = mesh;
      break;
    }
    case 11: {
      const tex = getPlanetTexture('earth', buildEarthTexture);
      const geo = getPlanetGeometry('earth:sphere', () => new THREE.SphereGeometry(15, 32, 32));
      const mat = getPlanetMaterial('earth:mat', () => new THREE.MeshToonMaterial({ map: tex }));
      const cloudTex = getPlanetTexture('earth:cloud', buildEarthCloudTexture);
      const cloudGeo = getPlanetGeometry('earth:cloudSphere', () => new THREE.SphereGeometry(15.5, 32, 32));
      const cloudMat = getPlanetMaterial(
        'earth:cloudMat',
        () => new THREE.MeshToonMaterial({ map: cloudTex, transparent: true, opacity: 0.3 }),
      );
      const earthSpin = new THREE.Group();
      earthSpin.add(makeSharedMesh(geo, mat));
      earthSpin.add(makeSharedMesh(cloudGeo, cloudMat));
      destinationPlanet.add(earthSpin);
      spinTarget = earthSpin;
      break;
    }
    default: {
      const sphereGeo = getPlanetGeometry('default:sphere', () => new THREE.SphereGeometry(15, 24, 24));
      const color = stageConfig.planetColor;
      const sphereMat = getPlanetMaterial(
        `default:mat:${color}`,
        () => new THREE.MeshToonMaterial({ color }),
      );
      const mesh = makeSharedMesh(sphereGeo, sphereMat);
      destinationPlanet.add(mesh);
      spinTarget = mesh;
      break;
    }
  }

  destinationPlanet.position.set(0, 0, goalZ);
  return { planet: destinationPlanet, spinTarget };
}

export function createDestinationPlanet(
  stageNumber: number,
  stageConfig: StageConfig,
  goalZ: number,
): DestinationPlanetBuildResult {
  return buildDestinationPlanet(stageNumber, stageConfig, goalZ);
}

export function createStageBackground(drawCount: number): THREE.Points {
  prewarmBackgroundAssets();
  const bgStars = new THREE.Points(
    sharedBgStarsGeometry as THREE.BufferGeometry,
    sharedBgStarsMaterial as THREE.PointsMaterial,
  );
  bgStars.userData.sharedAssets = true;
  bgStars.geometry.setDrawRange(0, drawCount);
  return bgStars;
}

export function prewarmStageVisualAssets(stageNumber: number): void {
  if (!Number.isInteger(stageNumber) || stageNumber < 1 || stageNumber > TOTAL_STAGES) {
    return;
  }
  prewarmBackgroundAssets();
  buildDestinationPlanet(stageNumber, getStageConfig(stageNumber), 0);
}
