import * as THREE from 'three';
import { CometTrailEffect } from '../effects/CometTrailEffect';

const CORE_GEOMETRY = new THREE.IcosahedronGeometry(0.92, 0);
const GLOW_GEOMETRY = new THREE.SphereGeometry(1.18, 14, 14);
const CORE_MATERIAL = new THREE.MeshToonMaterial({
  color: 0xf6fbff,
  emissive: 0x8fe7ff,
  emissiveIntensity: 0.95,
});
const GLOW_MATERIAL = new THREE.MeshToonMaterial({
  color: 0x7bd9ff,
  transparent: true,
  opacity: 0.28,
});

const COMET_ANIMATION_AHEAD = 90;
const COMET_ANIMATION_BEHIND = 16;
const COMET_SPEED_X = 7.2;
const COMET_SPEED_Y = -0.35;
const COMET_SPEED_Z = 11.5;

export class Comet {
  position: { x: number; y: number; z: number };
  readonly radius = 1.35;
  readonly bonusDuration = 10;
  readonly scoreBonus = 1500;
  isCollected = false;
  mesh: THREE.Group;
  private readonly core: THREE.Mesh;
  private readonly glow: THREE.Mesh;
  private readonly trailEffect: CometTrailEffect;
  private direction: -1 | 1;
  private elapsed = 0;

  constructor(x: number, y: number, z: number, direction: -1 | 1 = 1) {
    this.position = { x, y, z };
    this.direction = direction;
    const { group, core, glow, trailEffect } = this.createMesh();
    this.mesh = group;
    this.core = core;
    this.glow = glow;
    this.trailEffect = trailEffect;
    this.syncMesh();
  }

  private createMesh(): {
    group: THREE.Group;
    core: THREE.Mesh;
    glow: THREE.Mesh;
    trailEffect: CometTrailEffect;
  } {
    const group = new THREE.Group();
    const core = new THREE.Mesh(CORE_GEOMETRY, CORE_MATERIAL);
    const glow = new THREE.Mesh(GLOW_GEOMETRY, GLOW_MATERIAL);
    const trailEffect = new CometTrailEffect(this.direction);
    core.userData.sharedAssets = true;
    glow.userData.sharedAssets = true;
    group.add(glow);
    group.add(core);
    group.add(trailEffect.group);
    return { group, core, glow, trailEffect };
  }

  private syncMesh(): void {
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.z = Math.atan2(COMET_SPEED_Y, COMET_SPEED_X * this.direction);
    this.trailEffect.reset(this.direction);
  }

  update(deltaTime: number, cameraZ?: number): void {
    if (
      cameraZ !== undefined &&
      (this.position.z < cameraZ - COMET_ANIMATION_AHEAD || this.position.z > cameraZ + COMET_ANIMATION_BEHIND)
    ) {
      return;
    }

    this.elapsed += deltaTime;
    this.position.x += COMET_SPEED_X * this.direction * deltaTime;
    this.position.y += COMET_SPEED_Y * deltaTime;
    this.position.z += COMET_SPEED_Z * deltaTime;
    this.syncMesh();
    this.core.rotation.x += deltaTime * 3.8;
    this.core.rotation.y += deltaTime * 2.2;
    this.glow.scale.setScalar(1.02 + Math.sin(this.elapsed * 6) * 0.08);
    this.trailEffect.update(this.elapsed, this.direction);
  }

  collect(): void {
    this.isCollected = true;
    this.mesh.visible = false;
  }

  reset(x: number, y: number, z: number, direction: -1 | 1 = 1): void {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.direction = direction;
    this.elapsed = 0;
    this.isCollected = false;
    this.mesh.visible = true;
    this.core.rotation.set(0, 0, 0);
    this.glow.scale.setScalar(1);
    this.syncMesh();
  }

  recycle(): void {
    this.mesh.parent?.remove(this.mesh);
    this.elapsed = 0;
    this.isCollected = false;
    this.mesh.visible = true;
    this.core.rotation.set(0, 0, 0);
    this.glow.scale.setScalar(1);
    this.syncMesh();
  }

  dispose(): void {
    this.mesh.parent?.remove(this.mesh);
    this.trailEffect.dispose();
  }
}
